import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Running via bare `eslint .` (not `next lint`) — see package.json's
  // "lint" script. `next/core-web-vitals` doesn't ship its own `ignores`
  // when loaded through FlatCompat, so build output has to be excluded
  // explicitly or a bare `eslint .` will try to lint .next/'s generated JS.
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Stage 1 intentionally ships several not-yet-implemented function
      // signatures (lib/columns.ts, lib/doctors.ts, lib/jsonld.ts,
      // lib/metadata.ts) whose parameters aren't read yet. Leading
      // underscore is the explicit "known unused, on purpose" signal.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default eslintConfig;
