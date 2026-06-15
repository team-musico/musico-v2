# 인공지능과 함께한 테스트 문서

## 1. 서비스 사용에 필요한 정보

- 어드민 유저/비밀번호: rxd123 / a123
- 배포 uri: https://musico-five.vercel.app/

## 2. 정적 검증

아래 명령을 실행하여 코드 규칙, 타입, 프로덕션 빌드를 확인했다.

```bash
npm run rules:check
npm run typecheck
npm run build
```

확인 결과:

- ESLint 통과
- TypeScript 타입 검사 통과
- Next.js 16 Turbopack production build 통과

## 3. 수행평가 요구사항 검증

| 요구사항 | 검증 결과 |
| --- | --- |
| Next.js 16.x | `package.json`의 `next@16.2.7` 확인 |
| App Router | `src/app` 기반 페이지와 Route Handler 확인 |
| TypeScript | `npm run typecheck` 통과 |
| npm | `package-lock.json`과 npm scripts 확인 |
| 다국어 | `messages/app-messages.ts`의 `ko/en` 텍스트셋 및 플레이어 언어 전환 확인 |
| DB/백엔드 연동 | Supabase client, admin client, migrations, Route Handler 확인 |
| 사용자 쓰기 | 회원가입, 큐 수정, 관리자 플레이리스트 생성/삭제/곡 추가/삭제 API 확인 |
| 로그인/인증 | `/api/auth/signup`, `/api/auth/login`, JWT 발급/검증 확인 |
| 보호 영역 | `/chart`, `/new`, `/playlists`가 proxy에서 비로그인 접근 차단 |
| Route Handler | `src/app/api/*/route.ts` 다수 확인 |
| 화면 3개 이상 | 홈, 차트, 신곡, 검색, 플레이리스트, 큐, 관리자 확인 |
| 로딩 UI | `src/app/loading.tsx`, `src/app/(player)/loading.tsx` 확인 |
| 에러 UI | `src/app/error.tsx` 확인 |
| 404 UI | `src/app/not-found.tsx` 확인 |
| 이미지 최적화 | `next/image` 사용 및 remotePatterns 확인 |
| 메타데이터 | `src/app/layout.tsx` title, description, OG 확인 |
| favicon | `src/app/icon.svg` 확인 |
| sitemap/robots | `src/app/sitemap.ts`, `src/app/robots.ts` 확인 |

## 4. 보호 라우트 테스트

비로그인 상태에서 직접 접근을 확인했다.

```bash
curl -I http://localhost:3000/chart
curl -I http://localhost:3000/new
curl -I http://localhost:3000/playlists
```

예상 결과:

- `307 Temporary Redirect`
- `location: /auth?next=/chart`
- `location: /auth?next=/new`
- `location: /auth?next=/playlists`

이 테스트로 사용자가 URL을 직접 입력해도 보호 페이지에 접근할 수 없음을 확인했다.

## 5. 인증 플로우 테스트

확인 항목:

1. `/auth`에서 회원가입을 수행한다.
2. 회원가입 후 자동 로그인 API를 호출한다.
3. access token과 refresh token이 저장된다.
4. 로그인 후 원래 이동하려던 `next` 경로로 이동한다.
5. 저장된 토큰으로 `/api/auth/me`가 현재 사용자를 반환한다.

관련 파일:

- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/me/route.ts`
- `src/features/auth/hooks/useAuthScreen.ts`

## 6. 관리자 기능 테스트

확인 항목:

1. 일반 사용자로 `/admin` 접근 시 권한 없음 화면 또는 인증 페이지로 이동한다.
2. `role = 'admin'` 사용자로 접근하면 관리자 데이터가 자동으로 로드된다.
3. 플레이리스트를 생성한다.
4. VIBE 검색 결과에서 곡을 선택한다.
5. `/api/search`를 통해 YouTube videoId를 검증한다.
6. 곡을 플레이리스트에 추가한다.
7. 플레이리스트에서 곡을 삭제한다.
8. 플레이리스트를 삭제한다.

관련 API:

- `GET /api/admin/playlists`
- `POST /api/admin/playlists`
- `DELETE /api/admin/playlists`
- `POST /api/admin/playlists/song`
- `DELETE /api/admin/playlists/song`

## 7. 재생 흐름 테스트

확인 항목:

1. 차트, 신곡, 검색, 플레이리스트 중 하나에서 곡을 누른다.
2. 재생 버튼에 로딩 표시가 나타난다.
3. `/api/search`가 videoId를 반환한다.
4. 큐에 곡이 추가되거나 기존 큐 항목이 최신 videoId로 갱신된다.
5. 현재 곡이 선택한 곡으로 바뀐다.
6. ReactPlayer의 실제 `onPlay` 이벤트 이후 재생 중 UI가 표시된다.
7. 시스템 레벨에서 재생이 멈추면 `onPause` 이벤트로 UI도 멈춤 상태가 된다.

인공지능과 함께 발견한 주요 버그:

- videoId 페칭은 완료됐지만 현재 곡이 바뀌지 않는 문제가 있었다.
- 원인은 새 곡을 큐에 추가할 때 `currentIndex`가 새 곡으로 이동하지 않는 로직이었다.
- 해결 후 새 곡과 중복 곡 모두 현재 곡으로 선택되도록 수정했다.

## 8. UI 테스트

확인 항목:

- 모바일 화면에서 MP3 플레이어가 화면 전체를 채우는지 확인
- hover 중심 효과가 모바일 터치에서 어색하지 않도록 active 효과로 변경
- 로그인 전 네비게이션에서 차트, 신곡, 플레이리스트가 숨겨지는지 확인
- 로그인/회원가입 화면이 작은 화면에서 가로 overflow 없이 표시되는지 확인
- 로딩 UI가 내부 스크린 영역에서 자연스럽게 표시되는지 확인

## 9. 이미지 테스트

처음에는 VIBE 이미지 도메인이 private IP로 해석되어 Next Image 에러가 발생했다. `next.config.ts`에 이미지 도메인과 `dangerouslyAllowLocalIP` 설정을 추가해 개발 환경에서 앨범아트가 정상 표시되도록 했다.