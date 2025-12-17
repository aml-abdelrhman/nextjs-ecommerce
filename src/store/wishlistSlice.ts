import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface WishlistItemUI {
  id: string;
  title: string;
  price?: number;
  image?: string;
}

interface WishlistState {
  items: WishlistItemUI[];
  count: number;
}

const initialState: WishlistState = {
  items: [],
  count: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItemLocal: (state, action: PayloadAction<WishlistItemUI>) => {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (!exists) state.items.push(action.payload);
      state.count = state.items.length;
    },
    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.count = state.items.length;
    },
    clearWishlistUI: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { addItemLocal, removeItemLocal, clearWishlistUI } = wishlistSlice.actions;
export default wishlistSlice.reducer;
