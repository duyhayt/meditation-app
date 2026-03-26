import type { ImageSourcePropType } from 'react-native';

import image1 from '../../assets/images/image_1.avif';
import image10 from '../../assets/images/image_10.avif';
import image2 from '../../assets/images/image_2.avif';
import image3 from '../../assets/images/image_3.avif';
import image4 from '../../assets/images/image_4.avif';
import image5 from '../../assets/images/image_5.avif';
import image6 from '../../assets/images/image_6.avif';
import image7 from '../../assets/images/image_7.avif';
import image8 from '../../assets/images/image_8.avif';
import image9 from '../../assets/images/image_9.avif';

const imageRegistry = {
  'asset:image_1': image1,
  'asset:image_2': image2,
  'asset:image_3': image3,
  'asset:image_4': image4,
  'asset:image_5': image5,
  'asset:image_6': image6,
  'asset:image_7': image7,
  'asset:image_8': image8,
  'asset:image_9': image9,
  'asset:image_10': image10
} as const;

export type AppImageToken = keyof typeof imageRegistry;

export const appImageTokens = {
  sunriseMeditation: 'asset:image_1',
  mountainLake: 'asset:image_2',
  forestMist: 'asset:image_3',
  moonSky: 'asset:image_4',
  oceanNight: 'asset:image_5',
  clouds: 'asset:image_6',
  breathing: 'asset:image_7',
  moonForest: 'asset:image_8',
  course: 'asset:image_9',
  silhouette: 'asset:image_10'
} as const satisfies Record<string, AppImageToken>;

export function resolveAppImageSource(
  value: string | null | undefined
): ImageSourcePropType | undefined {
  if (!value) {
    return undefined;
  }

  if (value in imageRegistry) {
    return imageRegistry[value as AppImageToken];
  }

  return { uri: value };
}

export function resolveAppImageModule(value: string | null | undefined): number | null {
  if (!value || !(value in imageRegistry)) {
    return null;
  }

  return imageRegistry[value as AppImageToken];
}
