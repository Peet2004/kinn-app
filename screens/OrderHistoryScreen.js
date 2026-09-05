import { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { OrderContext } from '../store/context/order-context';

const STATUS_STYLES = {
  pending: { label: 'รอดำเนินการ', color: Colors.warning },
  preparing: { label: 'กำลังเตรียม', color: Colors.primary500 },
  delivering: { label: 'กำลังจัดส่ง', color: Colors.primary600 },
  completed: { label: 'สำเร็จ', color: Colors.primary700 },
  cancelled: { label: 'ยกเลิก', color: Colors.danger },
};

function formatDate(value) {
  if (!value) return '';
  const date = value?.toDate ? value.toDate() : new Date(value);
  return date.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderHistoryScreen() {
  const { orders, isLoading, refreshOrders } = useContext(OrderContext);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ประวัติการสั่งซื้อ</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refreshOrders} colors={[Colors.primary600]} />
        }
        renderItem={({ item }) => {
          const status = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>#{item.id.slice(-6).toUpperCase()}</Text>
                <View style={[styles.statusPill, { backgroundColor: status.color + '22' }]}>
                  <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              <Text style={styles.itemsSummary} numberOfLines={1}>
                {item.items?.map((i) => `${i.title} x${i.quantity}`).join(', ')}
              </Text>
              <View style={styles.footerRow}>
                <Text style={styles.itemsCount}>{item.items?.length || 0} เมนู</Text>
                <Text style={styles.total}>฿{item.total}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          !isLoading && (
            <View style={styles.emptyBox}>
              <Ionicons name="receipt-outline" size={48} color={Colors.text300} />
              <Text style={styles.emptyText}>ยังไม่มีประวัติการสั่งซื้อ</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text900,
  },
  list: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text900,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    color: Colors.text500,
    marginTop: 4,
  },
  itemsSummary: {
    fontSize: 13,
    color: Colors.text700,
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  itemsCount: {
    fontSize: 12,
    color: Colors.text500,
  },
  total: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary600,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: Colors.text500,
    marginTop: 10,
  },
});
