#!/bin/bash
#
# E2E Test Fixtures Setup Script
#
# Creates test pages with blocks for Playwright E2E tests.
# Run via wp-env lifecycleScripts or manually: wp-env run cli bash tests/e2e/bin/setup-fixtures.sh
#
# @package theme-oh-my-brand

set -e

echo "🔧 Setting up E2E test fixtures..."

# Activate the theme
wp theme activate oh-my-brand 2>/dev/null || echo "Theme already active or not found"

# Create Sample Page (for breadcrumbs tests)
if ! wp post list --post_type=page --name=sample-page --format=ids | grep -q .; then
    wp post create \
        --post_type=page \
        --post_title="Sample Page" \
        --post_name="sample-page" \
        --post_status=publish \
        --post_content='<!-- wp:paragraph -->
<p>This is a sample page for testing breadcrumbs navigation.</p>
<!-- /wp:paragraph -->

<!-- wp:theme-oh-my-brand/breadcrumbs /-->'
    echo "✅ Created Sample Page"
else
    echo "⏭️  Sample Page already exists"
fi

# Create CTA Test Page
if ! wp post list --post_type=page --name=cta-test --format=ids | grep -q .; then
    wp post create \
        --post_type=page \
        --post_title="CTA Test" \
        --post_name="cta-test" \
        --post_status=publish \
        --post_content='<!-- wp:theme-oh-my-brand/cta {"heading":"Test CTA Heading","description":"This is a test CTA description for E2E testing.","buttonText":"Click Here","buttonUrl":"#test"} /-->'
    echo "✅ Created CTA Test Page"
else
    echo "⏭️  CTA Test Page already exists"
fi

# Create Gallery Test Page
if ! wp post list --post_type=page --name=gallery-test --format=ids | grep -q .; then
    wp post create \
        --post_type=page \
        --post_title="Gallery Test" \
        --post_name="gallery-test" \
        --post_status=publish \
        --post_content='<!-- wp:theme-oh-my-brand/gallery {"images":[]} -->
<div class="wp-block-theme-oh-my-brand-gallery" data-gallery-wrapper>
    <p>Gallery block placeholder for E2E testing.</p>
</div>
<!-- /wp:theme-oh-my-brand/gallery -->'
    echo "✅ Created Gallery Test Page"
else
    echo "⏭️  Gallery Test Page already exists"
fi

# Create Logo Grid Test Page
if ! wp post list --post_type=page --name=logo-grid-test --format=ids | grep -q .; then
    # Import a dummy image for the logo grid
    # We use screenshot.png from the theme root as a placeholder
    IMAGE_ID=$(wp media import screenshot.png --porcelain)
    IMAGE_URL=$(wp media get "$IMAGE_ID" --field=source_url)

    echo "🖼️  Imported placeholder image (ID: $IMAGE_ID)"

    # Create the block content with the imported image
    # valid JSON requires escaped quotes
    CONTENT="<!-- wp:theme-oh-my-brand/logo-grid {\"heading\":\"Our Partners\",\"grayscale\":true,\"images\":[{\"id\":$IMAGE_ID,\"url\":\"$IMAGE_URL\",\"alt\":\"Partner Logo\",\"link\":\"\"},{\"id\":$IMAGE_ID,\"url\":\"$IMAGE_URL\",\"alt\":\"Partner Logo 2\",\"link\":\"\"},{\"id\":$IMAGE_ID,\"url\":\"$IMAGE_URL\",\"alt\":\"Partner Logo 3\",\"link\":\"\"},{\"id\":$IMAGE_ID,\"url\":\"$IMAGE_URL\",\"alt\":\"Partner Logo 4\",\"link\":\"\"}],\"columns\":4} /-->"

    wp post create \
        --post_type=page \
        --post_title="Logo Grid Test" \
        --post_name="logo-grid-test" \
        --post_status=publish \
        --post_content="$CONTENT"
    echo "✅ Created Logo Grid Test Page"
else
    echo "⏭️  Logo Grid Test Page already exists"
fi

# Flush rewrite rules to ensure pages are accessible
wp rewrite flush 2>/dev/null || true

echo "🎉 E2E test fixtures setup complete!"
