<?php

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = getenv('API_ALLOWED_ORIGIN') ?: '*';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use PersonaLearn\Services\FreeContentService;
use PersonaLearn\Services\MaterialService;
use PersonaLearn\Services\PlanService;
use PersonaLearn\Services\TutorService;
use PersonaLearn\Storage\JsonStore;
use PersonaLearn\Support\Request;
use PersonaLearn\Support\Response;

error_reporting(E_ALL);
ini_set('display_errors', '0');

$rootDir = detectRootDir(__DIR__);

require_once $rootDir . '/src/Support/Request.php';
require_once $rootDir . '/src/Support/Response.php';
require_once $rootDir . '/src/Storage/JsonStore.php';
require_once $rootDir . '/src/Services/FreeContentService.php';
require_once $rootDir . '/src/Services/MaterialService.php';
require_once $rootDir . '/src/Services/PlanService.php';
require_once $rootDir . '/src/Services/TutorService.php';

loadEnvFile($rootDir . '/.env');
registerJsonErrorHandling();

$usersStore = new JsonStore($rootDir . '/storage/users.json');
$plansStore = new JsonStore($rootDir . '/storage/plans.json');
$materialsStore = new JsonStore($rootDir . '/storage/materials.json');
$freeContent = new FreeContentService();
$planService = new PlanService($freeContent);
$materialService = new MaterialService($materialsStore);
$tutorService = new TutorService($materialService);

$method = Request::method();
$path = normalizeApiPath(Request::path());

if ($method === 'GET' && $path === '/api/health') {
    Response::json([
        'ok' => true,
    ]);
    exit;
}

if ($method === 'POST' && $path === '/api/learners/register') {
    $payload = Request::json();
    $name = trim((string) ($payload['name'] ?? ''));
    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    $password = (string) ($payload['password'] ?? '');
    $requestedRole = (string) ($payload['role'] ?? 'student');
    $role = in_array($requestedRole, ['student', 'instructor', 'admin'], true) ? $requestedRole : 'student';

    if ($name === '' || $email === '' || $password === '') {
        Response::error('Name, email, and password are required.', 422);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        Response::error('Invalid email format.', 422);
        exit;
    }

    $users = $usersStore->all();
    foreach ($users as $user) {
        if (($user['email'] ?? '') === $email) {
            Response::error('Email already registered.', 409);
            exit;
        }
    }

    $id = uniqid('usr_', true);
    $record = [
        'id' => $id,
        'name' => $name,
        'email' => $email,
        'role' => $role,
        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
        'profile' => $payload['profile'] ?? [],
        'createdAt' => gmdate('c'),
    ];

    $users[] = $record;
    $usersStore->putAll($users);

    $createdUser = [
        'id' => $id,
        'name' => $name,
        'email' => $email,
        'role' => $role,
        'profile' => $payload['profile'] ?? [],
    ];

    Response::json([
        'ok' => true,
        'id' => $id,
        'userId' => $id,
        'learnerId' => $id,
        'user' => $createdUser,
        'learner' => $createdUser,
        'data' => [
            'user' => $createdUser,
            'learner' => $createdUser,
        ],
    ], 201);
    exit;
}

if ($method === 'POST' && $path === '/api/auth/login') {
    $payload = Request::json();
    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    $password = (string) ($payload['password'] ?? '');

    $users = $usersStore->all();
    foreach ($users as $user) {
        if (($user['email'] ?? '') !== $email) {
            continue;
        }

        $hash = (string) ($user['passwordHash'] ?? '');
        if ($hash !== '' && password_verify($password, $hash)) {
            $authUser = [
                'id' => $user['id'] ?? '',
                'name' => $user['name'] ?? '',
                'email' => $user['email'] ?? '',
                'role' => $user['role'] ?? 'student',
                'profile' => $user['profile'] ?? [],
            ];

            Response::json([
                'ok' => true,
                'token' => base64_encode((string) ($user['id'] ?? '')),
                'id' => $authUser['id'],
                'userId' => $authUser['id'],
                'learnerId' => $authUser['id'],
                'user' => $authUser,
                'learner' => $authUser,
                'data' => [
                    'user' => $authUser,
                    'learner' => $authUser,
                ],
            ]);
            exit;
        }

        break;
    }

    Response::error('Invalid credentials.', 401);
    exit;
}

if ($method === 'POST' && $path === '/api/plans/generate') {
    $payload = Request::json();
    $learnerId = (string) ($payload['learnerId'] ?? 'guest');
    $profile = is_array($payload['profile'] ?? null) ? $payload['profile'] : [];

    if ($profile === []) {
        Response::error('profile payload is required.', 422);
        exit;
    }

    $plan = $planService->generate($profile);

    $plans = $plansStore->all();
    $plans[] = [
        'id' => uniqid('plan_', true),
        'learnerId' => $learnerId,
        'profile' => $profile,
        'plan' => $plan,
        'createdAt' => gmdate('c'),
    ];
    $plansStore->putAll($plans);

    if ($learnerId !== 'guest') {
        $users = $usersStore->all();
        foreach ($users as $index => $user) {
            if ((string) ($user['id'] ?? '') !== $learnerId) {
                continue;
            }

            $users[$index]['profile'] = array_merge((array) ($user['profile'] ?? []), $profile, [
                'generatedPlan' => $plan,
                'weakConcept' => $plan['weakConcept'] ?? ($profile['weakConcept'] ?? ''),
            ]);
            $usersStore->putAll($users);
            break;
        }
    }

    Response::json([
        'ok' => true,
        'plan' => $plan,
    ]);
    exit;
}

