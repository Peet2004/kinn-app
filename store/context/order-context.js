import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { AuthContext } from './auth-context';

export const OrderContext = createContext({
  orders: [],
  isLoading: false,
  placeOrder: async (orderData) => '',
  refreshOrders: async () => {},
});

export default function OrderContextProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setIsLoading(true);
    try {
      const ordersRef = collection(db, 'users', user.uid, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(
        snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }))
      );
    } catch (err) {
      // Keep whatever we already have in memory if the fetch fails
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  async function placeOrder(orderData) {
    if (!user) throw new Error('ต้องเข้าสู่ระบบก่อนสั่งซื้อ');

    const ordersRef = collection(db, 'users', user.uid, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    setOrders((current) => [
      { id: docRef.id, ...orderData, status: 'pending', createdAt: new Date() },
      ...current,
    ]);

    return docRef.id;
  }

  const value = { orders, isLoading, placeOrder, refreshOrders };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
