<?php

declare(strict_types=1);

namespace PersonaLearn\Services;

final class TutorService
{
    public function __construct(private MaterialService $materialService)
    {
    }

    public function answer(array $payload): array
    {
        try {
            $userId = trim((string) ($payload['userId'] ?? ''));
            $subject = trim((string) ($payload['subject'] ?? 'programming'));
            $question = trim((string) ($payload['question'] ?? ''));
            $concept = $this->resolveConceptForQuestion(
                $subject,
                trim((string) ($payload['concept'] ?? '')),
                $question
            );
            $actionType = $this->normalizeChoice((string) ($payload['actionType'] ?? 'normal'), ['normal', 'explain_simpler', 'another_example', 'use_hobby', 'uploaded_only'], 'normal');
            $sourceMode = $this->normalizeChoice((string) ($payload['sourceMode'] ?? 'both'), ['official', 'uploaded', 'both'], 'both');
            $profile = is_array($payload['learnerProfile'] ?? null) ? $payload['learnerProfile'] : [];
            $uploadedNotesText = trim((string) ($payload['uploadedNotesText'] ?? ''));
            $notesSource = null;
            $notesRelevant = false;

            if ($uploadedNotesText === '' && $userId !== '' && in_array($sourceMode, ['uploaded', 'both'], true)) {
                $material = $this->materialService->latestForUser($userId);
                if ($material !== null && ((bool) ($material['usableByTutor'] ?? true))) {
                    $notesRelevant = $this->isMaterialRelevantToQuestion($subject, $concept, $question, $material);

                    if ($notesRelevant) {
                        $uploadedNotesText = (string) ($material['notesText'] ?? '');
                        $notesSource = $material;
                    }
                }
            }

            $sourceUsed = 'official';
            if ($uploadedNotesText !== '') {
                $sourceUsed = $sourceMode === 'uploaded' ? 'uploaded' : ($sourceMode === 'both' ? 'both' : 'official');
            }

            $answer = $this->buildDeterministicAnswer($subject, $concept, $question, $profile, $uploadedNotesText);
            $aiUsed = false;

            if ($this->shouldUseGemini() && $question !== '') {
                $prompt = $this->buildPrompt($subject, $concept, $question, $actionType, $profile, $uploadedNotesText, $sourceMode);
                $geminiAnswer = $this->callGemini(
                    $this->geminiApiKey(),
                    $prompt,
                    $this->geminiModel(),
                    $this->geminiTimeoutSeconds()
                );

                if ($geminiAnswer !== '') {
                    $candidateAnswer = $this->sanitizeAiAnswer($geminiAnswer);
                    if ($this->isUsableAiAnswer($candidateAnswer)) {
                        $answer = $candidateAnswer;
                        $aiUsed = true;
                    } else {
                        $retryPrompt = $prompt . "\n" . 'Rewrite the answer in 5-7 complete sentences with clear explanation and one example.';
                        $retryAnswer = $this->callGemini(
                            $this->geminiApiKey(),
                            $retryPrompt,
                            $this->geminiModel(),
                            $this->geminiTimeoutSeconds()
                        );

                        if ($retryAnswer !== '') {
                            $retryCandidate = $this->sanitizeAiAnswer($retryAnswer);
                            if ($this->isUsableAiAnswer($retryCandidate)) {
                                $answer = $retryCandidate;
                                $aiUsed = true;
                            }
                        }
                    }
                }
            }

            return [
                'ok' => true,
                'answer' => $answer,
                'aiUsed' => $aiUsed,
                'sourceUsed' => $sourceUsed,
                'usedNotes' => $uploadedNotesText !== '',
                'notesSource' => $notesSource,
            ];
        } catch (\Throwable $exception) {
            $subject = trim((string) ($payload['subject'] ?? 'programming'));
            $concept = trim((string) ($payload['concept'] ?? ''));

            return [
                'ok' => true,
                'answer' => 'I can explain this using your profile. ' . $this->basicConceptExplanation($subject, $concept),
                'aiUsed' => false,
                'sourceUsed' => 'official',
                'usedNotes' => false,
                'notesSource' => null,
            ];
        }
    }

