import { NativeRouter } from 'react-router-native';
import { AppRoutes } from './AppRoutes';

export function AppRouter() {
  return (
    <NativeRouter>
      <AppRoutes />
    </NativeRouter>
  );
}
