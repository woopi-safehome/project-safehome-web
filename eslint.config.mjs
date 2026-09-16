import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ── 의존 방향을 한 방향으로 고정한다: app → features → shared ──
  // 어기면 여기서 걸린다. 규칙을 문서에 적어 두지 않는 이유다.
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features", "@/features/*", "@/app", "@/app/*"],
              message:
                "shared 는 features·app 을 알 수 없다. 공용으로 쓸 것이면 shared 안에 두고, 기능에 매인 것이면 그 기능 안에 둔다.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features", "@/features/*"],
              message:
                "기능끼리 직접 참조하지 않는다. 같은 기능 안은 상대경로로, 기능 사이에 공유할 것은 shared 로 올린다.",
            },
            {
              group: ["@/app", "@/app/*"],
              message: "features 는 라우팅(app)을 알 수 없다. 조립은 app 이 한다.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