    private function resolveConceptForQuestion(string $subject, string $requestedConcept, string $question): string
    {
        $questionKey = strtolower(trim($question));
        $subjectKey = strtolower(trim($subject));

        if ($questionKey === '') {
            return $requestedConcept;
        }

        if ($subjectKey === 'science') {
            if (
                str_contains($questionKey, 'motion') ||
                str_contains($questionKey, 'force') ||
                str_contains($questionKey, 'speed') ||
                str_contains($questionKey, 'acceleration') ||
                str_contains($questionKey, 'newton') ||
                str_contains($questionKey, 'gravity') ||
                str_contains($questionKey, 'inertia') ||
                str_contains($questionKey, 'action') ||
                str_contains($questionKey, 'reaction') ||
                str_contains($questionKey, 'weight') ||
                str_contains($questionKey, 'mass')
            ) {
                return 'Forces and Motion';
            }

            if (str_contains($questionKey, 'energy') || str_contains($questionKey, 'matter')) {
                return 'Matter and Energy';
            }

            if (
                str_contains($questionKey, 'cell') ||
                str_contains($questionKey, 'biology') ||
                str_contains($questionKey, 'organism') ||
                str_contains($questionKey, 'stem') ||
                str_contains($questionKey, 'dna') ||
                str_contains($questionKey, 'organ')
            ) {
                return 'Basic Biology';
            }

            if (str_contains($questionKey, 'hypothesis') || str_contains($questionKey, 'experiment') || str_contains($questionKey, 'scientific method')) {
                return 'Scientific Method';
            }
        }

        if ($subjectKey === 'writing' || $subjectKey === 'academic writing') {
            if (str_contains($questionKey, 'thesis')) {
                return 'Thesis Statement';
            }

            if (str_contains($questionKey, 'paragraph') || str_contains($questionKey, 'topic sentence')) {
                return 'Paragraph Structure';
            }

            if (str_contains($questionKey, 'grammar') || str_contains($questionKey, 'clarity') || str_contains($questionKey, 'sentence')) {
                return 'Grammar Clarity';
            }

            if (str_contains($questionKey, 'cite') || str_contains($questionKey, 'reference') || str_contains($questionKey, 'citation')) {
                return 'Referencing';
            }
        }

        if ($subjectKey === 'programming') {
            if (str_contains($questionKey, 'variable')) {
                return 'Variables';
            }

            if (str_contains($questionKey, 'loop') || str_contains($questionKey, 'iterate')) {
                return 'Loops';
            }

            if (str_contains($questionKey, 'if ') || str_contains($questionKey, 'condition')) {
                return 'Conditionals';
            }

            if (str_contains($questionKey, 'function') || str_contains($questionKey, 'parameter') || str_contains($questionKey, 'return')) {
                return 'Functions';
            }
        }

        return $requestedConcept;
    }

    private function isMaterialRelevantToQuestion(string $subject, string $concept, string $question, array $material): bool
    {
        $questionKey = strtolower(trim($question));
        $subjectKey = strtolower(trim($subject));
        $conceptKey = strtolower(trim($concept));
        $materialConceptKey = strtolower(trim((string) ($material['concept'] ?? '')));
        $materialTitleKey = strtolower(trim((string) ($material['title'] ?? '')));
        $materialNotesKey = strtolower(trim((string) ($material['notesText'] ?? '')));

        if ($questionKey === '') {
            return false;
        }

        $terms = array_values(array_filter(array_unique(array_merge(
            $this->questionKeywords($subjectKey, $questionKey),
            $conceptKey !== '' ? [$conceptKey] : []
        ))));

        foreach ($terms as $term) {
            if ($term === '') {
                continue;
            }

            if (str_contains($materialConceptKey, $term) || str_contains($materialTitleKey, $term) || str_contains($materialNotesKey, $term)) {
                return true;
            }
        }

        return false;
    }

    private function questionKeywords(string $subjectKey, string $questionKey): array
    {
        $keywords = [];

        if ($subjectKey === 'science') {
            if (preg_match('/\b(motion|force|forces|speed|velocity|acceleration|gravity|inertia|mass|weight|newton|newtons?)\b/u', $questionKey)) {
                $keywords[] = 'forces and motion';
            }

            if (preg_match('/\b(energy|matter|atom|atoms|energy transfer)\b/u', $questionKey)) {
                $keywords[] = 'matter and energy';
            }

            if (preg_match('/\b(cell|biology|organism|dna|stem|organ)\b/u', $questionKey)) {
                $keywords[] = 'basic biology';
            }

            if (preg_match('/\b(scientific method|hypothesis|experiment|observation)\b/u', $questionKey)) {
                $keywords[] = 'scientific method';
            }
        }

        if ($subjectKey === 'writing') {
            if (preg_match('/\b(thesis|argument|claim)\b/u', $questionKey)) {
                $keywords[] = 'thesis statement';
            }

            if (preg_match('/\b(paragraph|topic sentence|structure)\b/u', $questionKey)) {
                $keywords[] = 'paragraph structure';
            }

            if (preg_match('/\b(grammar|clarity|sentence)\b/u', $questionKey)) {
                $keywords[] = 'grammar clarity';
            }

            if (preg_match('/\b(cite|citation|reference|referencing)\b/u', $questionKey)) {
                $keywords[] = 'referencing';
            }
        }

        if ($subjectKey === 'programming') {
            if (preg_match('/\b(variable|variables)\b/u', $questionKey)) {
                $keywords[] = 'variables';
            }

            if (preg_match('/\b(loop|loops|iterate)\b/u', $questionKey)) {
                $keywords[] = 'loops';
            }

            if (preg_match('/\b(if|condition|conditional)\b/u', $questionKey)) {
                $keywords[] = 'conditionals';
            }

            if (preg_match('/\b(function|parameter|return)\b/u', $questionKey)) {
                $keywords[] = 'functions';
            }
        }

        return $keywords;
    }

