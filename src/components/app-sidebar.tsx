
'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText,
  Heart,
  Home,
  Book,
  Clipboard,
  FilePlus,
  History,
  Sparkles,
  PlaySquare,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';

const menuItems = [
  { href: '/catalog', label: 'Product Catalog', icon: Book },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="group-data-[mobile=true]:hidden">
        <div className="flex items-center justify-between p-2">
          <Link href="/" className="flex items-center gap-2">
            <FileText className="h-8 w-8 shrink-0 text-primary" />
            <span className="font-bold text-lg text-white group-data-[collapsible=icon]:hidden">
              Focus CaseX
            </span>
          </Link>
          <div className="group-data-[collapsible=icon]:hidden">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip="Home"
              >
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <Collapsible>
                 <CollapsibleTrigger asChild>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            isActive={pathname.startsWith('/patient-analysis')}
                            tooltip='Patient Analysis'
                        >
                            <Sparkles />
                            <span>Patient Analysis</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname === '/patient-analysis/new'}>
                                <Link href="/patient-analysis/new">
                                    <FilePlus />
                                    <span>New Patient</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={pathname.includes('/patient-analysis/cases')}>
                                <Link href="/patient-analysis/cases">
                                    <History />
                                    <span>View Cases</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>

          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/favorites'}
                tooltip="Favorites"
              >
                <Link href="/favorites">
                  <Heart />
                  <span>Favorites</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
