import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart";


interface CartState {
  items: CartItem[];
  count: number;
}

const initialState: CartState = {
  items: [],
  count: 0,
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increaseQtyLocal: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.qty++;
      state.count = state.items.length;
    },
    decreaseQtyLocal: (state, action: PayloadAction<string>) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.qty > 1) item.qty--;
      state.count = state.items.length;
    },
    addItemLocal: (state, action: PayloadAction<CartItem>) => {
      const exists = state.items.find(i => i.id === action.payload.id);
      if (exists) exists.qty += action.payload.qty;
      else state.items.push(action.payload);
      state.count = state.items.length;
    },
    removeItemLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.count = state.items.length;
    },
    clearCartUI: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { increaseQtyLocal, decreaseQtyLocal, addItemLocal, removeItemLocal, clearCartUI } = cartSlice.actions;
export default cartSlice.reducer;
