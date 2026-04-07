import { RootNavigator } from '@/src/navigation';
import { AuthProvider } from '@/src/state';

export default function Index() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
