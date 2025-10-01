import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background text-foreground">
        <AppSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </SidebarProvider>
  );
}
