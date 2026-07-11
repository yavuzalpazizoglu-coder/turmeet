<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

abstract class ApiController extends Controller
{
    protected function success(mixed $data = null, string $message = null, int $status = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data'    => $data,
            'message' => $message,
        ], $status);
    }

    protected function error(string $message, int $status = 400, mixed $data = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'data'    => $data,
            'message' => $message,
        ], $status);
    }
}
