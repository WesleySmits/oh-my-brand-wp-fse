# Contributing to Oh My Brand!

Thank you for your interest in contributing to Oh My Brand! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something great together.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment
4. Create a branch for your changes
5. Make your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 20+
- PHP 8.4+
- Composer
- Local by Flywheel or wp-env

### Installation

```bash
# Clone the repository
git clone git@github.com:YOUR_USERNAME/oh-my-brand-wp-fse.git
cd oh-my-brand-wp-fse

# Install dependencies
npm install
composer install

# Set up Git hooks
npm run prepare

# Verify setup
npm run lint
npm test
```

## Making Changes

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our [coding standards](docs/CODING_STANDARDS.md)

3. Run linting and tests:
   ```bash
   npm run lint
   npm test
   composer test
   ```

4. Commit your changes using conventional commits

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(gallery): add lightbox functionality
fix(faq): resolve accordion animation issue
docs(readme): update installation instructions
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Ensure no linting errors
4. Fill out the PR template completely
5. Request review from maintainers
6. Address any feedback

### PR Checklist

- [ ] Code follows project coding standards
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] All CI checks pass
- [ ] PR description clearly explains changes

## Coding Standards

Please refer to our comprehensive documentation:

- [Coding Standards Overview](docs/CODING_STANDARDS.md)
- [PHP Standards](docs/CODING_STANDARDS_PHP.md)
- [TypeScript Standards](docs/CODING_STANDARDS_TYPESCRIPT.md)
- [CSS Standards](docs/CODING_STANDARDS_CSS.md)
- [WordPress Standards](docs/CODING_STANDARDS_WORDPRESS.md)

## Questions?

If you have questions, please open an issue for discussion before starting work on large changes.
