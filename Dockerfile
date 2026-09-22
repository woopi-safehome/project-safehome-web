FROM node:22-alpine AS deps
WORKDIR /app

# 잠금 파일 그대로 설치한다. install 과 달리 잠금 파일을 고쳐 쓰지 않으므로,
# 잠금 파일이 낡으면 조용히 넘어가지 않고 여기서 실패한다.
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_ 값은 브라우저 번들에 그대로 박힌다 — 실행할 때 바꿀 수 없다.
# 카카오 키가 생기면 이 인자를 주고 **이미지를 다시 만들어야** 로그인 버튼이 열린다.
ARG NEXT_PUBLIC_KAKAO_JS_KEY=""
ENV NEXT_PUBLIC_KAKAO_JS_KEY=${NEXT_PUBLIC_KAKAO_JS_KEY}

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# standalone 산출물은 public 과 .next/static 을 담지 않는다. 셋을 따로 모아야 완성된다 —
# 빠뜨리면 화면은 뜨는데 스타일과 스크립트가 전부 404 가 된다.
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appgroup /app/public ./public

USER appuser

EXPOSE 3000
CMD ["node", "server.js"]
