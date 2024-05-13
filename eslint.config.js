/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-check

import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";


export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylisticTypeChecked,
	{
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				project: true,
				tsconfigRootDir: import.meta.dirname
			}
		}
	},
	{
		rules: {
			"@typescript-eslint/no-this-alias": [
				"error",
				{
					"allowedNames": [ "self" ]
				}
			],
			"@typescript-eslint/prefer-nullish-coalescing": "off",
			"no-unused-vars": "warn",
			"no-trailing-spaces": "error",
			"linebreak-style": [ "error", "unix" ],
			"quotes": [ "error", "double" ],
			"one-var": [ "error", "never" ],
			"brace-style": [ "error", "allman", { "allowSingleLine": true } ],
			"space-before-blocks": [ "warn" ],
			"func-call-spacing": [ "error", "never" ],
			"space-before-function-paren": [ "error", "always" ],
			"space-in-parens": [ "error", "always", { "exceptions": [ "{}" ] } ],
			"keyword-spacing": [ "error" ],
			"comma-spacing": [ "error" ],
			"space-unary-ops": [ "error" ],
			"block-spacing": [ "error" ],
			"arrow-spacing": [ "error" ],
			"key-spacing": [ "error" ],
			"comma-style": [ "error" ],
			"space-infix-ops": [ "error" ],
			"array-bracket-spacing": [ "error", "always" ],
			"object-curly-spacing": [ "error", "always" ],
			"no-multi-spaces": [ "error" ],
			"operator-linebreak": [ "error", "after" ],
			"function-paren-newline": [ "warn" ],
			// "arrow-parens": [
			//  "error",
			//  "always"
			// ],
			"arrow-body-style": [ "error", "always" ],
			"no-template-curly-in-string": [ "error" ],
			"prefer-const": [
				"error",
				{
					"destructuring": "any",
					"ignoreReadBeforeAssign": false
				}
			],
			"no-new-object": [ "error" ],
			"no-extra-parens": [
				"error",
				"all",
				{
					"conditionalAssign": false
				}
			],
			"no-empty-function": [ "error" ],
			"no-empty": [
				"warn",
				{
					"allowEmptyCatch": true
				}
			],
			"no-eq-null": [ "error" ],
			"no-extra-bind": [ "error" ],
			"no-self-compare": [ "error" ],
			"no-useless-call": [ "error" ],
			"no-undefined": [ "error" ],
			"no-array-constructor": [ "error" ],
			"prefer-destructuring": [
				"error", {
					"VariableDeclarator": {
						"array": true,
						"object": true
					},
					"AssignmentExpression": {
						"array": false,
						"object": false
					}
				},
				{
					"enforceForRenamedProperties": false
				}
			],
			"object-shorthand": [ "warn" ],
			"prefer-spread": [ "warn" ],
			"prefer-template": [ "warn" ],
			"no-loop-func": [ "warn" ],
			"prefer-rest-params": [ "warn" ],
			"no-new-func": [ "warn" ],
			"no-unneeded-ternary": [ "warn" ],
			"no-process-exit": "off",
			"require-await": "warn",
			"indent": [
				"error",
				"tab",
				{
					"MemberExpression": 0
				}
			],
			"no-tabs": 0,
			"node/no-unpublished-import": "off",
			"node/no-unpublished-require": "off",
			"node/no-missing-import": "off",
			"node/no-unsupported-features/es-syntax": "off"
		}
	},
	{
		files: [ "**/*.js" ],
		extends: [ tseslint.configs.disableTypeChecked ]
	},
);