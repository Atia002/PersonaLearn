<?php

declare(strict_types=1);

namespace PersonaLearn\Storage;

final class JsonStore
{
    private string $path;

    public function __construct(string $path)
    {
        $this->path = $path;
    }

    public function all(): array
    {
        if (!file_exists($this->path)) {
            return [];
        }

        $contents = file_get_contents($this->path);
        if ($contents === false || trim($contents) === '') {
            return [];
        }

        $decoded = json_decode($contents, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function putAll(array $records): void
    {
        $dir = dirname($this->path);
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        file_put_contents($this->path, json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    }
}
