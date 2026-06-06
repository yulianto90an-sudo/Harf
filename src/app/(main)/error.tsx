'use client';

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <p className="text-display-2 text-text-primary">Yah, ada yang error!</p>
      <p className="text-body text-text-secondary mt-2">{error.message}</p>
      <button
        onClick={reset}
        className="mt-6 px-6 py-3 bg-emerald-500 text-text-primary rounded-xl text-label font-semibold"
      >
        Coba Lagi
      </button>
    </div>
  );
}
