import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { linkBackend } from "../../constants/url";

export const getWishlists = createAsyncThunk('wishlist/getAll', async (id) => {
    try {
        const result = await axios.get(`${linkBackend}/accounts/get-wishlists-by-account/${id}`);
        return result.data.data;
    } catch (error) {
        return [];
    }
})

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        data: null,
    },
    reducers: {
        saveWishlist(state, action) {
            state.data = action.payload
        },
    },
    extraReducers: (builer) => {
        builer
            .addCase(getWishlists.fulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
});

export const { saveWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;