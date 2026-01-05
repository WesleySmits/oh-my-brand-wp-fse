<?php
if (!function_exists('resolve_wp_preset')) {
    /**
     * Convert WordPress preset spacing values (var:preset|spacing|xxx-large) to actual pixel values
     *
     * @param string $preset_value The preset value from block settings.
     * @return string The resolved CSS value.
     */
    function resolve_wp_preset($preset_value) {

        if (strpos($preset_value, 'var:preset|spacing|') !== false) {
            $spacing_presets = array(
                'small' => '8px',
                'medium' => '16px',
                'large' => '24px',
                'x-large' => '32px',
                'xx-large' => '48px',
                'xxx-large' => '64px',
                'xxxx-large' => '80px'
            );

            // Extract key after "spacing|"
            $preset_key = str_replace('var:preset|spacing|', '', $preset_value);

            // Return real spacing value or fallback to 10px
            return isset($spacing_presets[$preset_key]) ? $spacing_presets[$preset_key] : '10px';
        }

        return $preset_value; // If it's a normal value, return it as-is
    }
}