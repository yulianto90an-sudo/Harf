'use client';

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center space-y-4">
      <span className="text-4xl">😅</span>
      <h2 className="text-display-2 text-text-primary font-bold">Yah, ada yang error!</h2>
      <p className="text-body text-text-secondary max-w-xs">
        {error.message || 'Terjadi kesalahan. Coba lagi, ya.'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-emerald-500 rounded-xl text-label font-semibold text-white hover:bg-emerald-400 active:bg-emerald-600 transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}
