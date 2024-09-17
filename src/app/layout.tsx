import "~/styles/globals.css";

import {type Metadata} from "next";
import {ThemeProvider} from '~/app/_components/ui/theme-provider';
import {TooltipProvider} from '~/app/_components/ui/tooltip'

import '@fontsource/spectral/400.css';
import '@fontsource/spectral/700.css';

export const metadata: Metadata = {
  title: 'Speech Cabinet',
  description: 'Disco Elysium video generator',
  icons: [{rel: "icon", url: "/favicon.ico"}],
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-y-visible overflow-x-hidden">
      <ThemeProvider attribute="class" defaultTheme="dark">
        <TooltipProvider>
          <main className="flex bg-zinc-900 text-zinc-50 min-h-dvh" data-vaul-drawer-wrapper>
            {children}
          </main>
        </TooltipProvider>
      </ThemeProvider>
      </body>
    </html>
);
}
