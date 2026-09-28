import "./globals.css";

import Providers from "./providers";

export const metadata = {
  title: "Chromiq — Fully On-Chain Animated NFTs",
  description:
    "10,000 fully on-chain generative animated NFTs on Base.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
