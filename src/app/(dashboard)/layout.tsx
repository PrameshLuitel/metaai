'use client';

import React, { useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
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
      <Sidebar>
        <SidebarHeader>
           <div className="flex h-9 w-full items-center gap-2 rounded-md bg-background p-2 text-sm font-medium text-foreground">
             <Link href="/dashboard" className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">VyaparOS</span>
             </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname.startsWith('/settings')} tooltip="Settings">
                    <Link href="/settings">
                        <Settings />
                        <span>Settings</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
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
