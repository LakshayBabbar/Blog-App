import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import QueryProvider from "../context/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/context/AuthProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} class="overflow-x-hidden dark:bg-black"`}
      >
        {process.env.ENV === "production" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=G-R3CVRC1C6P`}
              strategy="afterInteractive"
            />

            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() {
              dataLayer.push(arguments);
          }
          gtag("js", new Date());
          gtag("config", "G-R3CVRC1C6P");
          `,
              }}
            />
            <Script
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7436170435436020"
              strategy="afterInteractive"
            />
          </>
        )}
        <AuthProvider>
          <Navbar />
          <QueryProvider>{children}</QueryProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
