import ThemeToggle from '@/components/ThemeToggle';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/shadcn/ui/navigation-menu';
import { UserButton } from '@clerk/clerk-react';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BaseAppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { pathname } = useLocation();

  return (
    <main className="h-screen">
      <div className="w-full h-full">
        <header className="flex h-16 shrink-0 items-center border-b px-4 md:px-6 sticky top-0 z-[50] bg-background">
          <Link className="flex items-center gap-1 mr-6" to="/">
            <img src="/logo.png" alt="Logo" className="h-6 w-6 rounded-md" />
            <span className="font-semibold">inGeniti</span>
          </Link>
          <nav className="ml-auto flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    to="/"
                    className={`${navigationMenuTriggerStyle()} text-sm font-medium hover:underline underline-offset-4 ${pathname === '/' ? 'text-primary' : ''
                      }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/schedules"
                    className={`${navigationMenuTriggerStyle()} text-sm font-medium hover:underline underline-offset-4 ${pathname === '/schedules' ? 'text-primary' : ''
                      }`}
                  >
                    Schedules
                  </Link>
                  <Link
                    to="/devices"
                    className={`${navigationMenuTriggerStyle()} text-sm font-medium hover:underline underline-offset-4 ${pathname === '/devices' ? 'text-primary' : ''
                      }`}
                  >
                    Devices
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>
        {children}
      </div>
    </main>
  );
};

export default BaseAppLayout;
