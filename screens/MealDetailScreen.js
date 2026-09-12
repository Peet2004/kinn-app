import { useContext, useLayoutEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { meals } from '../data/meal-data';
import Subtitle from '../components/MealDetail/Subtitle';
import List from '../components/MealDetail/List';
import { FavoritesContext } from '../store/context/favorite-context';
import { CartContext } from '../store/context/cart-context';
import { MealsContext } from '../store/context/meal-context';
import PrimaryButton from '../components/UI/PrimaryButton';

export default function MealDetailScreen({ route, navigation }) {
    const { meals, categories, loading, refreshData } = useContext(MealsContext);
  
  const favoritesCtx = useContext(FavoritesContext);
  const cartCtx = useContext(CartContext);
  const mealId = route.params.mealId;
  const selectedMeal = meals.find((meal) => meal.id === mealId);
  const isFavorite = favoritesCtx.ids.includes(mealId);
  const [quantity, setQuantity] = useState(1);

  function toggleFavorite() {
    if (isFavorite) {
      favoritesCtx.removeFavorite(mealId);
    } else {
      favoritesCtx.addFavorite(mealId);
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerRight: () => (
        <Pressable onPress={toggleFavorite} hitSlop={8}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? Colors.danger : Colors.white}
          />
        </Pressable>
      ),
    });
  }, [navigation, isFavorite]);

  function addToCartHandler() {
    cartCtx.addToCart(selectedMeal, quantity);
    navigation.navigate('Cart');
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <Image source={{ uri: selectedMeal.imageUrl }} style={styles.image} />

        <View style={styles.body}>
          <Text style={styles.title}>{selectedMeal.title}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={14} color={Colors.primary600} />
              <Text style={styles.metaText}>{selectedMeal.duration} นาที</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="stats-chart-outline" size={14} color={Colors.primary600} />
              <Text style={styles.metaText}>{selectedMeal.complexity}</Text>
            </View>
            <Text style={styles.price}>฿{selectedMeal.price}</Text>
          </View>

          <View style={styles.card}>
            <Subtitle>ส่วนประกอบ</Subtitle>
            <List data={selectedMeal.ingredients} />
          </View>

        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityControl}>
          <Pressable
            onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            style={styles.qtyButton}
          >
            <Ionicons name="remove" size={18} color={Colors.primary600} />
          </Pressable>
          <Text style={styles.qtyText}>{quantity}</Text>
          <Pressable onPress={() => setQuantity((q) => q + 1)} style={styles.qtyButton}>
            <Ionicons name="add" size={18} color={Colors.primary600} />
          </Pressable>
        </View>
        <PrimaryButton onPress={addToCartHandler} style={{ flex: 1, marginLeft: 12 }}>
          ใส่ตะกร้า · ฿{selectedMeal.price * quantity}
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
  image: {
    width: '100%',
    height: 260,
  },
  body: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text900,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary50,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.primary700,
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  price: {
    marginLeft: 'auto',
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary600,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 1,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary50,
    borderRadius: 12,
    paddingHorizontal: 6,
  },
  qtyButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text900,
    marginHorizontal: 8,
    minWidth: 18,
    textAlign: 'center',
  },
});
