export default function PatientAnalysisLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-svh w-full bg-background text-foreground">{children}</main>
  );
}
