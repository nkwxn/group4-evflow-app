import { useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import { EVDriverContainer } from '../ev_driver/EVDriverContainer';
import { LoginScreen } from '../login/LoginScreen';
import { ProfileSelectionScreen } from '../profile_selection/ProfileSelectionScreen';
import type { UserRole } from '../profile_selection/types';

export function AppRoutes() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');

  return (
    <Routes>
      <Route path="/" element={<LoginRoute />} />
      <Route
        path="/profile-selection"
        element={<ProfileSelectionRoute selectedRole={selectedRole} onSelectRole={setSelectedRole} />}
      />
      <Route path="/ev-driver" element={<Navigate replace to="/ev-driver/map" />} />
      <Route path="/ev-driver/:tab" element={<EVDriverContainer />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
}

function LoginRoute() {
  const navigate = useNavigate();

  return <LoginScreen onLogin={() => navigate('/profile-selection')} />;
}

type ProfileSelectionRouteProps = {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
};

function ProfileSelectionRoute({ selectedRole, onSelectRole }: ProfileSelectionRouteProps) {
  const navigate = useNavigate();

  return (
    <ProfileSelectionScreen
      selectedRole={selectedRole}
      onBack={() => navigate('/')}
      onContinue={() => {
        if (selectedRole === 'driver') {
          navigate('/ev-driver');
        }
      }}
      onSelectRole={onSelectRole}
    />
  );
}
