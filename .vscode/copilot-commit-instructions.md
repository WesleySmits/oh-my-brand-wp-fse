# Commit Message Instructions

Generate commit messages following the Conventional Commits format.

## Format

```
type(scope): Subject in sentence case

[optional body]

[optional footer(s)]
```

## Types (required, lowercase)

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, CSS (no code logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `build` | Build system or dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance tasks |
| `revert` | Revert a previous commit |

## Scopes (optional, lowercase)

- `blocks` — Block-related changes
- `gallery` — Gallery block
- `faq` — FAQ block
- `youtube` — YouTube block
- `theme` — Theme configuration
- `assets` — CSS/JS assets
- `acf` — ACF configuration
- `deps` — Dependencies
- `config` — Configuration files
- `ci` — CI/CD
- `vscode` — VS Code settings

Custom scopes are allowed when needed.

## Rules

1. **Subject**: Use sentence case (capitalize first letter only)
2. **No period** at the end of the subject
3. **Header max length**: 100 characters (type + scope + subject combined)
4. **Body line max length**: 100 characters per line (STRICTLY ENFORCED)
5. **Body**: Separate from subject with a blank line
6. **One commit = one logical change** — do NOT combine multiple feat/fix/refactor in one message
7. Be concise — explain what changed, not how
8. If multiple files changed, summarize the overall change, don't list each file

## Important

- **NEVER** exceed 100 characters on any single line in the body
- **NEVER** include multiple `feat:`, `fix:`, `refactor:` entries in one commit message
- If changes span multiple areas, use a broader scope or omit scope entirely
- Keep body descriptions short and to the point

## Examples

```
feat(gallery): Add lightbox functionality
```

```
fix(blocks): Resolve rendering issue in FAQ accordion
```

```
docs: Update README with installation steps
```

```
refactor(theme): Simplify asset loading logic
```

```
chore(deps): Update vite to version 6.1.0
```

```
feat(acf): Add new testimonial block

Implemented a testimonial block with:
- Author name and avatar
- Quote text with styling options
- Star rating display

Closes #42
```
