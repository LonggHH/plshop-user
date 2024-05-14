import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { linkBackend } from "../../constants/url";

export const getCategories = createAsyncThunk('category/getAll', async () => {
    try {
        const result = await axios.get(`${linkBackend}/categories`);
        return result.data.data;
    } catch (error) {
        return [];
    }
})

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        data: null,
    },
    reducers: {
        saveCategory(state, action) {
            state.data = action.payload
        },
    },
    extraReducers: (builer) => {
        builer
            .addCase(getCategories.fulfilled, (state, action) => {
                state.data = action.payload;
            })
    }
});

export const { saveCategory } = categorySlice.actions;
export default categorySlice.reducer;