import { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';

import Colors from '../../constants/colors';
import { AuthContext } from '../../store/context/auth-context';
import PrimaryButton from '../../components/UI/PrimaryButton';
import FormInput from '../../components/UI/FormInput';

function mapAuthError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'อีเมลนี้ถูกใช้สมัครไปแล้ว';
    case 'auth/invalid-email':
      return 'รูปแบบอีเมลไม่ถูกต้อง';
    case 'auth/weak-password':
      return 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    default:
      return 'สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง';
  }
}

export default function RegisterScreen({ navigation }) {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('ข้อมูลไม่ครบ', 'กรุณากรอกชื่อ อีเมล และรหัสผ่าน');
      return;
    }
    if (password.length < 6) {
      Alert.alert('รหัสผ่านสั้นเกินไป', 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('รหัสผ่านไม่ตรงกัน', 'กรุณากรอกยืนยันรหัสผ่านให้ตรงกัน');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password, phone.trim());
    } catch (err) {
      Alert.alert('สมัครสมาชิกไม่สำเร็จ', mapAuthError(err.code));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>สร้างบัญชี Kinn</Text>
        <Text style={styles.subtitle}>สมัครสมาชิกเพื่อเริ่มสั่งอาหาร</Text>

        <View style={styles.form}>
          <FormInput label="ชื่อ-นามสกุล" placeholder="ชื่อของคุณ" value={name} onChangeText={setName} />
          <FormInput
            label="เบอร์โทรศัพท์"
            placeholder="08x-xxx-xxxx"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <FormInput
            label="อีเมล"
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <FormInput
            label="รหัสผ่าน"
            placeholder="อย่างน้อย 6 ตัวอักษร"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <FormInput
            label="ยืนยันรหัสผ่าน"
            placeholder="พิมพ์รหัสผ่านอีกครั้ง"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <PrimaryButton onPress={handleRegister} loading={isSubmitting} style={{ marginTop: 8 }}>
            สมัครสมาชิก
          </PrimaryButton>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>มีบัญชีอยู่แล้ว? </Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>เข้าสู่ระบบ</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 24,
    paddingTop: 64,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text900,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text500,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 28,
  },
  form: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 22,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: Colors.text500,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.primary600,
    fontSize: 14,
    fontWeight: '700',
  },
});
