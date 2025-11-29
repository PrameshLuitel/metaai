'use client';

import React, { useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';
import { CommandMenu } from '@/components/command-menu';
import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import {
  Home,
  ShoppingCart,
  Package,
  MessageCircle,
  Users,
  LineChart,
  Settings,
  Mountain,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/chat', icon: MessageCircle, label: 'Chat' },
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/inventory', icon: Package, label: 'Inventory' },
  { href: '/customers', icon: Users, label: 'Customers' },
  { href: '/analytics', icon: LineChart, label: 'Analytics' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader>
           <div className="flex h-9 w-full items-center gap-2 rounded-md p-2 text-sm font-medium text-foreground">
             <Link href="/dashboard" className="flex items-center gap-2">
                <Mountain className="h-6 w-6 text-primary" />
                 <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">VyaparOS</span>
             </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground group-data-[collapsible=icon]:justify-center"
                  >
                    <Link href={item.href}>
                      <item.icon className={cn(!isActive && "text-muted-foreground group-hover:text-foreground")} />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </ul>
        </SidebarContent>
        <SidebarFooter>
          <ul className="flex w-full min-w-0 flex-col gap-1">
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip="Settings" className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground group-data-[collapsible=icon]:justify-center">
                    <Link href="/settings">
                        <Settings className={cn(!pathname.startsWith('/settings') && "text-muted-foreground group-hover:text-foreground")} />
                        <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </ul>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
              {children}
            </main>
        </div>
        <CommandMenu />
      </SidebarInset>
    </SidebarProvider>
  );
}
