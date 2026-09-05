import { useContext } from 'react';
import { View, Text, Image, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { CartContext } from '../store/context/cart-context';
import PrimaryButton from '../components/UI/PrimaryButton';

export default function CartScreen({ navigation }) {
  const cartCtx = useContext(CartContext);

  if (cartCtx.items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyRoot}>
        <Ionicons name="cart-outline" size={56} color={Colors.text300} />
        <Text style={styles.emptyTitle}>ตะกร้าของคุณว่างเปล่า</Text>
        <Text style={styles.emptySubtitle}>เลือกเมนูที่ชอบแล้วใส่ตะกร้าได้เลย</Text>
        <PrimaryButton onPress={() => navigation.navigate('Tabs')} style={{ marginTop: 20 }}>
          เลือกเมนูอาหาร
        </PrimaryButton>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <FlatList
        data={cartCtx.items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemPrice}>฿{item.price} / จาน</Text>
            </View>
            <View style={styles.qtyControl}>
              <Pressable
                onPress={() => cartCtx.decreaseQuantity(item.id)}
                style={styles.qtyButton}
              >
                <Ionicons name="remove" size={16} color={Colors.primary600} />
              </Pressable>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <Pressable
                onPress={() => cartCtx.increaseQuantity(item.id)}
                style={styles.qtyButton}
              >
                <Ionicons name="add" size={16} color={Colors.primary600} />
              </Pressable>
            </View>
            <Pressable
              onPress={() => cartCtx.removeItem(item.id)}
              hitSlop={8}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color={Colors.danger} />
            </Pressable>
          </View>
        )}
      />

      <View style={styles.summaryBar}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>รวมทั้งหมด ({cartCtx.totalItems} รายการ)</Text>
          <Text style={styles.summaryValue}>฿{cartCtx.totalAmount}</Text>
        </View>
        <PrimaryButton onPress={() => navigation.navigate('Checkout')}>
          ไปที่ชำระเงิน
        </PrimaryButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text900,
    marginTop: 14,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.text500,
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  itemImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text900,
  },
  itemPrice: {
    fontSize: 12,
    color: Colors.text500,
    marginTop: 2,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary50,
    borderRadius: 10,
    paddingHorizontal: 4,
  },
  qtyButton: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text900,
    marginHorizontal: 6,
    minWidth: 14,
    textAlign: 'center',
  },
  summaryBar: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text500,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary600,
  },
});
