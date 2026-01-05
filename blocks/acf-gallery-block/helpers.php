<?php

namespace OMB\Blocks\Gallery;

function get_gallery_data($post_id)
{
    $field_name = get_field('gallery_field_name', $post_id) ?: 'gallery';

    return [
        'gallery' => get_field($field_name, $post_id),
        'visible_images' => get_field('visible_images', $post_id) ?: 3,
        'is_editor' => is_admin(),
    ];
}

function parse_wrapper_attributes($block, $is_preview)
{
    if ($is_preview || !function_exists('get_block_wrapper_attributes') || empty($block['name'])) {
        return [
            'class' => '',
            'style' => '',
        ];
    }

    $attrs = [
        'className' => $block['className'] ?? '',
        'align'     => $block['align'] ?? '',
        'style'     => $block['style'] ?? '',
    ];
    $html = get_block_wrapper_attributes($attrs);

    preg_match('/class="([^"]+)"/', $html, $class_matches);
    preg_match('/style="([^"]+)"/', $html, $style_matches);

    $existing_classes = $class_matches[1] ?? '';
    $existing_styles  = $style_matches[1] ?? '';

    $block_gap = isset($block['style']['spacing']['blockGap'])
        ? resolve_wp_preset($block['style']['spacing']['blockGap'])
        : '10px';

    return [
        'class' => esc_attr(trim($existing_classes . ' ' . ($block['className'] ?? ''))),
        'style' => esc_attr(trim($existing_styles . '; --acf-block-gap: ' . $block_gap . ';')),
    ];
}
