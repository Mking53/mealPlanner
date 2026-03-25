import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { RootNavigator } from '@/src/navigation';

export default function App() {
  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}
