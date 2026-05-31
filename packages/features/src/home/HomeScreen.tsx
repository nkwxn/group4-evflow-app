import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@evflow/ui';
import { useAppSafeAreaInsets } from './useAppSafeAreaInsets';

type UserRole = 'driver' | 'operator';

export function HomeScreen() {
  const [screen, setScreen] = useState<'login' | 'profile'>('login');
  const [selectedRole, setSelectedRole] = useState<UserRole>('driver');

  if (screen === 'profile') {
    return (
      <ProfileSelectionScreen
        selectedRole={selectedRole}
        onBack={() => setScreen('login')}
        onSelectRole={setSelectedRole}
      />
    );
  }

  return <LoginScreen onLogin={() => setScreen('profile')} />;
}

type LoginScreenProps = {
  onLogin: () => void;
};

function LoginScreen({ onLogin }: LoginScreenProps) {
  const insets = useAppSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.loginPage,
        {
          paddingBottom: 36 + insets.bottom,
          paddingTop: 36 + insets.top
        }
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.loginTop}>
        <Text style={styles.signupText}>
          Belum punya akun? <Text style={styles.signupLink}>Daftar Sekarang</Text>
        </Text>
      </View>

      <View style={styles.loginContent}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoBolt}>⚡</Text>
        </View>

        <Text style={styles.appTitle}>EV-FLOW</Text>
        <Text style={styles.appSubtitle}>Electric Vehicle Forecasting & Location Optimization Wayfinder</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="Masukkan email Anda"
            placeholderTextColor="#7c858b"
            style={styles.input}
          />
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.inputLabel}>Kata Sandi</Text>
            <Text style={styles.forgotText}>Lupa?</Text>
          </View>
          <TextInput
            accessibilityLabel="Kata Sandi"
            placeholder="••••••••••••"
            placeholderTextColor="#69777c"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable accessibilityRole="button" onPress={onLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Masuk</Text>
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>- Atau masuk dengan -</Text>
          <View style={styles.divider} />
        </View>

        <Pressable accessibilityRole="button" style={styles.googleButton}>
          <Text style={styles.googleLogo}>G</Text>
          <Text style={styles.googleText}>Google</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

type ProfileSelectionScreenProps = {
  selectedRole: UserRole;
  onBack: () => void;
  onSelectRole: (role: UserRole) => void;
};

function ProfileSelectionScreen({ selectedRole, onBack, onSelectRole }: ProfileSelectionScreenProps) {
  const insets = useAppSafeAreaInsets();

  return (
    <View style={styles.profilePage}>
      <View style={[styles.profileHeader, { paddingTop: insets.top }]}>
        <Pressable accessibilityLabel="Kembali" accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <Text style={styles.profileBrand}>EV-FLOW</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={[styles.profileContent, { paddingBottom: 120 + insets.bottom }]}>
        <Text style={styles.profileTitle}>Selesaikan Profil Anda</Text>
        <Text style={styles.profileSubtitle}>
          Pilih jenis akun untuk menyesuaikan pengalaman berkendara atau perencanaan Anda.
        </Text>

        <RoleCard
          description="Cari SPKLU terdekat, filter tipe konektor (CCS2/AC Type 2), rencanakan rute perjalanan, dan pantau pengisian daya real-time."
          icon="▣"
          selected={selectedRole === 'driver'}
          title="Pengemudi EV (Driver)"
          onPress={() => onSelectRole('driver')}
        />
        <RoleCard
          description="Akses dashboard VoltGrid, analisis data spasial BPS, petakan demand hotspot, dan optimalkan lokasi penempatan SPKLU baru di Jabodetabek."
          icon="⌁"
          selected={selectedRole === 'operator'}
          title="Operator & Planner"
          onPress={() => onSelectRole('operator')}
        />
      </ScrollView>

      <View style={[styles.profileFooter, { paddingBottom: 20 + insets.bottom }]}>
        <Pressable accessibilityRole="button" style={styles.continueButton}>
          <Text style={styles.continueText}>Lanjutkan ke Aplikasi {'->'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

type RoleCardProps = {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onPress: () => void;
};

function RoleCard({ title, description, icon, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.roleCard, selected && styles.selectedRoleCard]}
    >
      <View style={[styles.roleIcon, selected && styles.selectedRoleIcon]}>
        <Text style={[styles.roleIconText, selected && styles.selectedRoleIconText]}>{icon}</Text>
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
  loginPage: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 36
  },
  loginTop: {
    alignItems: 'center',
    minHeight: 132,
    width: '100%'
  },
  signupText: {
    color: '#1f2529',
    fontSize: 14,
    lineHeight: 20
  },
  signupLink: {
    color: colors.text,
    fontWeight: '700'
  },
  loginContent: {
    alignItems: 'center',
    maxWidth: pageMaxWidth,
    width: '100%'
  },
  logoCircle: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { height: 3, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    width: 64
  },
  logoBolt: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34
  },
  appTitle: {
    color: '#1f2529',
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 32,
    marginTop: 18
  },
  appSubtitle: {
    color: '#4b555a',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 4,
    textAlign: 'center'
  },
  fieldGroup: {
    gap: 6,
    marginTop: 16,
    width: '100%'
  },
  inputLabel: {
    color: '#25292d',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 16
  },
  input: {
    backgroundColor: '#e9eaec',
    borderRadius: 8,
    color: '#1f2529',
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 16
  },
  passwordLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  forgotText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800'
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 7,
    justifyContent: 'center',
    marginTop: 34,
    minHeight: 49,
    width: '100%'
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500'
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 38,
    width: '100%'
  },
  divider: {
    backgroundColor: '#cfd8de',
    flex: 1,
    height: 1
  },
  dividerText: {
    color: '#435158',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18
  },
  googleButton: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#b8c8cf',
    borderRadius: 7,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 50,
    minHeight: 48,
    width: 156
  },
  googleLogo: {
    color: '#4285f4',
    fontSize: 13,
    fontWeight: '900'
  },
  googleText: {
    color: '#2d3135',
    fontSize: 13,
    fontWeight: '800'
  },
  profilePage: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    flex: 1,
    maxWidth: pageMaxWidth,
    minHeight: '100%',
    width: '100%'
  },
  profileHeader: {
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
  profileBrand: {
    color: colors.text,
    fontSize: 25,
    fontWeight: '800',
    lineHeight: 32
  },
  headerSpacer: {
    width: 40
  },
  profileContent: {
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 120
  },
  profileTitle: {
    color: '#1f2529',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36
  },
  profileSubtitle: {
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
  roleIconText: {
    color: '#263238',
    fontSize: 21,
    fontWeight: '800'
  },
  selectedRoleIconText: {
    color: colors.text
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
  profileFooter: {
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
