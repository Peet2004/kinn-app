import { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { AuthContext } from '../store/context/auth-context';
import FormInput from '../components/UI/FormInput';
import PrimaryButton from '../components/UI/PrimaryButton';

export default function ProfileScreen() {
  const { user, profile, logout, updateUserProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');

  const initials = (profile?.name || user?.email || 'K')
    .trim()
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  async function handleSave() {
    setIsSaving(true);
    try {
      await updateUserProfile({ name: name.trim(), phone: phone.trim(), address: address.trim() });
      setIsEditing(false);
    } catch (err) {
      Alert.alert('บันทึกไม่สำเร็จ', 'กรุณาลองอีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    Alert.alert('ออกจากระบบ', 'คุณต้องการออกจากระบบใช่หรือไม่?', [
      { text: 'ยกเลิก', style: 'cancel' },
      { text: 'ออกจากระบบ', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{profile?.name || 'ผู้ใช้งาน'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>ข้อมูลส่วนตัว</Text>
            <Pressable onPress={() => setIsEditing((e) => !e)} hitSlop={8}>
              <Ionicons
                name={isEditing ? 'close-outline' : 'create-outline'}
                size={20}
                color={Colors.primary600}
              />
            </Pressable>
          </View>

          {isEditing ? (
            <>
              <FormInput label="ชื่อ-นามสกุล" value={name} onChangeText={setName} />
              <FormInput
                label="เบอร์โทรศัพท์"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <FormInput
                label="ที่อยู่จัดส่งเริ่มต้น"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={2}
              />
              <PrimaryButton onPress={handleSave} loading={isSaving}>
                บันทึกข้อมูล
              </PrimaryButton>
            </>
          ) : (
            <>
              <InfoRow icon="call-outline" label="เบอร์โทรศัพท์" value={profile?.phone || '-'} />
              <InfoRow
                icon="location-outline"
                label="ที่อยู่จัดส่งเริ่มต้น"
                value={profile?.address || '-'}
              />
            </>
          )}
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={Colors.primary600} />
      <View style={{ marginLeft: 10, flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: Colors.primary600,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text900,
  },
  email: {
    fontSize: 13,
    color: Colors.text500,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text900,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.text500,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text900,
    fontWeight: '600',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.danger,
    borderRadius: 14,
    paddingVertical: 14,
  },
  logoutText: {
    color: Colors.danger,
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
});
