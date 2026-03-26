import TrackPlayer, { Event } from 'react-native-track-player';

import {
  getSleepTimerTargetEpochMs,
  setSleepTimerTargetEpochMs
} from '@/services/audio/sleep-timer.storage';

async function enforceSleepTimer() {
  const targetEpochMs = await getSleepTimerTargetEpochMs();

  if (!targetEpochMs || Date.now() < targetEpochMs) {
    return;
  }

  await setSleepTimerTargetEpochMs(null);
  await TrackPlayer.pause();
}

export async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    await TrackPlayer.seekBy(event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    await TrackPlayer.seekBy(-event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    await TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async () => {
    await enforceSleepTimer();
  });
}
