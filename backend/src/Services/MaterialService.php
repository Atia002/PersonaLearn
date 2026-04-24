<?php

declare(strict_types=1);

namespace PersonaLearn\Services;

use PersonaLearn\Storage\JsonStore;

final class MaterialService
{
    public function __construct(private JsonStore $store)
    {
    }

    public function save(array $payload): array
    {
        $userId = trim((string) ($payload['userId'] ?? ''));
        $subject = trim((string) ($payload['subject'] ?? 'programming'));
        $concept = trim((string) ($payload['concept'] ?? ''));
        $notesText = trim((string) ($payload['notesText'] ?? ''));
        $title = trim((string) ($payload['title'] ?? ''));

        if ($userId === '' || $notesText === '') {
            throw new \InvalidArgumentException('userId and notesText are required.');
        }

        $record = [
            'id' => uniqid('mat_', true),
            'userId' => $userId,
            'subject' => $subject,
            'concept' => $concept,
            'title' => $title !== '' ? $title : ($concept !== '' ? $concept . ' notes' : 'Class notes'),
            'notesText' => $notesText,
            'usableByTutor' => (bool) ($payload['usableByTutor'] ?? true),
            'createdAt' => gmdate('c'),
        ];

        $records = $this->store->all();
        $records[] = $record;
        $this->store->putAll($records);

        return $record;
    }

    public function listForUser(string $userId): array
    {
        $records = array_values(array_filter(
            $this->store->all(),
            static fn (array $record): bool => (string) ($record['userId'] ?? '') === $userId
        ));

        return array_reverse($records);
    }

    public function latestForUser(string $userId, ?string $concept = null): ?array
    {
        $records = $this->listForUser($userId);

        foreach ($records as $record) {
            if ($concept !== null && $concept !== '' && (string) ($record['concept'] ?? '') !== $concept) {
                continue;
            }

            return $record;
        }

        return null;
    }
}
