import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getProducts } from './redux/slices/product'
import { getCategories } from './redux/slices/category'
import { getBrands } from './redux/slices/brand'
import Layout from './layout/Layout'
import Home from './pages/Home'
import Category from './pages/Category'
import Product from './pages/Product'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Order from './pages/Order'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import Contact from './pages/Contact'
import './App.css'
import Forgot from './pages/Forgot'

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCategories());
        dispatch(getBrands());
        dispatch(getProducts());
    }, [])

    return (
        <Routes>
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='/category' element={<Category />} />
                <Route path='/product' element={<Product />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/order' element={<Order />} />
                <Route path='/account' element={<Account />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/contact' element={<Contact />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<Forgot />} />
            <Route path='*' element={<NotFound />} />
        </Routes>
    )
}

export default App
