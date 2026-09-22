import type { NextConfig } from "next";

/**
 * 브라우저는 이 앱하고만 통신하고, `/api/*` 는 같은 출처에서 백엔드로 넘어간다.
 *
 * **같은 출처로 만들기 위해서다.** 브라우저가 백엔드를 직접 부르면 교차 출처가 되어
 * 비회원 분석의 주인을 가리는 쿠키가 실리지 않는다. 넘겨 주면 브라우저 입장에서는 한 곳이라
 * 쿠키가 그대로 오가고 CORS 설정도 필요 없다.
 *
 * **넘기는 주체가 환경마다 다르다.**
 *
 * - 로컬(`next dev`·`next start`): 아래 `rewrites` 가 넘긴다.
 * - 배포: **앞단의 리버스 프록시가 `/api/` 를 API 로 직접 보낸다.** 그 요청은 이 앱에 닿지도 않는다.
 *
 * 배포에서 이 앱을 거치지 않게 한 이유는 두 가지다. 진행 상황 스트림(SSE)이 중간 단계를
 * 하나라도 덜 지나야 하고, **아래 주소가 빌드 시점에 박히기 때문**이다.
 *
 * `rewrites` 의 결과는 `next build` 가 `routes-manifest.json` 에 써 넣는다.
 * 즉 `API_ORIGIN` 은 **이미지를 만들 때 고정되고 실행할 때 바꿀 수 없다.**
 * 컨테이너 환경변수에 넣어도 아무 일도 일어나지 않는다 — 배포에서 이 값을 쓰지 않는 이유다.
 */
const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  /**
   * 배포 이미지를 위한 산출물. `node_modules` 없이 도는 `server.js` 와 최소 파일만 추린다.
   *
   * **`public` 과 `.next/static` 은 여기에 담기지 않는다.** Dockerfile 이 따로 복사한다 —
   * 빠뜨리면 화면은 뜨는데 정적 파일이 전부 404 가 된다.
   */
  output: "standalone",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
