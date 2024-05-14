import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { linkBackend } from "../../constants/url";

export const getCart = createAsyncThunk('carts/getAll', async (id) => {
    try {
        const result = await axios.get(`${linkBackend}/carts/${id}`);
        return result.data.data;
    } catch (error) {
        return [];
    }
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        data: null,
    },
    reducers: {
        saveCart(state, action) {
            state.data = action.payload
        },
    },
    extraReducers: (builer) => {
        builer
            .addCase(getCart.fulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
});

export const { saveCart } = cartSlice.actions;
export default cartSlice.reducer;