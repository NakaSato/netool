import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Interactive visual CIDR and IP range calculator",
  description:
    "Interactive tool for IP and CIDR calculations. Visualize subnet analysis and IP ranges. Educational resource for network planning and IT learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1500,
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
              fontFamily: "var(--font-geist-sans)",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#10B981", // Green color for success icon
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
