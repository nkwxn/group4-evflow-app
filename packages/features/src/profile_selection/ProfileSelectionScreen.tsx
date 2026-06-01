import { Pressable, ScrollView, Text, View } from 'react-native';
import { colors, profileSelectionStyles as styles } from '@evflow/ui';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';
import { RoleAssetIcon } from './components/RoleAssetIcon';
import type { UserRole } from './types';

type ProfileSelectionScreenProps = {
  selectedRole: UserRole;
  onBack: () => void;
  onContinue: () => void;
  onSelectRole: (role: UserRole) => void;
};

export function ProfileSelectionScreen({ selectedRole, onBack, onContinue, onSelectRole }: ProfileSelectionScreenProps) {
  const insets = useAppSafeAreaInsets();

  return (
    <View style={styles.page}>
      <View style={styles.contentShell}>
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
          <Text style={styles.brand}>EV-FLOW</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 120 + insets.bottom }]}>
          <Text style={styles.title}>Selesaikan Profil Anda</Text>
          <Text style={styles.subtitle}>
            Pilih jenis akun untuk menyesuaikan pengalaman berkendara atau perencanaan Anda.
          </Text>

          <RoleCard
            description="Cari SPKLU terdekat, filter tipe konektor (CCS2/AC Type 2), rencanakan rute perjalanan, dan pantau pengisian daya real-time."
            role="driver"
            selected={selectedRole === 'driver'}
            title="Pengemudi EV (Driver)"
            onPress={() => onSelectRole('driver')}
          />
          <RoleCard
            description="Akses dashboard VoltGrid, analisis data spasial BPS, petakan demand hotspot, dan optimalkan lokasi penempatan SPKLU baru di Jabodetabek."
            role="operator"
            selected={selectedRole === 'operator'}
            title="Operator & Planner"
            onPress={() => onSelectRole('operator')}
          />
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
          <Pressable accessibilityRole="button" onPress={onContinue} style={styles.continueButton}>
            <Text style={styles.continueText}>Lanjutkan ke Aplikasi {'->'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

type RoleCardProps = {
  title: string;
  description: string;
  role: UserRole;
  selected: boolean;
  onPress: () => void;
};

function RoleCard({ title, description, role, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.roleCard, selected && styles.selectedRoleCard]}
    >
      <View style={[styles.roleIcon, selected && styles.selectedRoleIcon]}>
        <RoleAssetIcon color={selected ? colors.text : '#3d494b'} role={role} />
      </View>

      <View style={styles.roleText}>
        <Text style={styles.roleTitle}>{title}</Text>
        <Text style={styles.roleDescription}>{description}</Text>
      </View>

      <View style={[styles.radio, selected && styles.selectedRadio]}>
        {selected ? <Text style={styles.radioCheck}>✓</Text> : null}
      </View>
    </Pressable>
  );
}
