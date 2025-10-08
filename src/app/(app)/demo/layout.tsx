
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh w-full bg-background text-foreground">{children}</main>
  );
}
