import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AuthContext } from './auth-context';

export const FavoritesContext = createContext({
  ids: [],
  addFavorite: (id) => {},
  removeFavorite: (id) => {},
});

export default function FavoritesContextProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Load this user's favorites from the cloud database once they sign in.
  useEffect(() => {
    let isActive = true;
    async function loadFavorites() {
      if (!user) {
        setFavoriteIds([]);
        return;
      }
      try {
        const snap = await getDoc(doc(db, 'favorites', user.uid));
        if (isActive) {
          setFavoriteIds(snap.exists() ? snap.data().ids || [] : []);
        }
      } catch (err) {
        // ignore — favorites simply stay in memory for this session
      }
    }
    loadFavorites();
    return () => {
      isActive = false;
    };
  }, [user]);

  const persist = useCallback(
    (ids) => {
      if (!user) return;
      setDoc(doc(db, 'favorites', user.uid), { ids }).catch(() => {});
    },
    [user]
  );

  function addFavorite(id) {
    setFavoriteIds((current) => {
      const next = [...current, id];
      persist(next);
      return next;
    });
  }

  function removeFavorite(id) {
    setFavoriteIds((current) => {
      const next = current.filter((mealId) => mealId !== id);
      persist(next);
      return next;
    });
  }

  const value = {
    ids: favoriteIds,
    addFavorite,
    removeFavorite,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}
