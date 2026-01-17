import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from '@/components/providers/QueryProvider';
import { ToastProvider } from '@/hooks/useToast';

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
    <html lang="vi">
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
