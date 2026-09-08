import type { Metadata } from 'next';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_BRANDBOOK_SITE_URL ??
  'https://fusionstructure-brandbook.crdrawin.chatgpt.site/';

const absoluteAsset = (path: string) =>
  new URL(path.replace(/^\//, ''), siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'FusionStructure · Brandbook',
  description:
    'Sistema visual y verbal de FusionStructure: marca aqua, color con significado, movimiento que explica y un catálogo de 25 superficies con su estado real.',
  icons: { icon: absoluteAsset('/favicon.svg') },
  openGraph: {
    title: 'FusionStructure · Brandbook',
    description:
      'Make complexity legible. Marca, señales, movimiento, voz y 25 superficies con estado verificable.',
    images: [
      {
        url: absoluteAsset('/og.png'),
        width: 1536,
        height: 1024,
        alt: 'Sistema visual de FusionStructure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FusionStructure · Brandbook',
    description:
      'Make complexity legible. Marca, señales, movimiento, voz y 25 superficies con estado verificable.',
    images: [absoluteAsset('/og.png')],
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
