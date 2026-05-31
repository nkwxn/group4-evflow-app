import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '@evflow/ui';
import { useAppSafeAreaInsets } from '../shared/useAppSafeAreaInsets';

type LoginScreenProps = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const insets = useAppSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.page,
        {
          paddingBottom: 36 + insets.bottom,
          paddingTop: 36 + insets.top
        }
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.top}>
        <Text style={styles.signupText}>
          Belum punya akun? <Text style={styles.signupLink}>Daftar Sekarang</Text>
        </Text>
      </View>

      <View style={styles.content}>
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

const pageMaxWidth = 420;

const styles = StyleSheet.create({
  page: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingVertical: 36
  },
  top: {
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
  content: {
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
  }
});
