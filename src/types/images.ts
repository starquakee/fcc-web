export type ImageVariant = {
  src: string;
  width: number;
  height: number;
  bytes: number;
};

export type ImageMetadata = {
  width: number;
  height: number;
  variants?: readonly ImageVariant[];
};
