import { ClerkProvider } from '@clerk/clerk-react';
import { dark as clerkDarkTheme } from '@clerk/themes';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';
import AppLayout from './layouts/AppLayout';
import RootLayout from './layouts/AuthLayout';
import FullScreenAppLayout from './layouts/FullScreenAppLayout';
import Dashboard from './pages/Dashboard';
import SignInPage from './pages/SignIn';
import SignUpPage from './pages/SignUp';
import AuthGuard from './providers/AuthGuard';
import QueryProvider from './providers/QueryProvider';
import { ThemeProvider, useTheme } from './providers/ThemeProvider';
import { TooltipProvider } from './shadcn/ui/tooltip';
import ScheduleDetailsPage from './pages/ScheduleList';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const App = () => {
  const { theme } = useTheme();
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div role="alert">
          <p>Something went wrong:</p>
          <pre style={{ color: 'red' }}>{error.message}</pre>
        </div>
      )}
    >
      <React.StrictMode>
        <TooltipProvider delayDuration={200}>
          <ClerkProvider
            publishableKey={PUBLISHABLE_KEY}
            {...(theme === 'dark' && {
              appearance: { baseTheme: clerkDarkTheme },
            })}
          >
            <QueryProvider>
              <Toaster position="top-right" />
              <Router>
                <Routes>
                  <Route element={<RootLayout />}>
                    <Route path="/sign-in" element={<SignInPage />} />
                    <Route path="/sign-up" element={<SignUpPage />} />
                  </Route>
                  <Route element={<AuthGuard />}>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/schedules" element={<ScheduleDetailsPage />} />
                    </Route>
                    <Route element={<FullScreenAppLayout />}></Route>
                  </Route>
                </Routes>
              </Router>
            </QueryProvider>
          </ClerkProvider>
        </TooltipProvider>
      </React.StrictMode>
    </ErrorBoundary>
  );
};

root.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
