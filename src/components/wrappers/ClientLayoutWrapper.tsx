"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { DSocialLink } from "@/types/dashboard.types";
import { fontClassNames } from "@/styles/design_v2/subframe.fonts";

interface ClientLayoutWrapperProps {
  children: React.ReactNode;
  resumeUrl?: string | null;
  userName?: string | null;
  footerSocialLinks?: DSocialLink[];
}

export default function ClientLayoutWrapper({
  children,
  resumeUrl,
  userName,
  footerSocialLinks,
}: ClientLayoutWrapperProps) {
  const pathname = usePathname();

  // Do not show the main header/footer on dashboard routes or the sign-in page
  const isDashboardOrAuth = pathname?.startsWith("/d") || pathname === "/signin";

  if (isDashboardOrAuth) {
    return <main className={fontClassNames}>{children}</main>;
  }

  return (
    <div className={fontClassNames}>
      <Header resumeUrl={resumeUrl} userName={userName} />
      <main className="container mx-auto max-w-page px-4 py-8 pb-3">{children}</main>
      <Footer userName={userName} socialLinks={footerSocialLinks} />
    </div>
  );
}
