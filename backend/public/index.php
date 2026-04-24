<?php

declare(strict_types=1);

use PersonaLearn\Services\FreeContentService;
use PersonaLearn\Services\MaterialService;
use PersonaLearn\Services\PlanService;
use PersonaLearn\Services\TutorService;
use PersonaLearn\Storage\JsonStore;
use PersonaLearn\Support\Request;
use PersonaLearn\Support\Response;

require_once __DIR__ . '/../src/Support/Request.php';
require_once __DIR__ . '/../src/Support/Response.php';
require_once __DIR__ . '/../src/Storage/JsonStore.php';
require_once __DIR__ . '/../src/Services/FreeContentService.php';
require_once __DIR__ . '/../src/Services/MaterialService.php';
require_once __DIR__ . '/../src/Services/PlanService.php';
require_once __DIR__ . '/../src/Services/TutorService.php';

setCorsHeaders();

if (Request::method() === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$usersStore = new JsonStore(__DIR__ . '/../storage/users.json');
$plansStore = new JsonStore(__DIR__ . '/../storage/plans.json');
$materialsStore = new JsonStore(__DIR__ . '/../storage/materials.json');
$freeContent = new FreeContentService();
$planService = new PlanService($freeContent);
$materialService = new MaterialService($materialsStore);
$tutorService = new TutorService($materialService);

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

    Response::json([
        'ok' => true,
        'learner' => [
            'id' => $id,
            'name' => $name,
            'email' => $email,
                'role' => $role,
                'profile' => $payload['profile'] ?? [],
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
                    'role' => $user['role'] ?? 'student',
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
    $allowedOrigin = getenv('API_ALLOWED_ORIGIN') ?: 'http://localhost:5173';
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
}
