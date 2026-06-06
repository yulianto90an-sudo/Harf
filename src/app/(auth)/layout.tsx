import { Providers } from '@/components/providers';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-dvh max-w-app mx-auto bg-bg-primary">
      <main className="flex-1 flex flex-col px-6 pt-12 pb-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
