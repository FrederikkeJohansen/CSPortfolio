import type { Metadata } from "next";
import "./globals.css";
import { SearchProvider } from "@/providers/SearchProvider";

export const metadata: Metadata = {
  title: "Project Portfolio",
  description: "Student project portfolio from Department of Computer Science at Aarhus University",
};

/** Root layout — wraps every page with global styles and the search provider. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SearchProvider>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
