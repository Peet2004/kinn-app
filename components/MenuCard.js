import { useContext } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/colors';
import { FavoritesContext } from '../store/context/favorite-context';

export default function MenuCard({ id, title, imageUrl, price, duration }) {
  const navigation = useNavigation();
  const favoritesCtx = useContext(FavoritesContext);
  const isFavorite = favoritesCtx.ids.includes(id);

  function toggleFavorite() {
    if (isFavorite) {
      favoritesCtx.removeFavorite(id);
    } else {
      favoritesCtx.addFavorite(id);
    }
  }

  function openDetail() {
    navigation.navigate('MealDetail', { mealId: id });
  }

  return (
    <Pressable
      onPress={openDetail}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <Pressable onPress={toggleFavorite} hitSlop={8} style={styles.favButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorite ? Colors.danger : Colors.text700}
          />
        </Pressable>
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>฿{price}</Text>
          {!!duration && (
            <View style={styles.durationPill}>
              <Ionicons name="time-outline" size={12} color={Colors.primary600} />
              <Text style={styles.durationText}>{duration} น.</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    margin: 8,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
  },
  pressed: {
    opacity: 0.9,
  },
  image: {
    width: '100%',
    height: 110,
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.white,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text900,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary600,
  },
  durationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary50,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    fontSize: 10,
    color: Colors.primary600,
    marginLeft: 2,
    fontWeight: '600',
  },
});
