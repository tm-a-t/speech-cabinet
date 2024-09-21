import "~/styles/globals.css";

import {type Metadata} from "next";
import {ThemeProvider} from '~/app/_components/ui/theme-provider';
import {TooltipProvider} from '~/app/_components/ui/tooltip';
import {Toaster} from "~/app/_components/ui/toaster";

import '@fontsource/spectral/400.css';
import '@fontsource/geologica/300.css';
import '@fontsource/geologica/400.css';
import '@fontsource/geologica/500.css';
import '@fontsource/geologica/600.css';
import {RenderStatusProvider} from '~/app/_components/render-status-provider';

export const metadata: Metadata = {
  title: 'Speech Cabinet',
  description: 'Disco Elysium video generator',
  icons: [{rel: "icon", url: "/favicon.ico"}],
};

export default function RootLayout({children}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="overflow-y-visible overflow-x-hidden leading-5">
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider>
            <RenderStatusProvider>
              <main className="flex bg-zinc-900 text-zinc-50 min-h-dvh" data-vaul-drawer-wrapper>
                {children}
              </main>
            </RenderStatusProvider>
            <Toaster/>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