if ($method === 'POST' && $path === '/api/materials/save') {
    $payload = Request::json();

    try {
        $record = $materialService->save($payload);
    } catch (InvalidArgumentException $exception) {
        Response::error($exception->getMessage(), 422);
        exit;
    }

    $userId = (string) ($record['userId'] ?? '');
    if ($userId !== '') {
        $users = $usersStore->all();
        foreach ($users as $index => $user) {
            if ((string) ($user['id'] ?? '') !== $userId) {
                continue;
            }

            $profile = (array) ($user['profile'] ?? []);
            $materialsCount = (int) ($profile['materialsCount'] ?? 0);
            $profile['materialsCount'] = $materialsCount + 1;
            $profile['lastMaterialSavedAt'] = $record['createdAt'];
            $users[$index]['profile'] = $profile;
            $usersStore->putAll($users);
            break;
        }
    }

    Response::json([
        'ok' => true,
        'material' => $record,
    ], 201);
    exit;
}

if ($method === 'GET' && $path === '/api/materials') {
    $userId = (string) (Request::query('userId', '') ?? '');
    if ($userId === '') {
        Response::error('userId query parameter is required.', 422);
        exit;
    }

    Response::json([
        'ok' => true,
        'materials' => $materialService->listForUser($userId),
    ]);
    exit;
}

if ($method === 'GET' && $path === '/api/materials/latest') {
    $userId = (string) (Request::query('userId', '') ?? '');
    $concept = Request::query('concept', null);
    if ($userId === '') {
        Response::error('userId query parameter is required.', 422);
        exit;
    }

    Response::json([
        'ok' => true,
        'material' => $materialService->latestForUser($userId, $concept !== null ? (string) $concept : null),
    ]);
    exit;
}

if ($method === 'POST' && $path === '/api/tutor/ask') {
    $payload = Request::json();
    $response = $tutorService->answer($payload);

    $userId = (string) ($payload['userId'] ?? '');
    if ($userId !== '') {
        $users = $usersStore->all();
        foreach ($users as $index => $user) {
            if ((string) ($user['id'] ?? '') !== $userId) {
                continue;
            }

            $profile = (array) ($user['profile'] ?? []);
            $profile['recentTutorActivity'] = [
                'concept' => (string) ($payload['concept'] ?? ''),
                'question' => (string) ($payload['question'] ?? ''),
                'sourceUsed' => $response['sourceUsed'] ?? 'official',
                'answerPreview' => substr((string) ($response['answer'] ?? ''), 0, 140),
                'createdAt' => gmdate('c'),
            ];
            $users[$index]['profile'] = $profile;
            $usersStore->putAll($users);
            break;
        }
    }

    Response::json($response);
    exit;
}

if ($method === 'PUT' && preg_match('#^/api/learners/([^/]+)$#', $path, $matches) === 1) {
    $id = $matches[1];
    $payload = Request::json();
    $users = $usersStore->all();

    foreach ($users as $index => $user) {
        if (($user['id'] ?? '') !== $id) {
            continue;
        }

        $profile = is_array($payload['profile'] ?? null) ? $payload['profile'] : [];

        $users[$index]['name'] = trim((string) ($payload['name'] ?? $user['name'] ?? '')) ?: ($user['name'] ?? '');
        $users[$index]['email'] = strtolower(trim((string) ($payload['email'] ?? $user['email'] ?? '')));
        if (isset($payload['password']) && (string) $payload['password'] !== '') {
            $users[$index]['passwordHash'] = password_hash((string) $payload['password'], PASSWORD_DEFAULT);
        }

        $users[$index]['profile'] = array_merge((array) ($user['profile'] ?? []), $profile);
        $users[$index]['updatedAt'] = gmdate('c');
        $usersStore->putAll($users);

        Response::json([
            'ok' => true,
            'learner' => [
                'id' => $users[$index]['id'] ?? '',
                'name' => $users[$index]['name'] ?? '',
                'email' => $users[$index]['email'] ?? '',
                'profile' => $users[$index]['profile'] ?? [],
            ],
        ]);
        exit;
    }

    Response::error('Learner not found.', 404);
    exit;
}

if ($method === 'GET' && $path === '/api/resources/search') {
    $topic = Request::query('topic', 'Computer programming');

    if ($topic === null || trim($topic) === '') {
        Response::error('topic query parameter is required.', 422);
        exit;
    }

    Response::json([
        'ok' => true,
        'topic' => $topic,
        'wikipedia' => $freeContent->searchWikipedia($topic),
        'openLibraryBooks' => $freeContent->searchOpenLibrary($topic),
    ]);
    exit;
}

