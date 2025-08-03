import React, { createContext, useReducer, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import MUI components for styling
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Create a default theme instance.
const theme = createTheme();

// Cart State Management (Context & Reducer)
const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.find(item => item.id === action.payload.id);
            if (existingItem) {
                return state.map(item =>
                    item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...state, { ...action.payload, quantity: 1 }];
        }
        case 'REMOVE_ITEM':
            return state.filter(item => item.id !== action.payload.id);
        case 'UPDATE_QUANTITY':
            return state.map(item =>
                item.id === action.payload.id ? { ...item, quantity: Math.max(0, action.payload.quantity) } : item
            ).filter(item => item.quantity > 0);
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [cart, dispatch] = useReducer(cartReducer, []);
    return (
        <CartContext.Provider value={{ cart, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <App />
        </CartProvider>
    </ThemeProvider>
  </React.StrictMode>,
)