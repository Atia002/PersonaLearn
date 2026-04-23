<?php

declare(strict_types=1);

namespace PersonaLearn\Support;

final class Request
{
    public static function method(): string
    {
        return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    }

    public static function path(): string
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '/';
        $path = parse_url($uri, PHP_URL_PATH);
        return $path ? rtrim($path, '/') ?: '/' : '/';
    }

    public static function query(string $key, ?string $default = null): ?string
    {
        if (!isset($_GET[$key])) {
            return $default;
        }

        $value = trim((string) $_GET[$key]);
        return $value === '' ? $default : $value;
    }

    public static function json(): array
    {
        $raw = file_get_contents('php://input');
        if ($raw === false || trim($raw) === '') {
            return [];
        }

        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }
}
