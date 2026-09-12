import React, { createContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig'; // ปรับ path ตามโปรเจคของคุณ

export const MealsContext = createContext({
  meals: [],
  categories: [],
  loading: true,
  refreshData: () => {},
});

export const MealsContextProvider = ({ children }) => {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMealsData = async () => {
    try {
      setLoading(true);
      // ดึง Categories
      const catSnapshot = await getDocs(collection(db, 'categories'));
      const catList = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(catList);

      // ดึง Meals
      const mealSnapshot = await getDocs(collection(db, 'meals'));
      const mealList = mealSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMeals(mealList);
    } catch (error) {
      console.error("Error fetching global data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMealsData();
  }, []);

  return (
    <MealsContext.Provider value={{ meals, categories, loading, refreshData: fetchMealsData }}>
      {children}
    </MealsContext.Provider>
  );
};