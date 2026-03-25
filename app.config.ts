import type { ExpoConfig } from 'expo/config';

const appEnv = process.env.APP_ENV ?? 'development';

const config: ExpoConfig = {
  name: `RN Template (${appEnv})`,
  slug: 'react-native-template',
  scheme: 'rnstarter',
  plugins: ['expo-sqlite'],
  ios: {
    bundleIdentifier: 'com.townsoftvina.reactnativetemplate'
  },
  android: {
    package: 'com.townsoftvina.reactnativetemplate'
  },
  extra: {
    appEnv
  }
};

export default config;
