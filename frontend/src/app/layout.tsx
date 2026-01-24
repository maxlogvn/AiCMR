import { Inter } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/hooks/useToast";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import InstallGuard from "@/components/auth/InstallGuard";
import CsrfTokenProvider from "@/components/providers/CsrfTokenProvider";
import type { PublicSettingsResponse } from "@/types";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Default metadata (fallback)
const defaultTitle = "AiCMR - Hệ thống quản lý hồ sơ y tế tích hợp AI";
const defaultDescription = "AiCMR - Giải pháp quản lý y tế thông minh với AI integration";

// Static metadata để tránh streaming error
export const metadata = {
  title: defaultTitle,
  description: defaultDescription,
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: defaultTitle,
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
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
