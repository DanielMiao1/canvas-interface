// @ts-check

import eslint from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";

export default tseslint.config(
	eslint.configs.recommended,
	stylistic.configs["recommended-flat"],
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: `${import.meta.dirname}/src`
			}
		},
		plugins: {
			"@stylistic": stylistic
		}
	},
	{
		rules: {
			"@stylistic/brace-style": ["error", "1tbs"],
			"@stylistic/comma-dangle": ["error", "never"],
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/member-delimiter-style": ["error", {
				"multiline": {
					"delimiter": "semi",
					"requireLast": true
				},
				"singleline": {
					"delimiter": "semi",
					"requireLast": false
				},
				"multilineDetection": "brackets"
			}],
			"@stylistic/no-tabs": "off",
			"@stylistic/operator-linebreak": ["error", "after"],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/semi": ["error", "always"],
			"@typescript-eslint/no-empty-object-type": ["error", {
				allowInterfaces: "with-single-extends"
			}]
		}
	}
);
