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
        $userId = trim((string) ($payload['userId'] ?? ''));
        $subject = trim((string) ($payload['subject'] ?? 'programming'));
        $concept = trim((string) ($payload['concept'] ?? ''));
        $question = trim((string) ($payload['question'] ?? ''));
        $sourceMode = $this->normalizeChoice((string) ($payload['sourceMode'] ?? 'both'), ['official', 'uploaded', 'both'], 'both');
        $actionType = $this->normalizeChoice((string) ($payload['actionType'] ?? 'normal'), ['normal', 'explain_simpler', 'another_example', 'use_hobby', 'uploaded_only'], 'normal');
        $profile = is_array($payload['learnerProfile'] ?? null) ? $payload['learnerProfile'] : [];
        $uploadedNotesText = trim((string) ($payload['uploadedNotesText'] ?? ''));
        $notesSource = null;

        if ($uploadedNotesText === '' && $userId !== '' && in_array($sourceMode, ['uploaded', 'both'], true)) {
            $material = $this->materialService->latestForUser($userId, $concept !== '' ? $concept : null);
            if ($material !== null && ((bool) ($material['usableByTutor'] ?? true))) {
                $uploadedNotesText = (string) ($material['notesText'] ?? '');
                $notesSource = $material;
            }
        }

        $sourceUsed = 'official';
        if ($uploadedNotesText !== '') {
            $sourceUsed = $sourceMode === 'uploaded' ? 'uploaded' : ($sourceMode === 'both' ? 'both' : 'official');
        }

        $geminiKey = trim((string) (getenv('GEMINI_API_KEY') ?: ''));
        if ($geminiKey !== '') {
            $answer = $this->callGemini($geminiKey, $this->buildPrompt($subject, $concept, $question, $actionType, $profile, $uploadedNotesText, $sourceMode));
            if ($answer !== '') {
                return [
                    'ok' => true,
                    'answer' => $answer,
                    'sourceUsed' => $sourceUsed,
                    'usedNotes' => $uploadedNotesText !== '',
                    'notesSource' => $notesSource,
                ];
            }
        }

        return [
            'ok' => true,
            'answer' => $this->buildFallbackAnswer($subject, $concept, $question, $actionType, $profile, $uploadedNotesText, $sourceMode),
            'sourceUsed' => $sourceUsed,
            'usedNotes' => $uploadedNotesText !== '',
            'notesSource' => $notesSource,
        ];
    }

    private function buildPrompt(string $subject, string $concept, string $question, string $actionType, array $profile, string $uploadedNotesText, string $sourceMode): string
    {
        $hobbies = is_array($profile['hobbies'] ?? null) ? implode(', ', array_map('strval', $profile['hobbies'])) : '';
        $supportMode = (string) ($profile['supportMode'] ?? 'balanced');
        $confidence = (string) ($profile['confidence'] ?? '50');
        $goal = (string) ($profile['goal'] ?? 'learning');
        $notesText = $uploadedNotesText !== '' ? "Uploaded notes:\n" . $uploadedNotesText : 'No uploaded notes available.';

        return implode("\n", [
            'You are PersonaLearn tutor for a varsity showcase.',
            'Keep the answer concise, specific, and educational.',
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
            'If helpful, use a hobby analogy. If sourceMode includes uploaded notes, ground the answer in the note content.',
        ]);
    }

    private function callGemini(string $apiKey, string $prompt): string
    {
        $endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . rawurlencode($apiKey);
        $payload = json_encode([
            'contents' => [[
                'parts' => [[
                    'text' => $prompt,
                ]],
            ]],
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 320,
            ],
        ]);

        if ($payload === false) {
            return '';
        }

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'timeout' => 12,
                'header' => "Content-Type: application/json\r\nAccept: application/json\r\n",
                'content' => $payload,
            ],
        ]);

        $response = @file_get_contents($endpoint, false, $context);
        if ($response === false) {
            return '';
        }

        $decoded = json_decode($response, true);
        $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? '';
        return is_string($text) ? trim($text) : '';
    }

    private function buildFallbackAnswer(string $subject, string $concept, string $question, string $actionType, array $profile, string $uploadedNotesText, string $sourceMode): string
    {
        $goal = (string) ($profile['goal'] ?? 'your goal');
        $supportMode = (string) ($profile['supportMode'] ?? 'balanced');
        $confidence = (int) ($profile['confidence'] ?? 50);
        $hobbies = is_array($profile['hobbies'] ?? null) ? array_values(array_map('strval', $profile['hobbies'])) : [];
        $hobby = $hobbies[0] ?? 'your interests';
        $notesSnippet = $uploadedNotesText !== '' ? $this->notesSnippet($uploadedNotesText) : '';
        $conceptName = $concept !== '' ? $concept : $this->defaultConcept($subject);
        $modeLead = match ($actionType) {
            'explain_simpler' => 'Here is a simpler version: ',
            'another_example' => 'Here is another example: ',
            'use_hobby' => 'Using your hobby as the example: ',
            'uploaded_only' => 'Using your uploaded notes: ',
            default => 'Here is a personalized explanation: ',
        };

        $answer = $modeLead;
        $answer .= sprintf('For %s, focus on %s because it matches your %s goal and %s support mode.', $subject, $conceptName, $goal, $supportMode);
        if ($confidence < 50) {
            $answer .= ' I will keep this guided and step-by-step.';
        }

        $answer .= ' Think of it like ' . $this->hobbyAnalogy($subject, $conceptName, $hobby) . '.';

        if ($notesSnippet !== '' && in_array($sourceMode, ['uploaded', 'both'], true)) {
            $answer .= ' Your notes mention ' . $notesSnippet . ', so this connects directly to that idea.';
        }

        if ($question !== '') {
            $answer .= ' You asked: "' . $question . '".';
        }

        return $answer;
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
            'cooking' => sprintf('following a recipe where each step matters for %s', $concept),
            'art' => sprintf('sketching a draft and refining it until %s looks clear', $concept),
            default => sprintf('a simple example that keeps %s easy to remember', $concept),
        };
    }

    private function normalizeChoice(string $value, array $allowedValues, string $fallback): string
    {
        return in_array($value, $allowedValues, true) ? $value : $fallback;
    }
}
