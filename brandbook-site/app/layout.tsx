import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://fusionstructure-brandbook.crdrawin.chatgpt.site'),
  title: 'FusionStructure · Brandbook',
  description: 'Sistema visual de FusionStructure: Make complexity legible.',
  openGraph: {
    title: 'FusionStructure · Brandbook',
    description: 'Make complexity legible. Un sistema visual claro, animado y trazable.',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: 'Sistema visual de FusionStructure' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FusionStructure · Brandbook',
    description: 'Make complexity legible. Un sistema visual claro, animado y trazable.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
