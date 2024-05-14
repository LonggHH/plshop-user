import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { linkBackend } from "../../constants/url";

export const getProducts = createAsyncThunk('product/getAll', async () => {
    try {
        const result = await axios.get(`${linkBackend}/products`);
        return result.data.data.filter(product => product.active === true);
    } catch (error) {
        return [];
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        data: null,
    },
    reducers: {
        saveProduct(state, action) {
            state.data = action.payload
        },
    },
    extraReducers: (builer) => {
        builer
            .addCase(getProducts.fulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
});

export const { saveProduct } = productSlice.actions;
export default productSlice.reducer;