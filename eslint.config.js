/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-check

import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";


/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
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
		plugins: {
			stylistic
		},
		rules: {
			"stylistic/indent": [
				"error",
				"tab",
				{
					"MemberExpression": 0
				}
			],
			"stylistic/no-tabs": 0,
			"stylistic/brace-style": [ "error", "allman" ],
			"stylistic/comma-style": [ "error" ],
			"stylistic/array-bracket-spacing": [ "error", "always" ],
			"stylistic/space-before-blocks": [ "warn" ],
			"stylistic/comma-spacing": [ "error" ],
			"stylistic/function-call-spacing": [ "error", "never" ],
			"stylistic/space-before-function-paren": [ "error", "always" ],
			"stylistic/space-in-parens": [ "error", "always", { exceptions: [ "{}" ] } ],
			"stylistic/keyword-spacing": [ "error" ],
			"stylistic/space-unary-ops": [ "error" ],
			"stylistic/key-spacing": [ "error" ],
			"stylistic/arrow-parens": [
			 "error",
			 "always"
			],
			"stylistic/function-paren-newline": [ "warn" ],
			"stylistic/linebreak-style": [ "error", "unix" ],
			"stylistic/quotes": [ "error", "double" ],
			"stylistic/semi": "error",
			"stylistic/no-trailing-spaces": "error",
			"stylistic/block-spacing": [ "error" ],
			"stylistic/arrow-spacing": [ "error" ],
			"stylistic/space-infix-ops": [ "error" ],
			"stylistic/object-curly-spacing": [ "error", "always" ],
			"stylistic/no-multi-spaces": [ "error" ],
			"stylistic/operator-linebreak": [ "error", "after" ],
			"stylistic/no-extra-parens": [
				"error",
				"all",
				{
					"conditionalAssign": false
				}
			],
			"stylistic/comma-dangle": [ "error" ]
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
			"one-var": [ "error", "never" ],
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
			"require-await": "warn"
		}
	},
	{
		files: [ "**/*.js" ],
		extends: [ tseslint.configs.disableTypeChecked ]
	}
];
