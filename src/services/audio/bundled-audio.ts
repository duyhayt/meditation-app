import gentleChime from '../../../assets/audio/gentle-chime.wav';

export const bundledAudioAssetMap = {
  'meditation/five-minute-arrival.wav': gentleChime,
  'meditation/soften-the-thoughts.wav': gentleChime,
  'meditation/clarity-before-work.wav': gentleChime,
  'meditation/sleepy-body-scan.wav': gentleChime,
  'course/lesson-1.wav': gentleChime,
  'course/lesson-2.wav': gentleChime,
  'course/lesson-3.wav': gentleChime,
  'breathing/box-breathing.mp3': gentleChime,
  'breathing/deep-calm.mp3': gentleChime,
  'breathing/morning-boost.mp3': gentleChime,
  'sleep/ocean-dusk.wav': gentleChime,
  'sleep/rain-on-glass.wav': gentleChime,
  'sleep/forest-night.wav': gentleChime
} as const;

export type BundledAudioAssetName = keyof typeof bundledAudioAssetMap;

export function getBundledAudioModule(bundledAssetName: string): number | null {
  return bundledAudioAssetMap[bundledAssetName as BundledAudioAssetName] ?? null;
}
