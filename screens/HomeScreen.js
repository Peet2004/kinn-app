import { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { CATEGORIES, MEALS } from '../data/meal-data';
import MenuCard from '../components/MenuCard';
import { AuthContext } from '../store/context/auth-context';
import { CartContext } from '../store/context/cart-context';

export default function HomeScreen({ navigation }) {
  const { profile } = useContext(AuthContext);
  const cartCtx = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');

  const filteredMeals = useMemo(() => {
    return MEALS.filter((meal) => {
      const matchesCategory = selectedCategory
        ? meal.categoryIds.includes(selectedCategory)
        : true;
      const matchesSearch = meal.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  const firstName = profile?.name?.split(' ')[0] || 'ผู้ใช้งาน';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>สวัสดี, {firstName} 👋</Text>
          <Text style={styles.subGreeting}>วันนี้อยากกินอะไรดี?</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}
          hitSlop={8}
        >
          <Ionicons name="cart-outline" size={22} color={Colors.white} />
          {cartCtx.totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCtx.totalItems}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.text500} />
        <TextInput
          placeholder="ค้นหาเมนู..."
          placeholderTextColor={Colors.text300}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[{ id: null, title: 'ทั้งหมด' }, ...CATEGORIES]}
        keyExtractor={(item) => item.id ?? 'all'}
        contentContainerStyle={styles.chipsRow}
        renderItem={({ item }) => {
          const isActive = selectedCategory === item.id;
          return (
            <Pressable
              onPress={() => setSelectedCategory(item.id)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {item.title}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <MenuCard
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl}
            price={item.price}
            duration={item.duration}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="restaurant-outline" size={40} color={Colors.text300} />
            <Text style={styles.emptyText}>ไม่พบเมนูที่ค้นหา</Text>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text900,
  },
  subGreeting: {
    fontSize: 13,
    color: Colors.text500,
    marginTop: 2,
  },
  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text900,
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: Colors.primary600,
    borderColor: Colors.primary600,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text700,
  },
  chipTextActive: {
    color: Colors.white,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Colors.text500,
    marginTop: 8,
  },
});
