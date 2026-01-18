import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from '@/components/providers/QueryProvider';
import { ToastProvider } from '@/hooks/useToast';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import InstallGuard from '@/components/auth/InstallGuard';
import CsrfTokenProvider from '@/components/providers/CsrfTokenProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AiCMR - User Management",
  description: "AiCMR - Hệ thống quản lý người dùng với phân quyền theo rank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  if (theme === 'dark' || (!theme && systemTheme === 'dark')) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <CsrfTokenProvider>
          <InstallGuard>
            <ThemeProvider>
              <ClientProvider>
                <ToastProvider>
                  {children}
                  <Toaster position="top-right" richColors closeButton />
                </ToastProvider>
              </ClientProvider>
            </ThemeProvider>
          </InstallGuard>
        </CsrfTokenProvider>
      </body>
    </html>
  );
}
