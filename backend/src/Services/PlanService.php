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
        $weeklyHours = (int) ($profile['weeklyHours'] ?? 5);
        $sessionLength = (int) ($profile['sessionLength'] ?? 30);
        $studyDays = $profile['studyDays'] ?? ['Monday', 'Wednesday', 'Friday'];
        $hobbies = $profile['hobbies'] ?? [];

        if (!is_array($studyDays) || count($studyDays) === 0) {
            $studyDays = ['Monday', 'Wednesday', 'Friday'];
        }

        $topic = $this->pickTopicBySubject($subject);
        $wiki = $this->freeContentService->searchWikipedia($topic);
        $books = $this->freeContentService->searchOpenLibrary($topic);

        $sessionsPerWeek = max(1, (int) floor(($weeklyHours * 60) / max(15, $sessionLength)));
        $planItems = [];
        for ($i = 0; $i < $sessionsPerWeek; $i++) {
            $day = $studyDays[$i % count($studyDays)];
            $planItems[] = [
                'day' => $day,
                'durationMinutes' => $sessionLength,
                'focus' => $this->sessionFocus($subject, $i),
                'task' => $this->sessionTask($subject, $goal, $i),
            ];
        }

        return [
            'goal' => $goal,
            'subject' => $subject,
            'sessionsPerWeek' => $sessionsPerWeek,
            'weeklyPlan' => $planItems,
            'personalization' => [
                'hobbies' => $hobbies,
                'studyTime' => (string) ($profile['studyTime'] ?? 'afternoon'),
                'pace' => (string) ($profile['pace'] ?? 'balanced'),
            ],
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
}
