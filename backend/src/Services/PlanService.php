<?php

declare(strict_types=1);

namespace PersonaLearn\Services;

final class PlanService
{
    private FreeContentService $freeContentService;

    public function __construct(FreeContentService $freeContentService)
    {
        $this->freeContentService = $freeContentService;
    }

    public function generate(array $profile): array
    {
        $subject = (string) ($profile['subject'] ?? 'programming');
        $goal = (string) ($profile['goal'] ?? 'exam');
        $weeklyHours = max(1, (int) ($profile['weeklyHours'] ?? 5));
        $sessionLength = max(15, (int) ($profile['sessionLength'] ?? 30));
        $studyDays = $profile['studyDays'] ?? ['Monday', 'Wednesday', 'Friday'];
        $pace = (string) ($profile['pace'] ?? 'balanced');
        $supportMode = (string) ($profile['supportMode'] ?? 'balanced');
        $confidence = (int) ($profile['confidence'] ?? 50);
        $weakConcept = (string) ($profile['diagnosticWeakConcept'] ?? $profile['weakConcept'] ?? '');
        $hobbies = is_array($profile['hobbies'] ?? null) ? array_values(array_filter(array_map('strval', $profile['hobbies']))) : [];

        if (!is_array($studyDays) || count($studyDays) === 0) {
            $studyDays = ['Monday', 'Wednesday', 'Friday'];
        }

        $subjectConcepts = $this->subjectConcepts($subject);
        $orderedConcepts = $this->prioritizeConcepts($subjectConcepts, $weakConcept);
        $topic = $weakConcept !== '' ? $weakConcept : $this->pickTopicBySubject($subject);
        $wiki = $this->freeContentService->searchWikipedia($topic);
        $books = $this->freeContentService->searchOpenLibrary($topic);

        $sessionsPerWeek = max(1, (int) ceil(($weeklyHours * 60) / $sessionLength));
        $sessionsPerWeek = min(max(4, count($orderedConcepts)), $sessionsPerWeek);
        $planItems = [];
        for ($i = 0; $i < $sessionsPerWeek; $i++) {
            $day = $studyDays[$i % count($studyDays)];
            $concept = $orderedConcepts[$i % count($orderedConcepts)];
            $planItems[] = [
                'day' => $day,
                'concept' => $concept,
                'taskTitle' => $this->taskTitle($subject, $concept, $goal, $pace),
                'estimatedMinutes' => $this->sessionMinutes($sessionLength, $weeklyHours, $pace),
                'supportLevel' => $this->supportLevel($confidence, $supportMode),
                'reason' => $this->buildReason($concept, $goal, $supportMode, $pace, $confidence, $hobbies, $weakConcept),
                'status' => 'upcoming',
                'recommendedResourceType' => $this->resourceType($concept, $supportMode, $pace),
            ];
        }

        $weakConceptName = $weakConcept !== '' ? $weakConcept : ($orderedConcepts[0] ?? '');
        $summary = $this->buildSummary($subject, $goal, $weakConceptName, $supportMode, $pace, $confidence);

        return [
            'goal' => $goal,
            'subject' => $subject,
            'weakConcept' => $weakConceptName,
            'weeklyHours' => $weeklyHours,
            'sessionLength' => $sessionLength,
            'sessionsPerWeek' => $sessionsPerWeek,
            'summary' => $summary,
            'weeklyPlan' => $planItems,
            'planItems' => $planItems,
            'personalization' => [
                'hobbies' => $hobbies,
                'studyTime' => (string) ($profile['studyTime'] ?? 'afternoon'),
                'pace' => $pace,
                'supportMode' => $supportMode,
                'confidence' => $confidence,
                'explanationLevel' => (string) ($profile['explanationLevel'] ?? 'normal'),
            ],
            'rationale' => [
                'text' => $this->buildReason($weakConceptName, $goal, $supportMode, $pace, $confidence, $hobbies, $weakConcept),
                'weakConceptFirst' => true,
            ],
            'nextLesson' => $planItems[0] ?? null,
            'freeResources' => [
                'wikipedia' => $wiki,
                'openLibraryBooks' => $books,
            ],
            'generatedAt' => gmdate('c'),
        ];
    }

    private function pickTopicBySubject(string $subject): string
    {
        return match ($subject) {
            'writing' => 'Academic writing',
            'science' => 'Scientific method',
            default => 'Computer programming',
        };
    }

