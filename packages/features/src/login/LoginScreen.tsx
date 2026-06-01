import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { loginScreenStyles as styles } from '@evflow/ui';
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
