<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class MiceApiService
{
    private string $baseUrl;
    private string $apiKey;
    private int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.mice_api.base_url');
        $this->apiKey  = config('services.mice_api.key');
        $this->timeout = (int) config('services.mice_api.timeout', 30);
    }

    public function get(string $endpoint, array $params = []): array
    {
        $response = $this->request('GET', $endpoint, ['query' => $params]);
        return $response->json();
    }

    public function post(string $endpoint, array $payload = []): array
    {
        $response = $this->request('POST', $endpoint, ['json' => $payload]);
        return $response->json();
    }

    private function request(string $method, string $endpoint, array $options = []): Response
    {
        try {
            $response = Http::timeout($this->timeout)
                ->withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Accept'        => 'application/json',
                ])
                ->send($method, "{$this->baseUrl}/{$endpoint}", $options);

            if ($response->failed()) {
                Log::error('MICE API request failed', [
                    'endpoint' => $endpoint,
                    'status'   => $response->status(),
                    'body'     => $response->body(),
                ]);
                throw new RuntimeException("MICE API error: {$response->status()}");
            }

            return $response;
        } catch (\Exception $e) {
            Log::error('MICE API exception', ['message' => $e->getMessage()]);
            throw $e;
        }
    }
}
