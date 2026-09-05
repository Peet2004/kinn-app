import { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { AuthContext } from '../store/context/auth-context';
import { CartContext } from '../store/context/cart-context';
import FormInput from '../components/UI/FormInput';
import PrimaryButton from '../components/UI/PrimaryButton';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'เก็บเงินปลายทาง', icon: 'cash-outline' },
  { id: 'card', label: 'บัตรเครดิต/เดบิต', icon: 'card-outline' },
  { id: 'promptpay', label: 'พร้อมเพย์', icon: 'qr-code-outline' },
];

export default function CheckoutScreen({ navigation }) {
  const { profile } = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const [address, setAddress] = useState(profile?.address || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const deliveryFee = 20;
  const total = cartCtx.totalAmount + deliveryFee;

  function handleContinue() {
    if (!address.trim()) {
      Alert.alert('กรุณากรอกที่อยู่', 'ระบุที่อยู่จัดส่งก่อนดำเนินการต่อ');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('กรุณากรอกเบอร์โทร', 'ระบุเบอร์โทรติดต่อก่อนดำเนินการต่อ');
      return;
    }

    navigation.navigate('OrderSummary', {
      address: address.trim(),
      phone: phone.trim(),
      note: note.trim(),
      paymentMethod,
      deliveryFee,
      total,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.root} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>ที่อยู่จัดส่ง</Text>
        <FormInput
          placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด"
          multiline
          numberOfLines={3}
          value={address}
          onChangeText={setAddress}
          style={{ marginBottom: 12 }}
        />
        <FormInput
          placeholder="เบอร์โทรติดต่อ"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.sectionTitle}>วิธีการชำระเงิน</Text>
        {PAYMENT_METHODS.map((method) => {
          const isActive = paymentMethod === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => setPaymentMethod(method.id)}
              style={[styles.paymentRow, isActive && styles.paymentRowActive]}
            >
              <Ionicons
                name={method.icon}
                size={20}
                color={isActive ? Colors.primary600 : Colors.text500}
              />
              <Text style={[styles.paymentLabel, isActive && styles.paymentLabelActive]}>
                {method.label}
              </Text>
              <Ionicons
                name={isActive ? 'radio-button-on' : 'radio-button-off'}
                size={20}
                color={isActive ? Colors.primary600 : Colors.text300}
                style={{ marginLeft: 'auto' }}
              />
            </Pressable>
          );
        })}

        <Text style={styles.sectionTitle}>หมายเหตุถึงร้าน (ไม่บังคับ)</Text>
        <FormInput
          placeholder="เช่น ไม่ใส่ผัก, เผ็ดน้อย"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={2}
        />

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ยอดรวมอาหาร</Text>
            <Text style={styles.summaryValue}>฿{cartCtx.totalAmount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>ค่าจัดส่ง</Text>
            <Text style={styles.summaryValue}>฿{deliveryFee}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>ยอดชำระทั้งหมด</Text>
            <Text style={styles.totalValue}>฿{total}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton onPress={handleContinue}>ตรวจสอบคำสั่งซื้อ</PrimaryButton>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text900,
    marginTop: 8,
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  paymentRowActive: {
    borderColor: Colors.primary500,
    backgroundColor: Colors.primary50,
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.text700,
    marginLeft: 10,
    fontWeight: '600',
  },
  paymentLabelActive: {
    color: Colors.primary700,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.text500,
  },
  summaryValue: {
    fontSize: 13,
    color: Colors.text900,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text900,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary600,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
