import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mp3-stage grid min-h-screen place-items-center bg-app-bg px-4">
      <section className="mp3-device max-w-sm text-mp3-text">
        <div className="mp3-screen-shell">
          <div className="mp3-screen p-6">
            <p className="text-sm font-bold text-mp3-muted">404</p>
            <h1 className="mt-1 text-2xl font-bold">Track Not Found</h1>
            <p className="mt-2 text-sm font-semibold text-mp3-muted">요청한 화면을 찾을 수 없습니다.</p>
            <Link className="mt-5 inline-block rounded bg-mp3-primary px-4 py-2 text-sm font-bold text-white" href="/">
              홈으로 이동
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
