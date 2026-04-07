import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { RootNavigator } from '@/src/navigation';
import { AuthProvider } from '@/src/state';

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
