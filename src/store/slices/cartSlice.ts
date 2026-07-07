import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
}

const initialState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const persist = (items: CartItem[]) =>
  localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (i: CartItem) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size,
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      persist(state.items);
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size?: string }>,
    ) => {
      state.items = state.items.filter(
        (i: CartItem) =>
          !(
            i.productId === action.payload.productId &&
            i.size === action.payload.size
          ),
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        size?: string;
        quantity: number;
      }>,
    ) => {
      const item = state.items.find(
        (i: CartItem) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size,
      );

      if (item) item.quantity += action.payload.quantity;
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
