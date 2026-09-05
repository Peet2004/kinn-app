import { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { MEALS } from '../data/meal-data';
import { FavoritesContext } from '../store/context/favorite-context';
import MenuCard from '../components/MenuCard';

export default function FavoritesScreen() {
  const favoritesCtx = useContext(FavoritesContext);
  const favoriteMeals = MEALS.filter((meal) => favoritesCtx.ids.includes(meal.id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>เมนูโปรด</Text>
      </View>

      <FlatList
        data={favoriteMeals}
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
            <Ionicons name="heart-outline" size={48} color={Colors.text300} />
            <Text style={styles.emptyText}>ยังไม่มีเมนูโปรด</Text>
            <Text style={styles.emptySubtext}>แตะไอคอนหัวใจในเมนูเพื่อเพิ่มรายการโปรด</Text>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text900,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: Colors.text900,
    fontWeight: '700',
    fontSize: 15,
    marginTop: 12,
  },
  emptySubtext: {
    color: Colors.text500,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
});
