import Navbar from "./components/navbar/navbar";
import SiteHeader from "./components/site-header/site-header";
import { ThemeProvider } from "./components/theme-provider/theme-provider";
import "./globals.css";
import { IBM_Plex_Mono } from "next/font/google";

const ibm_plex_mono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sachin Arya",
  description: "Sachin Arya Portfolio Website",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className={ibm_plex_mono.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <main className="text-foreground">
            <SiteHeader />
            <div className="w-full">
              <Navbar />
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