    private function buildPrompt(string $subject, string $concept, string $question, string $actionType, array $profile, string $uploadedNotesText, string $sourceMode): string
    {
        $hobbies = is_array($profile['hobbies'] ?? null) ? implode(', ', array_map('strval', $profile['hobbies'])) : '';
        $supportMode = (string) ($profile['supportMode'] ?? 'balanced');
        $confidence = (string) ($profile['confidence'] ?? '50');
        $goal = (string) ($profile['goal'] ?? 'learning');
        $notesText = $uploadedNotesText !== '' ? "Uploaded notes:\n" . $uploadedNotesText : 'No uploaded notes available.';

        return implode("\n", [
            'You are a helpful tutor. Answer the student directly.',
            'Do not use greetings, intro speeches, or words like showcase/presentation/demo.',
            'Start with the concept explanation in sentence 1.',
            'Use 4-8 concise sentences in plain language.',
            'If the question is short (for example: "what" or "answer"), infer it from concept + subject and still provide a useful explanation.',
            'Do not claim to use uploaded notes unless they are included below.',
            'Subject: ' . $subject,
            'Concept: ' . $concept,
            'Question: ' . $question,
            'Action: ' . $actionType,
            'Source mode: ' . $sourceMode,
            'Goal: ' . $goal,
            'Support mode: ' . $supportMode,
            'Confidence: ' . $confidence,
            'Hobbies: ' . $hobbies,
            $notesText,
            'If helpful, use one short hobby analogy.',
            'If sourceMode includes uploaded notes, ground the answer in the note content.',
        ]);
    }

    private function sanitizeAiAnswer(string $answer): string
    {
        $clean = trim($answer);

        // Remove common opener text that sounds like a presentation script.
        $clean = preg_replace('/^(hey there!?\s*)/i', '', $clean) ?? $clean;
        $clean = preg_replace('/\b(great question[^\.!?]*[\.!?])\s*/i', '', $clean) ?? $clean;
        $clean = preg_replace('/\b(welcome to[^\.!?]*[\.!?])\s*/i', '', $clean) ?? $clean;
        $clean = preg_replace('/\b(personalearn\s+showcase[^\.!?]*[\.!?])\s*/i', '', $clean) ?? $clean;
        $clean = preg_replace('/\b(varsity\s+showcase[^\.!?]*[\.!?])\s*/i', '', $clean) ?? $clean;

        $clean = trim($clean);
        return $clean !== '' ? $clean : trim($answer);
    }

    private function isUsableAiAnswer(string $answer): bool
    {
        $trimmed = trim($answer);
        if ($trimmed === '') {
            return false;
        }

        // Guard against empty or obviously clipped generations while allowing concise answers.
        if (strlen($trimmed) < 25) {
            return false;
        }

        // Reject answers that look cut off mid-sentence.
        if (preg_match('/[\-\x{2014}]$/u', $trimmed) === 1) {
            return false;
        }

        if (preg_match('/[\.!?]$/', $trimmed) !== 1 && strlen($trimmed) < 120) {
            return false;
        }

        return true;
    }

    private function callGemini(string $apiKey, string $prompt, string $model, int $timeoutSeconds): string
    {
        $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($apiKey);
        $payload = json_encode([
            'contents' => [[
                'parts' => [[
                    'text' => $prompt,
                ]],
            ]],
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 480,
            ],
        ]);

        if ($payload === false) {
            return '';
        }

        $response = $this->postJson($endpoint, $payload, $timeoutSeconds);
        if ($response === '') {
            return '';
        }

