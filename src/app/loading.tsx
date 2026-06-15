export default function Loading() {
  return (
    <main className="mp3-stage grid min-h-screen place-items-center bg-app-bg px-4">
      <section className="mp3-device max-w-sm">
        <div className="mp3-screen-shell">
          <div className="mp3-screen grid min-h-[280px] place-items-center p-6 text-center text-mp3-text">
            <div>
              <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-mp3-border border-t-mp3-primary" />
              <p className="text-lg font-bold">Loading music library</p>
              <p className="mt-1 text-sm font-semibold text-mp3-muted">음원 목록을 준비하고 있습니다.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
