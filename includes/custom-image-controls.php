<?php

function add_lazy_loading_to_gutenberg_images($block_content, $block) {
    if (is_admin() || empty($block_content)) {
        return $block_content;
    }

    $processor = new WP_HTML_Tag_Processor($block_content);

    while ($processor->next_tag('img')) {
        $processor->set_attribute('loading', 'lazy');
    }

    return $processor->get_updated_html();
}
add_filter('render_block', 'add_lazy_loading_to_gutenberg_images', 10, 2);