import antfu from '@antfu/eslint-config';
import nextPlugin from '@next/eslint-plugin-next';
import jestDom from 'eslint-plugin-jest-dom';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import playwright from 'eslint-plugin-playwright';
import storybook from 'eslint-plugin-storybook';

export default antfu(
    {
        react: true,
        typescript: true,

        // Configuration preferences
        lessOpinionated: true,
        isInEditor: false,

        // Disable most stylistic rules - let IDE handle formatting
        stylistic: false,

        // Disable formatters - let IDE handle formatting
        formatters: false,

        // Ignored paths
        ignores: [
            'migrations/**/*',
            'dist/**/*',
            'build/**/*',
            '.next/**/*',
        ],
    },
    // --- Next.js Specific Rules ---
    {
        plugins: {
            '@next/next': nextPlugin,
        },
        rules: {
            ...nextPlugin.configs.recommended.rules,
            ...nextPlugin.configs['core-web-vitals'].rules,
        },
    },
    // --- Accessibility Rules ---
    jsxA11y.flatConfigs.recommended,
    // --- Testing Rules ---
    {
        files: [
            '**/*.test.ts?(x)',
        ],
        ...jestDom.configs['flat/recommended'],
    },
    // --- E2E Testing Rules ---
    {
        files: [
            '**/*.spec.ts',
            '**/*.e2e.ts',
        ],
        ...playwright.configs['flat/recommended'],
    },
    // --- Storybook Rules ---
    ...storybook.configs['flat/recommended'],
    // --- Custom Rule Overrides ---
    {
        // React settings for new JSX transform
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // === Core ESLint Rules - More Relaxed ===
            'antfu/no-top-level-await': 'off', // Allow top-level await
            'node/prefer-global/process': 'off', // Allow using `process.env`
            'no-console': 'warn', // Allow console during development, just warn
            'no-debugger': 'warn', // Allow debugger during development
            'no-unused-vars': 'warn', // Warn instead of error for unused vars
            'prefer-const': 'warn', // Warn instead of error

            // === Style Rules - Disabled at config level, IDE handles formatting ===

            // === Import Rules - More Flexible ===
            'import/order': 'off', // Let IDE handle import ordering
            'import/no-duplicates': 'warn', // Warn instead of error
            'import/first': 'off', // Allow imports anywhere
            'import/newline-after-import': 'off', // Let IDE handle newlines
            'sort-imports': 'off', // Let IDE handle import sorting

            // === TypeScript Rules - Less Strict ===
            'ts/consistent-type-definitions': 'off', // Allow both type and interface
            'ts/no-explicit-any': 'warn', // Warn instead of error for any
            'ts/no-unused-vars': 'warn', // Warn instead of error
            'ts/ban-ts-comment': 'off', // Allow @ts-ignore and similar
            'ts/no-non-null-assertion': 'warn', // Warn instead of error for !
            'ts/prefer-ts-expect-error': 'off', // Allow @ts-ignore
            'ts/consistent-type-imports': 'off', // Don't enforce type imports
            'ts/no-empty-function': 'warn', // Warn instead of error
            'ts/no-inferrable-types': 'off', // Allow explicit types even if inferrable

            // === React Rules - More Flexible ===
            'react/prefer-destructuring-assignment': 'off', // Don't force destructuring
            'react/display-name': 'off', // Don't require display names
            'react-hooks/exhaustive-deps': 'warn', // Warn instead of error for hook deps
            'react-hooks/rules-of-hooks': 'error', // Keep this as error (important)

            // === Code Quality - Keep Important Ones ===
            'no-var': 'error', // Still enforce no var
            'eqeqeq': 'warn', // Warn for == instead of ===
            'no-undef': 'error', // Keep undefined variable errors

            // === Test Rules ===
            'test/padding-around-all': 'off', // Don't require padding in tests
            'test/prefer-lowercase-title': 'off', // Allow uppercase in test titles
            'test/consistent-test-it': 'off', // Allow both test() and it()

            // === Accessibility - Keep but Relax ===
            'jsx-a11y/click-events-have-key-events': 'warn', // Warn instead of error
            'jsx-a11y/no-static-element-interactions': 'warn', // Warn instead of error
            'jsx-a11y/anchor-is-valid': 'warn', // Warn instead of error

            // === Performance - Most rules handled by antfu config ===

            // === Complexity - More Relaxed ===
            'complexity': 'off', // Don't enforce complexity limits
            'max-lines': 'off', // Don't enforce file size limits
            'max-lines-per-function': 'off', // Don't enforce function size limits
        },
    },
	// --- Turn off no-undef for TS/TSX ---
	{
	   files: ['**/*.ts', '**/*.tsx'],
	     rules: {
	         'no-undef': 'off',
		      'unused-imports/no-unused-vars': 'off',
		     'no-empty-pattern': 'off',
		     'react/no-nested-component-definitions': 'off',
		     'ts/no-use-before-define': 'off',
		     'jsx-a11y/anchor-has-content': 'off',



	           },
	},
	// --- Relax rules for shadcn/ui components ---
	{
		files: ['src/components/ui/**/*.{ts,tsx}'],
		rules: {
			'perfectionist/sort-imports': 'off',
			'perfectionist/sort-named-exports': 'off',
			'import/consistent-type-specifier-style': 'off',
			'ts/no-import-type-side-effects': 'off',
			'jsx-a11y/no-noninteractive-element-interactions': 'off',
		},
	}
);
