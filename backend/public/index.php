<?php

declare(strict_types=1);

use PersonaLearn\Services\FreeContentService;
use PersonaLearn\Services\PlanService;
use PersonaLearn\Storage\JsonStore;
use PersonaLearn\Support\Request;
use PersonaLearn\Support\Response;

require_once __DIR__ . '/../src/Support/Request.php';
require_once __DIR__ . '/../src/Support/Response.php';
require_once __DIR__ . '/../src/Storage/JsonStore.php';
require_once __DIR__ . '/../src/Services/FreeContentService.php';
require_once __DIR__ . '/../src/Services/PlanService.php';

setCorsHeaders();

if (Request::method() === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$usersStore = new JsonStore(__DIR__ . '/../storage/users.json');
$plansStore = new JsonStore(__DIR__ . '/../storage/plans.json');
$freeContent = new FreeContentService();
$planService = new PlanService($freeContent);

$method = Request::method();
$path = Request::path();

if ($method === 'GET' && $path === '/api/health') {
    Response::json([
        'ok' => true,
        'service' => 'PersonaLearn PHP API',
        'time' => gmdate('c'),
    ]);
    exit;
}

if ($method === 'POST' && $path === '/api/learners/register') {
    $payload = Request::json();
    $name = trim((string) ($payload['name'] ?? ''));
    $email = strtolower(trim((string) ($payload['email'] ?? '')));
    $password = (string) ($payload['password'] ?? '');

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
        'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
        'profile' => $payload['profile'] ?? [],
        'createdAt' => gmdate('c'),
    ];

    $users[] = $record;
    $usersStore->putAll($users);

    Response::json([
        'ok' => true,
        'learner' => [
            'id' => $id,
            'name' => $name,
            'email' => $email,
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
            Response::json([
                'ok' => true,
                'token' => base64_encode((string) ($user['id'] ?? '')),
                'learner' => [
                    'id' => $user['id'] ?? '',
                    'name' => $user['name'] ?? '',
                    'email' => $user['email'] ?? '',
                    'profile' => $user['profile'] ?? [],
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

    Response::json([
        'ok' => true,
        'plan' => $plan,
    ]);
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
    $allowedOrigin = getenv('API_ALLOWED_ORIGIN') ?: 'http://localhost:5173';
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
