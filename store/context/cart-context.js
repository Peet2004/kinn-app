import { createContext, useMemo, useReducer } from 'react';

export const CartContext = createContext({
  items: [],
  totalItems: 0,
  totalAmount: 0,
  addToCart: (meal, quantity) => {},
  removeItem: (id) => {},
  increaseQuantity: (id) => {},
  decreaseQuantity: (id) => {},
  clearCart: () => {},
});

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const { meal, quantity } = action.payload;
      const existingIndex = state.findIndex((item) => item.id === meal.id);
      if (existingIndex > -1) {
        const updated = [...state];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...state,
        {
          id: meal.id,
          title: meal.title,
          imageUrl: meal.imageUrl,
          price: meal.price,
          quantity,
        },
      ];
    }
    case 'REMOVE':
      return state.filter((item) => item.id !== action.payload.id);
    case 'INCREASE':
      return state.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    case 'DECREASE':
      return state
        .map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export default function CartContextProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const value = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    return {
      items,
      totalItems,
      totalAmount,
      addToCart: (meal, quantity = 1) => dispatch({ type: 'ADD', payload: { meal, quantity } }),
      removeItem: (id) => dispatch({ type: 'REMOVE', payload: { id } }),
      increaseQuantity: (id) => dispatch({ type: 'INCREASE', payload: { id } }),
      decreaseQuantity: (id) => dispatch({ type: 'DECREASE', payload: { id } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
