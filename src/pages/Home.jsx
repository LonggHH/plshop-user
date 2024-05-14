import Slide from "../layout/Slide"
import Banner from "../layout/Banner"
import Banner2 from "../layout/Banner2"
import HotProduct from "../layout/HotProduct"
import { useDispatch, useSelector } from "react-redux"
import SectionProduct from "../layout/SectionProduct"
import { useEffect } from "react"
import { getWishlists } from "../redux/slices/wishlist"

function isNewProduct(createAtString) {
    // Tính ngày hiện tại
    const today = new Date();

    // Tính ngày 10 ngày trước
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 10);

    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    const createAt = new Date(createAtString);

    // So sánh ngày tạo với ngày 10 ngày trước
    if (createAt >= tenDaysAgo) {
        return true; // Sản phẩm mới
    } else {
        return false; // Sản phẩm cũ
    }
}

function selectRandom4(rootArr) {
    if (rootArr.length < 4) {
        return rootArr;
    }

    const resultArr = [];

    while (resultArr.length < 4) {
        const index = Math.floor(Math.random() * rootArr.length);
        if (!resultArr.includes(rootArr[index])) {
            resultArr.push(rootArr[index]);
            rootArr.splice(index, 1)
        }
    }

    return resultArr;
}

const Home = () => {

    const dispatch = useDispatch();
    const account = JSON.parse(localStorage.getItem('account_user')) || {}
    const categories = useSelector(state => state.category.data) || [];
    const brands = useSelector(state => state.brand.data) || [];
    const products = useSelector(state => state.product.data) || [];

    const rootNewProducts = products.filter(p => isNewProduct(p.createdAt));
    const newProducts = selectRandom4(rootNewProducts)

    const brandProduct = brands.map(b => {
        const p = products.filter(p => p.brand.id === b.id)
        return {
            ...b,
            products: p
        }
    })

    // console.log("brandProdcut::", brandProduct);

    const cateBrand = categories.map(c => {
        const b = brandProduct.filter(b => b.category.id === c.id)
        let p = []
        for (let i = 0; i < b.length; i++) {
            p = [...p, ...b[i].products]
        }
        return {
            ...c,
            brands: b,
            products: p
        }
    })


    useEffect(() => {
        // console.log("goi dispath wishlist", account.id);
        dispatch(getWishlists(account.id))
    }, [])

    return (
        <>
            <Slide />

            <HotProduct newProducts={newProducts} />

            <Banner />

            <SectionProduct cateBrand={cateBrand} brandProduct={brandProduct} />

            <Banner2 />
        </>
    )
}

export default Home