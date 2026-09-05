import { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { CartContext } from '../store/context/cart-context';
import { OrderContext } from '../store/context/order-context';
import PrimaryButton from '../components/UI/PrimaryButton';

const PAYMENT_LABELS = {
  cod: 'เก็บเงินปลายทาง',
  card: 'บัตรเครดิต/เดบิต',
  promptpay: 'พร้อมเพย์',
};

export default function OrderSummaryScreen({ route, navigation }) {
  const { address, phone, note, paymentMethod, deliveryFee, total } = route.params;
  const cartCtx = useContext(CartContext);
  const orderCtx = useContext(OrderContext);
  const [isPlacing, setIsPlacing] = useState(false);

  async function confirmOrder() {
    setIsPlacing(true);
    try {
      const orderId = await orderCtx.placeOrder({
        items: cartCtx.items,
        subtotal: cartCtx.totalAmount,
        deliveryFee,
        total,
        address,
        phone,
        note,
        paymentMethod,
      });
      cartCtx.clearCart();
      navigation.replace('OrderSuccess', { orderId, total });
    } catch (err) {
      Alert.alert('สั่งซื้อไม่สำเร็จ', 'กรุณาลองอีกครั้งภายหลัง');
    } finally {
      setIsPlacing(false);
    }
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>รายการอาหาร</Text>
        <View style={styles.card}>
          {cartCtx.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity}x</Text>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>฿{item.price * item.quantity}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>จัดส่งไปที่</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={Colors.primary600} />
            <Text style={styles.infoText}>{address}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={18} color={Colors.primary600} />
            <Text style={styles.infoText}>{phone}</Text>
          </View>
          {!!note && (
            <View style={styles.infoRow}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.primary600} />
              <Text style={styles.infoText}>{note}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Ionicons name="wallet-outline" size={18} color={Colors.primary600} />
            <Text style={styles.infoText}>{PAYMENT_LABELS[paymentMethod]}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>สรุปยอด</Text>
        <View style={styles.card}>
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
        <PrimaryButton onPress={confirmOrder} loading={isPlacing}>
          ยืนยันการสั่งซื้อ
        </PrimaryButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text900,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQty: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary600,
    width: 30,
  },
  itemTitle: {
    flex: 1,
    fontSize: 13,
    color: Colors.text900,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text700,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 13,
    color: Colors.text700,
    flex: 1,
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
