import { createContext, useEffect, useState, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';

export const AuthContext = createContext({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  profile: null,
  register: async (name, email, password, phone) => {},
  login: async (email, password) => {},
  logout: async () => {},
  updateUserProfile: async (data) => {},
});

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          setProfile(snap.exists() ? snap.data() : null);
        } catch (err) {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  async function register(name, email, password, phone) {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credentials.user, { displayName: name });

    const newProfile = {
      name,
      email,
      phone: phone || '',
      address: '',
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', credentials.user.uid), newProfile);
    setProfile(newProfile);
    return credentials.user;
  }

  async function login(email, password) {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return credentials.user;
  }

  async function logout() {
    await signOut(auth);
  }

  const updateUserProfile = useCallback(
    async (data) => {
      if (!user) return;
      await updateDoc(doc(db, 'users', user.uid), data);
      setProfile((current) => ({ ...current, ...data }));
      if (data.name) {
        await updateProfile(user, { displayName: data.name });
      }
    },
    [user]
  );

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    profile,
    register,
    login,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
