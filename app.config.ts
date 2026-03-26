import type { ExpoConfig } from 'expo/config';

const appEnv = process.env.APP_ENV ?? 'development';

const config: ExpoConfig = {
  name: `RN Template (${appEnv})`,
  slug: 'react-native-template',
  scheme: 'rnstarter',
  plugins: ['expo-sqlite'],
  ios: {
    bundleIdentifier: 'com.townsoftvina.reactnativetemplate',
    infoPlist: {
      UIBackgroundModes: ['audio', 'processing']
    }
  },
  android: {
    package: 'com.townsoftvina.reactnativetemplate',
    permissions: [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK'
    ]
  },
  extra: {
    appEnv
  }
};

export default config;
