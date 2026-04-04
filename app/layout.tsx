import { AppSidebar } from '@/components/app-sidebar';
import { Background } from '@/components/background';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Focus Mate',
  description: 'A productivity app to help you focus',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarProvider>
            <Background />
            <AppSidebar />
            <main className="relative w-full overflow-hidden">
                <SidebarTrigger className='glass absolute top-0 left-0 z-50' />
                {children}
            </main>
          </SidebarProvider>
          <Toaster position='top-right' />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
