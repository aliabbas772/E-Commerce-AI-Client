import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface GuestCartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

interface GuestCartState {
  items: GuestCartItem[];
}

const getStoredGuestCart = (): GuestCartItem[] => {
  const stored = localStorage.getItem("guestCart");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

const persist = (items: GuestCartItem[]) => {
  localStorage.setItem("guestCart", JSON.stringify(items));
};

const initialState: GuestCartState = {
  items: getStoredGuestCart(),
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    addGuestItem: (
      state,
      action: PayloadAction<Omit<GuestCartItem, "quantity">>,
    ) => {
      const existing = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.size === action.payload.size,
      );
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      persist(state.items);
    },
    removeGuestItem: (
      state,
      action: PayloadAction<{ productId: string; size: string }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.size === action.payload.size
          ),
      );
      persist(state.items);
    },
    increaseGuestQuantity: (
      state,
      action: PayloadAction<{ productId: string; size: string }>,
    ) => {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size,
      );
      if (item) item.quantity += 1;
      persist(state.items);
    },
    decreaseGuestQuantity: (
      state,
      action: PayloadAction<{ productId: string; size: string }>,
    ) => {
      const item = state.items.find(
        (i) =>
          i.productId === action.payload.productId &&
          i.size === action.payload.size,
      );
      if (item && item.quantity > 1) item.quantity -= 1;
      persist(state.items);
    },
    clearGuestCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const {
  addGuestItem,
  removeGuestItem,
  increaseGuestQuantity,
  decreaseGuestQuantity,
  clearGuestCart,
} = guestCartSlice.actions;
export default guestCartSlice.reducer;
