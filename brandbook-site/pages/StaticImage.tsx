import type { ImgHTMLAttributes } from 'react';

type StaticImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  unoptimized?: boolean;
  priority?: boolean;
  fill?: boolean;
};

export default function StaticImage({
  unoptimized,
  priority,
  fill,
  ...imageProps
}: StaticImageProps) {
  void unoptimized;
  void priority;
  void fill;

  return <img {...imageProps} />;
}
