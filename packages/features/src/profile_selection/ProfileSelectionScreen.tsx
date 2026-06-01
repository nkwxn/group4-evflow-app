import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '@evflow/ui';
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

const pageMaxWidth = 420;

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    minHeight: '100%',
    width: '100%'
  },
  contentShell: {
    flex: 1,
    maxWidth: pageMaxWidth,
    minHeight: '100%',
    width: '100%'
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: 22
  },
  backButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  backIcon: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 34
  },
  brand: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 32
  },
  headerSpacer: {
    width: 40
  },
  content: {
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 120
  },
  title: {
    color: '#1f2529',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36
  },
  subtitle: {
    color: '#4a555a',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    maxWidth: 360
  },
  roleCard: {
    alignItems: 'flex-start',
    backgroundColor: '#fbfcfd',
    borderColor: '#d7dce0',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    minHeight: 158,
    paddingHorizontal: 16,
    paddingVertical: 18,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  selectedRoleCard: {
    backgroundColor: '#effdfe',
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0
  },
  roleIcon: {
    alignItems: 'center',
    backgroundColor: '#e2e4e6',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48
  },
  selectedRoleIcon: {
    backgroundColor: colors.primary
  },
  roleText: {
    flex: 1,
    gap: 6
  },
  roleTitle: {
    color: '#1f2529',
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 25
  },
  roleDescription: {
    color: '#4a555a',
    fontSize: 15,
    lineHeight: 24
  },
  radio: {
    alignItems: 'center',
    borderColor: '#b9c9cf',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24
  },
  selectedRadio: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  radioCheck: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTopColor: '#edf0f2',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    padding: 20,
    position: 'absolute',
    right: 0,
    shadowColor: '#000000',
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 10
  },
  continueButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 7,
    justifyContent: 'center',
    minHeight: 57
  },
  continueText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500'
  }
});
