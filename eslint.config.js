import js from "@eslint/js";
import pluginSecurity from "eslint-plugin-security";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        navigator: "readonly"
      },
      ecmaVersion: "latest",
      sourceType: "module"
    },
    plugins: {
      security: pluginSecurity,
      react: pluginReact,
      "react-hooks": pluginReactHooks
    },
    rules: {
      ...pluginSecurity.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,

      // Reglas de seguridad
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-unsafe-finally": "error",
      "no-script-url": "error"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }
];
