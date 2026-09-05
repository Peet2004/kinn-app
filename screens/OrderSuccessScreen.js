import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

import Colors from '../constants/colors';
import PrimaryButton from '../components/UI/PrimaryButton';

export default function OrderSuccessScreen({ route, navigation }) {
  const { orderId, total } = route.params;

  function goHome() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Tabs' }],
      })
    );
  }

  function goToHistory() {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Tabs', state: { routes: [{ name: 'History' }] } }],
      })
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={54} color={Colors.white} />
      </View>
      <Text style={styles.title}>สั่งซื้อสำเร็จ!</Text>
      <Text style={styles.subtitle}>
        ขอบคุณที่ใช้บริการ Kinn ร้านกำลังเตรียมอาหารของคุณ
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>หมายเลขคำสั่งซื้อ</Text>
          <Text style={styles.value}>#{orderId.slice(-6).toUpperCase()}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ยอดชำระทั้งหมด</Text>
          <Text style={styles.valueStrong}>฿{total}</Text>
        </View>
      </View>

      <PrimaryButton onPress={goToHistory} style={{ width: '100%', marginTop: 28 }}>
        ดูสถานะคำสั่งซื้อ
      </PrimaryButton>
      <PrimaryButton onPress={goHome} outline style={{ width: '100%', marginTop: 12 }}>
        กลับหน้าแรก
      </PrimaryButton>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary600,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text900,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text500,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.text500,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text900,
  },
  valueStrong: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary600,
  },
});
