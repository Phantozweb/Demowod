'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  FileText,
  Glasses,
  Grid,
  Heart,
  Camera,
  Home,
  ClipboardUser,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useFavorites } from '@/hooks/use-favorites';
import { Badge } from './ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/catalog', label: 'Product Catalog', icon: Grid },
  { href: '/try-on', label: 'Virtual Try-On', icon: Camera },
  { href: '/recommendations', label: 'AI Recommendations', icon: Bot },
  { href: '/prescription', label: 'My Prescription', icon: FileText },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/patient-analysis', label: 'Patient Analysis', icon: ClipboardUser },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { count: favoritesCount } = useFavorites();
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="h-16 justify-between p-3">
        <Link
          className="flex items-center gap-2"
          href="/catalog"
        >
          <Glasses className="size-8 text-primary" />
          <span className="font-headline text-2xl font-bold group-data-[collapsible=icon]:hidden">
            OptiView
          </span>
        </Link>
        {isMobile && <SidebarTrigger />}
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                   {item.href === '/favorites' && favoritesCount > 0 && (
                    <Badge variant="secondary" className="ml-auto group-data-[collapsible=icon]:hidden">{favoritesCount}</Badge>
                   )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden justify-center p-4 md:flex">
         <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
