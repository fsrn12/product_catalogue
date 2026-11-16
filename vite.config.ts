import { defineConfig } from "vite-plus";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  // 1. BUILD | BUNDLE (tsdown + Rolldown)
  pack: {
    entry: ["src/server.ts"],
    format: ["esm"],
    platform: "node",
    target: "nodenext",
    outExtensions: () => ({ js: ".js" }),
    clean: true,
    sourcemap: true,
    dts: false,
    shims: true,
    external: ["argon2"],
  },

  // 2. LINTING (Oxlint + tsgo)
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    plugins: ["typescript", "node", "unicorn", "import", "promise"],
    categories: {
      correctness: "error",
      suspicious: "warn",
      perf: "warn",
      pedantic: "warn",
    },
    rules: {
      "typescript/no-explicit-any": "error",
      "typescript/no-floating-promises": "error",
      "typescript/await-thenable": "error",
      "typescript/no-misused-promises": "error",
      "typescript/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "import/no-cycle": "error",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "unicorn/prefer-node-protocol": "error",
      "typescript/prefer-readonly-parameter-types": "off",
    },
    overrides: [
      {
        files: ["src/domain/**/*.ts"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: [
                    "express",
                    "mongoose",
                    "pino*",
                    "#infrastructure/*",
                    "#interfaces/*",
                    "#application/*",
                  ],
                  message:
                    "HEXAGONAL VIOLATION: Core Domain must remain 100% pure and free of framework or outer-layer imports.",
                },
              ],
            },
          ],
        },
      },
      {
        files: ["src/domain/errors/**/*.ts"],
        rules: {
          "eslint/max-classes-per-file": "off",
        },
      },
      {
        files: ["src/application/**/*.ts"],
        rules: {
          "no-restricted-imports": [
            "error",
            {
              patterns: [
                {
                  group: ["express", "mongoose", "#infrastructure/*", "#interfaces/*"],
                  message:
                    "HEXAGONAL VIOLATION: Application Use Cases can only depend on Domain ports, never Infrastructure or HTTP adapters.",
                },
              ],
            },
          ],
        },
      },
    ],
    ignorePatterns: ["dist/**", "node_modules/**", "coverage"],
  },

  // 3. FORMATTING (Oxfmt)
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: false,
    trailingComma: "all",
    endOfLine: "lf",
    sortPackageJson: true,
    sortImports: {
      groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
      newlinesBetween: true,
    },
  },

  // 4. TESTING (Vitest — resolves @domain/* aliases automatically)
  test: {
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    environment: "node",
    clearMocks: true,
  },
});
