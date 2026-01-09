#!/bin/bash
#
# create-block.sh - Scaffold a new block with all required files
#
# Usage:
#   ./create-block.sh --type native --name hero-section --title "Hero Section"
#   ./create-block.sh --type acf --name testimonial --title "Testimonial"
#
# Options:
#   --type        Required. "native" or "acf"
#   --name        Required. Block name in kebab-case (e.g., "hero-section")
#   --title       Optional. Human-readable title (default: derived from name)
#   --description Optional. Block description
#   --category    Optional. Block category (default: "design")
#   --icon        Optional. Dashicon name (default: "admin-generic")
#

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$(dirname "$SCRIPT_DIR")"
THEME_DIR="$(dirname "$(dirname "$SKILLS_DIR")")"
REFERENCES_DIR="$SKILLS_DIR/block-scaffolds/references"

# Default values
BLOCK_TYPE=""
BLOCK_NAME=""
BLOCK_TITLE=""
BLOCK_DESCRIPTION="A custom block for the Oh My Brand! theme."
BLOCK_CATEGORY="design"
BLOCK_ICON="admin-generic"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            BLOCK_TYPE="$2"
            shift 2
            ;;
        --name)
            BLOCK_NAME="$2"
            shift 2
            ;;
        --title)
            BLOCK_TITLE="$2"
            shift 2
            ;;
        --description)
            BLOCK_DESCRIPTION="$2"
            shift 2
            ;;
        --category)
            BLOCK_CATEGORY="$2"
            shift 2
            ;;
        --icon)
            BLOCK_ICON="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Validation
if [[ -z "$BLOCK_TYPE" ]]; then
    echo -e "${RED}Error: --type is required (native or acf)${NC}"
    exit 1
fi

if [[ "$BLOCK_TYPE" != "native" && "$BLOCK_TYPE" != "acf" ]]; then
    echo -e "${RED}Error: --type must be 'native' or 'acf'${NC}"
    exit 1
fi

if [[ -z "$BLOCK_NAME" ]]; then
    echo -e "${RED}Error: --name is required${NC}"
    exit 1
fi

# Validate kebab-case
if [[ ! "$BLOCK_NAME" =~ ^[a-z][a-z0-9-]*$ ]]; then
    echo -e "${RED}Error: Block name must be kebab-case (e.g., 'hero-section')${NC}"
    exit 1
fi

# Helper functions
to_pascal_case() {
    echo "$1" | sed -E 's/(^|-)([a-z])/\U\2/g'
}

to_snake_case() {
    echo "$1" | tr '-' '_'
}

to_title_case() {
    echo "$1" | sed -E 's/(^|-)([a-z])/\U\2/g' | sed 's/-/ /g'
}

# Derive values
BLOCK_CLASS=$(to_pascal_case "$BLOCK_NAME")
BLOCK_SNAKE=$(to_snake_case "$BLOCK_NAME")

if [[ -z "$BLOCK_TITLE" ]]; then
    BLOCK_TITLE=$(to_title_case "$BLOCK_NAME")
fi

# Determine output directory
if [[ "$BLOCK_TYPE" == "native" ]]; then
    OUTPUT_DIR="$THEME_DIR/src/blocks/$BLOCK_NAME"
    BLOCK_PREFIX="theme-oh-my-brand"
else
    OUTPUT_DIR="$THEME_DIR/blocks/acf-$BLOCK_NAME"
    BLOCK_PREFIX="acf"
fi

# Check if block already exists
if [[ -d "$OUTPUT_DIR" ]]; then
    echo -e "${RED}Error: Block already exists at $OUTPUT_DIR${NC}"
    exit 1
fi

# Create directory
echo -e "${GREEN}Creating block: $BLOCK_TITLE${NC}"
echo "  Type: $BLOCK_TYPE"
echo "  Name: $BLOCK_PREFIX/$BLOCK_NAME"
echo "  Directory: $OUTPUT_DIR"
echo ""

mkdir -p "$OUTPUT_DIR"

# Function to process template
process_template() {
    local input_file="$1"
    local output_file="$2"

    sed \
        -e "s/BLOCK_NAME/$BLOCK_NAME/g" \
        -e "s/BLOCK_TITLE/$BLOCK_TITLE/g" \
        -e "s/BLOCK_CLASS/$BLOCK_CLASS/g" \
        -e "s/BLOCK_DESCRIPTION/$BLOCK_DESCRIPTION/g" \
        -e "s/CATEGORY/$BLOCK_CATEGORY/g" \
        -e "s/ICON/$BLOCK_ICON/g" \
        -e "s/FIELD_NAME/$BLOCK_SNAKE/g" \
        "$input_file" > "$output_file"

    echo "  Created: $(basename "$output_file")"
}

# Create files based on type
if [[ "$BLOCK_TYPE" == "native" ]]; then
    # Native block files
    process_template "$REFERENCES_DIR/block-json-native.json" "$OUTPUT_DIR/block.json"
    process_template "$REFERENCES_DIR/render-native.php" "$OUTPUT_DIR/render.php"
    process_template "$REFERENCES_DIR/helpers-native.php" "$OUTPUT_DIR/helpers.php"
    process_template "$REFERENCES_DIR/view.ts" "$OUTPUT_DIR/view.ts"
    process_template "$REFERENCES_DIR/style.css" "$OUTPUT_DIR/style.css"
    process_template "$REFERENCES_DIR/edit.tsx" "$OUTPUT_DIR/edit.tsx"
    process_template "$REFERENCES_DIR/view.test.ts" "$OUTPUT_DIR/view.test.ts"

    # Create index.js
    cat > "$OUTPUT_DIR/index.js" << EOF
/**
 * $BLOCK_TITLE block registration.
 *
 * @package theme-oh-my-brand
 */

import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import metadata from './block.json';
import './style.css';

registerBlockType(metadata.name, {
    edit: Edit,
});
EOF
    echo "  Created: index.js"

else
    # ACF block files
    process_template "$REFERENCES_DIR/block-json-acf.json" "$OUTPUT_DIR/block.json"
    process_template "$REFERENCES_DIR/render-acf.php" "$OUTPUT_DIR/render.php"
    process_template "$REFERENCES_DIR/helpers-acf.php" "$OUTPUT_DIR/helpers.php"
    process_template "$REFERENCES_DIR/style.css" "$OUTPUT_DIR/style.css"
fi

echo ""
echo -e "${GREEN}✓ Block scaffolded successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"

if [[ "$BLOCK_TYPE" == "native" ]]; then
    echo "  1. Run: pnpm run build"
    echo "  2. Edit edit.tsx to customize the editor UI"
    echo "  3. Edit render.php for server-side rendering"
    echo "  4. Add styles to style.css"
else
    echo "  1. Create a field group in WP Admin > ACF > Field Groups"
    echo "     - Title: Block: $BLOCK_TITLE"
    echo "     - Location: Block equals acf/$BLOCK_NAME"
    echo "  2. Add 'acf-$BLOCK_NAME' to \$acf_blocks array in functions.php"
    echo "  3. Edit render.php to use get_field() for your fields"
    echo "  4. Add styles to style.css"
fi
