<?php

declare(strict_types=1);

namespace PersonaLearn\Services;

final class FreeContentService
{
    public function searchWikipedia(string $topic): array
    {
        $endpoint = 'https://en.wikipedia.org/api/rest_v1/page/summary/' . rawurlencode($topic);
        $result = $this->httpGetJson($endpoint);

        if (!isset($result['extract'])) {
            return [];
        }

        return [
            'title' => (string) ($result['title'] ?? $topic),
            'summary' => (string) ($result['extract'] ?? ''),
            'url' => (string) ($result['content_urls']['desktop']['page'] ?? ''),
        ];
    }

    public function searchOpenLibrary(string $topic): array
    {
        $endpoint = 'https://openlibrary.org/search.json?q=' . rawurlencode($topic) . '&limit=5';
        $result = $this->httpGetJson($endpoint);
        $docs = $result['docs'] ?? [];

        if (!is_array($docs)) {
            return [];
        }

        $books = [];
        foreach ($docs as $doc) {
            if (!is_array($doc)) {
                continue;
            }

            $title = (string) ($doc['title'] ?? 'Untitled');
            $author = isset($doc['author_name'][0]) ? (string) $doc['author_name'][0] : 'Unknown';
            $key = (string) ($doc['key'] ?? '');
            $books[] = [
                'title' => $title,
                'author' => $author,
                'url' => $key !== '' ? 'https://openlibrary.org' . $key : '',
            ];
        }

        return $books;
    }

    private function httpGetJson(string $url): array
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'GET',
                'timeout' => 8,
                'header' => "Accept: application/json\r\nUser-Agent: PersonaLearn-Backend/1.0\r\n",
            ],
        ]);

        $response = @file_get_contents($url, false, $context);
        if ($response === false) {
            return [];
        }

        $decoded = json_decode($response, true);
        return is_array($decoded) ? $decoded : [];
    }
}
