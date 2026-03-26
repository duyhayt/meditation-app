import gentleChime from '../../../assets/audio/gentle-chime.wav';
import meditativeRain from '../../../assets/sleep/meditative-rain.mp3';
import natureWalk from '../../../assets/sleep/nature-walk.mp3';
import pianoMusic from '../../../assets/sleep/piano-music.mp3';

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
  'sleep/piano-music.mp3': pianoMusic,
  'sleep/meditative-rain.mp3': meditativeRain,
  'sleep/nature-walk.mp3': natureWalk
} as const;

export type BundledAudioAssetName = keyof typeof bundledAudioAssetMap;

export function getBundledAudioModule(bundledAssetName: string): number | null {
  return bundledAudioAssetMap[bundledAssetName as BundledAudioAssetName] ?? null;
}
