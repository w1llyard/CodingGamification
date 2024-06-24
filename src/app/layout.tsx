import type { Metadata } from "next";
import "./globals.css";
import localFont from '@next/font/local'
import RootLayoutClient from './RootLayoutClient';

const retro = localFont({
  src: [
    {
      path: '../../public/fonts/minecraft.otf',

    },

  ],
  variable: '--font-RETRO'
})

export const metadata: Metadata = {
  title: "CodeManiacs",
  description: "Coding but a little bit more fun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${retro.variable} font-sans no-scrollbar`} lang="en">
      <RootLayoutClient>
        {children}
      </RootLayoutClient>
    </html>
  );
}