    private function sessionFocus(string $subject, int $index): string
    {
        $map = [
            'programming' => ['Variables and data types', 'Functions', 'Loops and conditionals', 'Practice tasks'],
            'writing' => ['Thesis statements', 'Essay structure', 'Citation practice', 'Editing and revision'],
            'science' => ['Scientific method', 'Core concepts', 'Lab reasoning', 'Review quiz'],
        ];

        $tracks = $map[$subject] ?? $map['programming'];
        return $tracks[$index % count($tracks)];
    }

    private function sessionTask(string $subject, string $goal, int $index): string
    {
        $base = match ($subject) {
            'writing' => 'Write one focused paragraph and improve it in one revision pass.',
            'science' => 'Explain one concept with a real-world example and answer two review questions.',
            default => 'Solve one coding exercise and explain your solution in plain language.',
        };

        if ($goal === 'exam') {
            return $base . ' End with one timed question.';
        }

        return $base;
    }

    private function subjectConcepts(string $subject): array
    {
        return match ($subject) {
            'writing' => ['Thesis Statement', 'Paragraph Structure', 'Grammar Clarity', 'Referencing'],
            'science' => ['Scientific Method', 'Matter and Energy', 'Forces and Motion', 'Basic Biology'],
            default => ['Variables', 'Conditionals', 'Loops', 'Functions'],
        };
    }

    private function prioritizeConcepts(array $concepts, string $weakConcept): array
    {
        if ($weakConcept === '' || !in_array($weakConcept, $concepts, true)) {
            return $concepts;
        }

        $ordered = array_values(array_filter($concepts, static fn (string $concept): bool => $concept !== $weakConcept));
        array_unshift($ordered, $weakConcept);
        return $ordered;
    }

    private function taskTitle(string $subject, string $concept, string $goal, string $pace): string
    {
        $prefix = $pace === 'fast' ? 'Challenge' : ($pace === 'slow' ? 'Review' : 'Practice');
        $suffix = $goal === 'exam' ? 'for exam readiness' : 'for steady progress';

        return sprintf('%s %s %s', $prefix, $concept, $suffix);
    }

    private function sessionMinutes(int $sessionLength, int $weeklyHours, string $pace): int
    {
        $minutes = $sessionLength;

        if ($weeklyHours <= 3) {
            $minutes = min($minutes, 25);
        }

        if ($pace === 'slow') {
            $minutes = min($minutes, 25);
        }

        if ($pace === 'fast' && $minutes < 20) {
            $minutes = 20;
        }

        return max(15, $minutes);
    }

    private function supportLevel(int $confidence, string $supportMode): string
    {
        if ($supportMode === 'guided' || $confidence < 40) {
            return 'guided';
        }

        if ($supportMode === 'independent' || $confidence >= 75) {
            return 'light';
        }

        return 'balanced';
    }

    private function resourceType(string $concept, string $supportMode, string $pace): string
    {
        if ($supportMode === 'guided' || $pace === 'slow') {
            return 'guided-notes';
        }

        return match ($concept) {
            'Loops', 'Conditionals', 'Forces and Motion', 'Grammar Clarity' => 'practice',
            'Referencing', 'Functions', 'Thesis Statement' => 'example',
            default => 'review',
        };
    }

    private function buildReason(string $concept, string $goal, string $supportMode, string $pace, int $confidence, array $hobbies, string $weakConcept): string
    {
        $reasonParts = [];

        if ($concept === $weakConcept) {
            $reasonParts[] = sprintf('This is your weakest diagnostic concept: %s.', $concept);
        }

        $reasonParts[] = sprintf('It matches your %s goal.', $goal);
        $reasonParts[] = sprintf('Your %s pace and %s support mode shape the difficulty.', $pace, $supportMode);

        if ($confidence < 50) {
            $reasonParts[] = 'Low confidence means this session stays more guided.';
        }

        if (!empty($hobbies)) {
            $reasonParts[] = sprintf('Your hobbies (%s) are available for examples.', implode(', ', array_slice($hobbies, 0, 2)));
        }

        return implode(' ', $reasonParts);
    }

    private function buildSummary(string $subject, string $goal, string $weakConcept, string $supportMode, string $pace, int $confidence): string
    {
        return sprintf(
            'Prototype adaptive plan for %s. Focus first on %s with %s support, %s pace, and %d%% confidence.',
            $subject,
            $weakConcept !== '' ? $weakConcept : 'your selected track',
            $supportMode,
            $pace,
            $confidence
        );
    }
}
