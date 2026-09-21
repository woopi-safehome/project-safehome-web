import type { NextConfig } from "next";

/**
 * 브라우저는 이 앱하고만 통신하고, `/api/*` 는 여기서 백엔드로 넘긴다.
 *
 * **같은 출처로 만들기 위해서다.** 브라우저가 백엔드를 직접 부르면 교차 출처가 되어
 * 비회원 분석의 주인을 가리는 쿠키가 실리지 않는다. 넘겨 주면 브라우저 입장에서는 한 곳이라
 * 쿠키가 그대로 오가고 CORS 설정도 필요 없다.
 *
 * 넘길 주소는 **서버에서만 읽는 값**이다. 브라우저에 내려갈 이유가 없으므로 `NEXT_PUBLIC_` 을 붙이지 않는다.
 */
const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
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
