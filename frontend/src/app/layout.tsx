import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProvider from "@/components/providers/QueryProvider";
import { ToastProvider } from "@/hooks/useToast";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import InstallGuard from "@/components/auth/InstallGuard";
import CsrfTokenProvider from "@/components/providers/CsrfTokenProvider";
import type { PublicSettingsResponse } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Default metadata (fallback nếu không fetch được settings)
const defaultTitle = "AiCMR - Hệ thống quản lý hồ sơ y tế tích hợp AI";
const defaultDescription = "AiCMR - Giải pháp quản lý y tế thông minh với AI integration";

// Fetch settings from backend API để generate metadata động
async function getSettings() {
  try {
    const { settingsApi } = await import("@/lib/api");
    const response = await settingsApi.getPublicSettings();
    return response.data;
  } catch (error) {
    console.error("Failed to fetch settings for metadata:", error);
    // Fallback về default metadata
    return {
      site_name: "AiCMR",
      logo_url: null,
      favicon_url: null,
      seo_title: defaultTitle,
      seo_description: defaultDescription,
      seo_keywords: null,
      og_title: defaultTitle,
      og_description: defaultDescription,
      og_image: null,
      og_type: "website",
      og_url: null,
      twitter_card: "summary_large_image",
      twitter_title: defaultTitle,
      twitter_description: defaultDescription,
      twitter_image: null,
      robots: "index, follow",
      canonical_url: null,
      google_analytics_id: null,
      custom_meta: null,
    };
  }
}

// Cache settings để tránh fetch multiple lần trên mỗi request
let cachedSettings: PublicSettingsResponse | null = null;

async function getCachedSettings(): Promise<PublicSettingsResponse> {
  if (cachedSettings) {
    return cachedSettings;
  }
  cachedSettings = await getSettings();
  return cachedSettings;
}

export async function generateMetadata() {
  const settings = await getCachedSettings();

  // Generate title với site_name từ settings
  const title = settings.seo_title || `${settings.site_name} - Hệ thống quản lý`;
  const description = settings.seo_description || defaultDescription;

  // Build metadata object
  return {
    title,
    description,
    keywords: settings.seo_keywords || undefined,
    robots: settings.robots || "index, follow",
    alternates: {
      canonical: settings.canonical_url ? settings.canonical_url : undefined,
    },
    openGraph: {
      type: settings.og_type || "website",
      title: settings.og_title || title,
      description: settings.og_description || description,
      images: settings.og_image
        ? [
            {
              url: settings.og_image,
              width: 1200,
              height: 630,
              alt: settings.site_name,
            },
          ]
        : undefined,
      url: settings.og_url || undefined,
    },
    twitter: {
      card: settings.twitter_card || "summary_large_image",
      title: settings.twitter_title || title,
      description: settings.twitter_description || description,
      images: settings.twitter_image
        ? [
            {
              url: settings.twitter_image,
              width: 1200,
              height: 630,
              alt: settings.site_name,
            },
          ]
        : undefined,
    },
    icons: {
      icon: settings.favicon_url || "/favicon.ico",
    },
  };
}

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
