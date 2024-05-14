import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { linkBackend } from "../../constants/url";

export const getBrands = createAsyncThunk('brand/getAll', async () => {
    try {
        const result = await axios.get(`${linkBackend}/brands`);
        return result.data.data;
    } catch (error) {
        return [];
    }
})

const categorySlice = createSlice({
    name: 'brand',
    initialState: {
        data: null,
    },
    reducers: {
        saveBrand(state, action) {
            state.data = action.payload
        },
    },
    extraReducers: (builer) => {
        builer
            .addCase(getBrands.fulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
});

export const { saveBrand } = categorySlice.actions;
export default categorySlice.reducer;