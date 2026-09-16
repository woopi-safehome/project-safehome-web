#!/usr/bin/env bash
# 이 저장소의 검증. CI 가 붙으면 이 파일을 그대로 실행한다.
# 끝났다고 말하기 전에도 이것을 돌린다 — 명령이 다르면 로컬 통과가 CI 통과를 뜻하지 않는다.
#
# 셋을 다 돌리는 이유: 서로 보는 것이 다르다.
#   lint  — 의존 방향(app → features → shared)을 본다. 타입은 보지 않는다.
#   test  — 동작을 본다. 구조도 타입도 보지 않는다.
#   build — 타입과 정적 생성을 본다. 의존 방향은 보지 않는다.
set -euo pipefail
cd "$(dirname "$0")/.."

npm run lint
npm test
npm run build
