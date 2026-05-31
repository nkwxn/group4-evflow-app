import { useState } from 'react';
import { EVDriverContainer } from '../ev_driver/EVDriverContainer';
import { LoginScreen } from '../login/LoginScreen';
import { ProfileSelectionScreen } from '../profile_selection/ProfileSelectionScreen';
import type { UserRole } from '../profile_selection/types';

export function HomeScreen() {
  const [screen, setScreen] = useState<'login' | 'profile' | 'driver'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');

  if (screen === 'driver') {
    return <EVDriverContainer />;
  }

  if (screen === 'profile') {
    return (
      <ProfileSelectionScreen
        selectedRole={selectedRole}
        onBack={() => setScreen('login')}
        onContinue={() => {
          if (selectedRole === 'driver') {
            setScreen('driver');
          }
        }}
        onSelectRole={setSelectedRole}
      />
    );
  }

  return <LoginScreen onLogin={() => setScreen('profile')} />;
}