if ($method === 'GET' && preg_match('#^/api/learners/([^/]+)$#', $path, $matches) === 1) {
    $id = $matches[1];
    $users = $usersStore->all();

    foreach ($users as $user) {
        if (($user['id'] ?? '') === $id) {
            Response::json([
                'ok' => true,
                'learner' => [
                    'id' => $user['id'] ?? '',
                    'name' => $user['name'] ?? '',
                    'email' => $user['email'] ?? '',
                    'role' => $user['role'] ?? 'student',
                    'profile' => $user['profile'] ?? [],
                ],
            ]);
            exit;
        }
    }

    Response::error('Learner not found.', 404);
    exit;
}

Response::error('Route not found.', 404, [
    'method' => $method,
    'path' => $path,
]);

function setCorsHeaders(): void
{
    $requestOrigin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
    $configured = envValue('API_ALLOWED_ORIGIN', '*');
    $configuredOrigins = array_values(array_filter(array_map('trim', explode(',', $configured)), static fn(string $v): bool => $v !== ''));
    if ($configuredOrigins === []) {
        $configuredOrigins = ['*'];
    }

    $allowedOrigins = array_values(array_unique(array_merge(
        $configuredOrigins,
        ['http://localhost:5173', 'http://127.0.0.1:5173']
    )));

    $isLocalDevOrigin = preg_match('#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#', $requestOrigin) === 1;
    $isVercelOrigin = preg_match('#^https://[a-z0-9-]+\.vercel\.app$#i', $requestOrigin) === 1;

    $allowAnyOrigin = in_array('*', $allowedOrigins, true);
    $originHeaderValue = '*';

    if ($allowAnyOrigin) {
        $originHeaderValue = '*';
    } elseif ($requestOrigin !== '' && ($isLocalDevOrigin || $isVercelOrigin || in_array($requestOrigin, $allowedOrigins, true))) {
        $originHeaderValue = $requestOrigin;
    } elseif ($allowedOrigins !== []) {
        $originHeaderValue = $allowedOrigins[0];
    }

    if ($requestOrigin === '' && !$allowAnyOrigin) {
        $originHeaderValue = $allowedOrigins[0] ?? '*';
    }

    header('Access-Control-Allow-Origin: ' . $originHeaderValue);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

    $requestedHeaders = trim((string) ($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'] ?? ''));
    $defaultAllowedHeaders = 'Content-Type, Authorization, X-Requested-With, Accept, Origin';
    header('Access-Control-Allow-Headers: ' . ($requestedHeaders !== '' ? $requestedHeaders : $defaultAllowedHeaders));
    header('Access-Control-Max-Age: 86400');
}

function loadEnvFile(string $path): void
{
    if (!is_file($path) || !is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $trimmed = trim($line);
        if ($trimmed === '' || str_starts_with($trimmed, '#')) {
            continue;
        }

        $delimiterPos = strpos($trimmed, '=');
        if ($delimiterPos === false) {
            continue;
        }

        $key = trim(substr($trimmed, 0, $delimiterPos));
        $value = trim(substr($trimmed, $delimiterPos + 1));
        if ($key === '') {
            continue;
        }

        if ((str_starts_with($value, '"') && str_ends_with($value, '"')) || (str_starts_with($value, "'") && str_ends_with($value, "'"))) {
            $value = substr($value, 1, -1);
        }

        if (getenv($key) !== false || array_key_exists($key, $_ENV)) {
            continue;
        }

        putenv($key . '=' . $value);
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
}

function envValue(string $key, string $default = ''): string
{
    $env = getenv($key);
    if ($env !== false) {
        return trim((string) $env);
    }

    if (isset($_ENV[$key])) {
        return trim((string) $_ENV[$key]);
    }

    return $default;
}

function detectRootDir(string $currentDir): string
{
    $candidates = [dirname($currentDir), $currentDir];
    foreach ($candidates as $candidate) {
        if (is_dir($candidate . '/src') && is_dir($candidate . '/storage')) {
            return $candidate;
        }
    }

    return dirname($currentDir);
}

function normalizeApiPath(string $path): string
{
    $normalized = $path;

    if (str_starts_with($normalized, '/index.php/')) {
        $normalized = substr($normalized, strlen('/index.php'));
    } elseif ($normalized === '/index.php') {
        $normalized = '/';
    }

    $scriptDir = (string) dirname((string) ($_SERVER['SCRIPT_NAME'] ?? '/'));
    if ($scriptDir !== '' && $scriptDir !== '/' && str_starts_with($normalized, $scriptDir . '/')) {
        $normalized = substr($normalized, strlen($scriptDir));
    }

    return rtrim($normalized, '/') ?: '/';
}

function registerJsonErrorHandling(): void
{
    set_exception_handler(static function (\Throwable $exception): void {
        if (!headers_sent()) {
            Response::error('Internal server error.', 500);
        }
    });

    register_shutdown_function(static function (): void {
        $error = error_get_last();
        if ($error === null) {
            return;
        }

        $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR];
        if (!in_array((int) ($error['type'] ?? 0), $fatalTypes, true)) {
            return;
        }

        if (!headers_sent()) {
            Response::error('Internal server error.', 500);
        }
    });
}
