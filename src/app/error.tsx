"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mp3-stage grid min-h-screen place-items-center bg-app-bg px-4">
      <section className="mp3-device max-w-sm text-mp3-text">
        <div className="mp3-screen-shell">
          <div className="mp3-screen p-6">
            <h1 className="text-2xl font-bold">Playback Error</h1>
            <p className="mt-2 text-sm font-semibold text-mp3-muted">
              {error.message || "서비스를 불러오는 중 문제가 발생했습니다."}
            </p>
            <button
              className="mt-5 rounded bg-mp3-primary px-4 py-2 text-sm font-bold text-white"
              onClick={reset}
            >
              다시 시도
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
