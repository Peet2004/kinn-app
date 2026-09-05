import 'react-native-gesture-handler';
import { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Colors from './constants/colors';

import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MealDetailScreen from './screens/MealDetailScreen';
import CartScreen from './screens/CartScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import OrderSuccessScreen from './screens/OrderSuccessScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import ProfileScreen from './screens/ProfileScreen';

import AuthContextProvider, { AuthContext } from './store/context/auth-context';
import CartContextProvider from './store/context/cart-context';
import FavoritesContextProvider from './store/context/favorite-context';
import OrderContextProvider from './store/context/order-context';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: Colors.primary600 },
  headerTintColor: Colors.white,
  headerShadowVisible: false,
  headerTitleStyle: { fontWeight: '700' },
};

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        ...screenOptions,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.primary600,
        tabBarInactiveTintColor: Colors.text300,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'หน้าหลัก',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <BottomTab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: false,
          title: 'รายการโปรด',
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={OrderHistoryScreen}
        options={{
          headerShown: false,
          title: 'ประวัติ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          title: 'โปรไฟล์',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Tabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={{ title: 'รายละเอียดเมนู' }}
      />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'ตะกร้าของฉัน' }} />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ title: 'ยืนยันการสั่งซื้อ' }}
      />
      <Stack.Screen
        name="OrderSummary"
        component={OrderSummaryScreen}
        options={{ title: 'สรุปคำสั่งซื้อ' }}
      />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

function Root() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary600} />
        <Text style={styles.loadingText}>Kinn</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <FavoritesContextProvider>
          <CartContextProvider>
            <OrderContextProvider>
              <AppNavigator />
            </OrderContextProvider>
          </CartContextProvider>
        </FavoritesContextProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary50,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary700,
  },
});
