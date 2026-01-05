<?php

declare(strict_types=1);

if (!function_exists('get_faq_data')) {
    function get_faq_data($post_id = null): array
    {
        if (!$post_id) $post_id = get_the_ID();

        $raw = get_field('faq', $post_id) ?: [];

        return array_map(function ($item) {
            return [
                'question' => trim($item['vraag'] ?? ''),
                'answer' => trim($item['antwoord'] ?? ''),
            ];
        }, $raw);
    }
}

if (!function_exists('generate_faq_json_ld')) {
    function generate_faq_json_ld(array $faq): string
    {
        $items = array_map(fn($item) => [
            "@type" => "Question",
            "name" => $item['question'],
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => $item['answer'],
            ]
        ], $faq);

        return json_encode([
            "@context" => "https://schema.org",
            "@type" => "FAQPage",
            "mainEntity" => $items
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    }
}
