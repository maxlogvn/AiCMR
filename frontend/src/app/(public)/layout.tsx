import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Metadata for public pages
export const metadata = {
  title: "Blog - AiCMR",
  description: "Khám phá các bài viết về y tế, sức khỏe và công nghệ AI tại Blog AiCMR",
  keywords: ["blog", "y tế", "sức khỏe", "AI", "hồ sơ y tế"],
  openGraph: {
    title: "Blog - AiCMR",
    description: "Khám phá các bài viết về y tế, sức khỏe và công nghệ AI tại Blog AiCMR",
    type: "website",
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
