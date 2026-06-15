# 인공지능과 함께한 구현 문서

## 1. 구현 개요

Musico는 Next.js 16 App Router 기반으로 구현했다. 화면은 `src/app` 아래에 배치하고, 주요 기능은 FSD 구조에 맞춰 `entities`, `features`, `widgets`, `shared`로 분리했다. 인공지능과 함께 코드를 작성하면서 기능 구현 후 반복적으로 UI, 라우팅, 인증, 재생 안정성을 개선했다.

## 2. 폴더 구조

```text
src/
  app/                 Next.js App Router 페이지와 Route Handler
  entities/            사용자, 트랙, 플레이리스트, VIBE 응답 모델
  features/            인증, 플레이어, 관리자 기능
  shared/              공통 API 헤더, 유틸, 타입
  widgets/             MP3 플레이어 shell
messages/
  app-messages.ts      한국어/영어 전체 텍스트셋
supabase/
  migrations/          Supabase 테이블 마이그레이션
```

## 3. App Router 구현

플레이어 화면은 route group인 `src/app/(player)` 안에 구성했다.

- `src/app/(player)/layout.tsx`: MP3 플레이어 shell 유지
- `src/app/(player)/page.tsx`: 홈
- `src/app/(player)/chart/page.tsx`: 차트
- `src/app/(player)/new/page.tsx`: 신곡
- `src/app/(player)/search/page.tsx`: 검색
- `src/app/(player)/playlists/page.tsx`: 관리자 편성 플레이리스트
- `src/app/(player)/queue/page.tsx`: 현재 큐

이 구조 덕분에 하위 페이지가 바뀌어도 `MusicStudio` 위젯이 유지되고, ReactPlayer가 불필요하게 재생성되는 상황을 줄일 수 있었다.

## 4. 음원 목록 구현

사용자가 처음부터 재생할 수 있는 곡 목록이 필요했기 때문에 VIBE 기반 목록 API를 구현했다.

- `GET /api/songs/chart`
- `GET /api/songs/new-songs`
- `GET /api/songs/search`

서버에서는 VIBE 응답을 가져온 뒤 앱에서 사용하는 `VibeTrack` 형태로 직렬화한다. 화면에서는 `TrackTable`, `SectionShelf`, `HeroFeature` 컴포넌트로 곡 목록을 보여준다.

## 5. YouTube 재생 검증 구현

곡을 누르면 바로 videoId를 미리 들고 있지 않고, 재생 요청 시점에 `/api/search`를 호출한다.

구현 흐름은 다음과 같다.

1. 사용자가 곡을 누른다.
2. 서버가 `{아티스트명} {노래제목} lyrics` 형태로 YouTube 검색을 수행한다.
3. 후보 영상 제목에 아티스트명과 곡 제목이 포함되는지 확인한다.
4. YouTube oEmbed 응답으로 iframe 재생 가능 여부를 확인한다.
5. 통과한 영상의 `videoId`를 클라이언트에 반환한다.
6. 클라이언트가 큐에 곡을 추가하거나 기존 큐 항목을 갱신하고 재생한다.

인공지능과 함께 디버깅하면서, videoId 페칭은 끝났지만 새 곡으로 전환되지 않는 문제가 `currentIndex` 갱신 로직 때문임을 확인했다. 이후 새 곡과 중복 곡 모두 선택한 곡으로 이동하도록 수정했다.

## 6. 플레이어 구현

플레이어는 `react-player/youtube`를 사용한다. YouTube iframe은 화면에 드러나지 않게 두고, 사용자는 MP3 플레이어 UI만 조작한다.

주요 기능은 다음과 같다.

- 재생/일시정지
- 다음곡/이전곡
- 셔플
- 전체 반복
- 1곡 반복
- 재생 위치 바
- 큐에서 곡 선택 및 제거

재생 버튼은 단순 토글이 아니라 실제 플레이어 상태를 반영하도록 구현했다. `playbackIntentPlaying`은 재생 요청 상태이고, `playing`은 `onPlay`, `onPause`, `onEnded`, `onError` 이벤트를 통해 갱신되는 실제 재생 상태이다. 이 분리로 시스템 레벨에서 재생이 멈춘 경우에도 UI가 재생 중으로 남지 않게 했다.

## 7. 인증 구현

자체 회원가입/로그인 API를 구현했다.

- `POST /api/auth/signup`: 사용자 생성 및 비밀번호 해시 저장
- `POST /api/auth/login`: 비밀번호 검증, access token과 refresh token 발급
- `POST /api/auth/refresh`: refresh token 검증 및 토큰 재발급
- `GET /api/auth/me`: 현재 사용자 조회

로그인 성공 시 클라이언트 localStorage와 HTTP 쿠키에 토큰을 저장한다. 쿠키는 서버 프록시에서 보호 라우트를 검사하는 데 사용된다.

## 8. 보호 라우트 구현

비로그인 사용자의 직접 URL 접근을 막기 위해 `src/proxy.ts`에서 보호 라우트를 검사한다.

보호 대상:

- `/chart`
- `/new`
- `/playlists`

토큰이 없거나 검증에 실패하면 `/auth?next=...`로 이동한다. 네비게이션에서도 로그인 전에는 차트, 신곡, 플레이리스트 링크를 숨겨 사용자가 보호 페이지를 자연스럽게 인지할 수 있게 했다.

## 9. 관리자 기능 구현

일반 사용자는 플레이리스트를 생성하지 않고, 관리자가 편성한 공개 플레이리스트를 감상한다. 관리자 페이지에서는 다음 기능을 제공한다.

- 플레이리스트 생성
- 플레이리스트 삭제
- 곡 검색
- 재생 가능한 YouTube videoId 검증
- 플레이리스트에 곡 추가
- 플레이리스트에서 곡 삭제

관리자 API는 `musico_users.role = 'admin'` 사용자인지 서버에서 확인한다.

## 10. 다국어 구현

한국어와 영어 텍스트셋은 프로젝트 루트의 `messages/app-messages.ts`에 통합했다.

```text
messages/app-messages.ts
  ko.auth
  ko.player
  en.auth
  en.player
```

플레이어 화면에서는 언어 변경 버튼을 통해 `ko`와 `en`을 전환하고, 선택한 언어는 localStorage와 cookie에 저장한다.

## 11. UI 구현

초기에는 차트와 플레이어만 보이는 단순 UI였지만, 인공지능과 반복적으로 피드백을 주고받으며 다음 방향으로 개선했다.

- Spotify 스타일에서 출발했지만 최종적으로 iPod형 MP3 플레이어 컨셉으로 변경
- 모바일에서는 화면 전체가 MP3 플레이어가 되도록 반응형 처리
- 내부 스크린을 페이지 영역으로 사용
- 로그인/회원가입 화면도 MP3 플레이어 잠금 화면 느낌으로 개선
- hover 중심 효과를 모바일에 맞게 active 중심 효과로 변경

## 12. 이미지 최적화 구현

앨범아트와 관리자 검색 결과 이미지는 `next/image`를 사용한다. `next.config.ts`에 VIBE, YouTube, Melon, Genie 이미지 도메인을 등록했다.

## 13. 인공지능 활용 결과

인공지능은 다음 구현 작업에 사용했다.

- Route Handler 마이그레이션 코드 작성
- Supabase schema와 API 연동 정리
- JWT 인증과 보호 라우트 구현
- iPod 스타일 UI 구성
- 재생 상태 버그 원인 분석 및 수정
- 중복 key, 이미지 로딩, 모바일 터치, 로딩 UI 문제 해결
- 수행평가 요구사항 기준 문서화
