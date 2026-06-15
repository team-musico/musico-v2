export default function PlayerLoading() {
  return (
    <div className="absolute inset-0 z-20 grid place-items-center bg-mp3-panel">
      <div className="size-8 animate-spin rounded-full border-[2.5px] border-mp3-loading-border border-t-mp3-apple-dark" aria-label="Loading" />
    </div>
  );
}
