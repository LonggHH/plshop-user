import { combineReducers } from '@reduxjs/toolkit'
import authSlice from './auth.js'
import categorySlice from './category.js'
import brandSlice from './brand.js'
import productSlice from './product.js'
import cartSlice from './cart.js'
import wishlistSlice from './wishlist.js'

export const rootReducer = combineReducers({
    auth: authSlice,
    category: categorySlice,
    brand: brandSlice,
    product: productSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
})