        $decoded = json_decode($response, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return '';
        }

        $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? '';
        return is_string($text) ? trim($text) : '';
    }

    private function postJson(string $endpoint, string $payload, int $timeoutSeconds): string
    {
        if (function_exists('curl_init')) {
            return $this->postJsonWithCurl($endpoint, $payload, $timeoutSeconds);
        }

        return $this->postJsonWithStream($endpoint, $payload, $timeoutSeconds);
    }

    private function postJsonWithCurl(string $endpoint, string $payload, int $timeoutSeconds): string
    {
        $ch = curl_init($endpoint);
        if ($ch === false) {
            return '';
        }

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, max(3, min($timeoutSeconds, 30)));
        curl_setopt($ch, CURLOPT_TIMEOUT, max(3, min($timeoutSeconds, 30)));
        // Demo reliability: some local PHP distributions miss CA bundles on Windows.
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

        $response = curl_exec($ch);
        $statusCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (!is_string($response) || $statusCode < 200 || $statusCode >= 300) {
            return '';
        }

        return trim($response);
    }

    private function postJsonWithStream(string $endpoint, string $payload, int $timeoutSeconds): string
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n",
                'content' => $payload,
                'timeout' => max(3, min($timeoutSeconds, 30)),
                'ignore_errors' => true,
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ],
        ]);

        $response = @file_get_contents($endpoint, false, $context);
        if (!is_string($response)) {
            return '';
        }

        $headers = [];
        if (function_exists('http_get_last_response_headers')) {
            $fetchedHeaders = http_get_last_response_headers();
            if (is_array($fetchedHeaders)) {
                $headers = $fetchedHeaders;
            }
        }

        $statusLine = isset($headers[0]) ? (string) $headers[0] : '';
        if (!preg_match('/\s(\d{3})\s/', $statusLine, $matches)) {
            return '';
        }

        $statusCode = (int) $matches[1];
        if ($statusCode < 200 || $statusCode >= 300) {
            return '';
        }

        return trim($response);
    }

    private function buildDeterministicAnswer(string $subject, string $concept, string $question, array $profile, string $uploadedNotesText): string
    {
        $goal = (string) ($profile['goal'] ?? 'your goal');
        $supportMode = (string) ($profile['supportMode'] ?? 'balanced');
        $confidence = (int) ($profile['confidence'] ?? 50);
        $hobbies = is_array($profile['hobbies'] ?? null) ? array_values(array_map('strval', $profile['hobbies'])) : [];
        $hobby = trim((string) ($hobbies[0] ?? ''));
        $notesSnippet = $uploadedNotesText !== '' ? $this->notesSnippet($uploadedNotesText) : '';
        $conceptName = $concept !== '' ? $concept : $this->defaultConcept($subject);
        $intent = $this->detectIntent($question);
        $confidenceLabel = $confidence >= 75 ? 'high' : ($confidence >= 50 ? 'medium' : 'low');

        $answer = $this->buildIntentExplanation($intent, $subject, $conceptName);
        $answer .= sprintf(' Your goal is %s, so this explanation stays practical.', $goal);
        $answer .= sprintf(' Your support mode is %s and your confidence is %s, so I am keeping the steps clear.', $supportMode, $confidenceLabel);

        if ($hobby !== '') {
            $answer .= ' Since you like ' . $hobby . ', think of it like ' . $this->hobbyAnalogy($subject, $conceptName, $hobby) . '.';
        }

        if ($notesSnippet !== '') {
            $answer .= ' From your notes: ' . $notesSnippet;
        }

        return $answer;
    }

    private function detectIntent(string $question): string
    {
        $normalized = strtolower(trim($question));

        if ($normalized === '') {
            return 'fallback';
        }

        if (str_contains($normalized, 'what is') || str_contains($normalized, 'define')) {
            return 'definition';
        }

        if (str_contains($normalized, 'explain')) {
            return 'explain';
        }

        if (str_contains($normalized, 'example')) {
            return 'example';
        }

        return 'fallback';
    }

    private function buildIntentExplanation(string $intent, string $subject, string $concept): string
    {
        $base = $this->basicConceptExplanation($subject, $concept);

        return match ($intent) {
            'definition' => $base . ' Simple example: when you use or move something in daily life, you are applying this idea.',
            'explain' => $base . ' Step-by-step: first identify the concept, then see where it appears in real life, then practice one small example.',
            'example' => $base . ' Examples: 1) everyday life situation, 2) classroom problem, 3) quick practice question.',
            default => $base . ' In general, this concept helps you understand and explain changes around you.',
        };
    }

    private function basicConceptExplanation(string $subject, string $concept): string
    {
        $subjectKey = strtolower(trim($subject));
        $conceptKey = strtolower(trim($concept));

        if ($subjectKey === 'science') {
            if (str_contains($conceptKey, 'energy')) {
                return 'Energy is the ability to do work or cause change. For example, when you move or lift something, you are using energy.';
            }

            if (str_contains($conceptKey, 'matter')) {
                return 'Matter is anything that has mass and takes up space, like air, water, or your body.';
            }

            if (str_contains($conceptKey, 'force') || str_contains($conceptKey, 'motion')) {
                return 'Force is a push or pull, and motion is how an object moves when forces act on it.';
            }

            if (str_contains($conceptKey, 'scientific method')) {
                return 'The scientific method is a process: ask a question, form a hypothesis, test it, and analyze results.';
            }

            if (str_contains($conceptKey, 'biology') || str_contains($conceptKey, 'cell')) {
                return 'Basic biology studies living things, and the cell is the basic unit of life.';
            }
        }

        if ($subjectKey === 'programming') {
            if (str_contains($conceptKey, 'loop')) {
                return 'A loop repeats a block of instructions until a condition is met.';
            }

            if (str_contains($conceptKey, 'function')) {
                return 'A function is a reusable block of code that does one task and can return a result.';
            }
        }

        if ($subjectKey === 'writing') {
            if (str_contains($conceptKey, 'thesis')) {
                return 'A thesis statement is the main claim of your essay, and the rest of your writing supports it.';
            }

            if (str_contains($conceptKey, 'paragraph')) {
                return 'A strong paragraph has a topic sentence, support, and explanation.';
            }
        }

        return sprintf('%s is an important concept in %s, and understanding it helps you solve problems more clearly.', $concept !== '' ? $concept : 'This topic', $subject !== '' ? $subject : 'your subject');
    }

    private function defaultConcept(string $subject): string
    {
        return match ($subject) {
            'writing' => 'Thesis Statement',
            'science' => 'Scientific Method',
            default => 'Variables',
        };
    }

    private function notesSnippet(string $notesText): string
    {
        $clean = trim(preg_replace('/\s+/', ' ', $notesText) ?? $notesText);
        if ($clean === '') {
            return '';
        }

        return substr($clean, 0, 120);
    }

    private function hobbyAnalogy(string $subject, string $concept, string $hobby): string
    {
        $hobby = strtolower($hobby);

        return match ($hobby) {
            'gaming' => sprintf('a game quest where each step unlocks the next skill for %s', $concept),
            'sports' => sprintf('training drills where you repeat %s until it becomes natural', $concept),
            'music' => sprintf('a song pattern where timing and repetition help you master %s', $concept),
            'movies' => sprintf('building a scene by scene story that keeps %s in order', $concept),
            'anime' => sprintf('a story arc where each scene builds momentum, like learning %s step by step', $concept),
            'cooking' => sprintf('following a recipe where each step matters for %s', $concept),
            'art' => sprintf('sketching a draft and refining it until %s looks clear', $concept),
            default => sprintf('a simple example that keeps %s easy to remember', $concept),
        };
    }

    private function normalizeChoice(string $value, array $allowedValues, string $fallback): string
    {
        return in_array($value, $allowedValues, true) ? $value : $fallback;
    }

    private function shouldUseGemini(): bool
    {
        return $this->envFlag('USE_GEMINI', false) && $this->geminiApiKey() !== '';
    }

    private function geminiApiKey(): string
    {
        return $this->envString('GEMINI_API_KEY', '');
    }

    private function geminiModel(): string
    {
        $model = $this->envString('GEMINI_MODEL', '');
        return $model !== '' ? $model : 'gemini-1.5-flash';
    }

    private function geminiTimeoutSeconds(): int
    {
        $timeout = (int) $this->envString('GEMINI_TIMEOUT_SECONDS', '12');
        if ($timeout < 3) {
            return 12;
        }

        return min($timeout, 30);
    }

    private function envFlag(string $key, bool $default): bool
    {
        $value = $this->envString($key, '');
        if ($value === '') {
            return $default;
        }

        $normalized = strtolower(trim($value));
        return in_array($normalized, ['1', 'true', 'yes', 'on'], true);
    }

    private function envString(string $key, string $default): string
    {
        $value = getenv($key);
        if ($value !== false) {
            return trim((string) $value);
        }

        if (isset($_ENV[$key])) {
            return trim((string) $_ENV[$key]);
        }

        return $default;
    }
}
