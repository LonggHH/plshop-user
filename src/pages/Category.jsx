import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { linkBackend } from "../constants/url";
import { getWishlists } from "../redux/slices/wishlist";

function isNewProduct(createAtString) {
    // Tính ngày hiện tại
    const today = new Date();

    // Tính ngày 10 ngày trước
    const tenDaysAgo = new Date(today);
    tenDaysAgo.setDate(today.getDate() - 3);

    // Chuyển đổi chuỗi thời gian thành đối tượng Date
    const createAt = new Date(createAtString);

    // So sánh ngày tạo với ngày 10 ngày trước
    if (createAt >= tenDaysAgo) {
        return true; // Sản phẩm mới
    } else {
        return false; // Sản phẩm cũ
    }
}

const Category = () => {

    const categories = useSelector(state => state.category.data);
    const wishlists = useSelector(state => state.wishlist.data)
    const brands = useSelector(state => state.brand.data);
    const products = useSelector(state => state.product.data);

    function getCategoryByBrand(brand) {
        for (const category of categories) {
            if (category.brands.find(b => b.id === brand.id)) {
                return category;
            }
        }
        return null;
    }


    const navigate = useNavigate();
    const dispatch = useDispatch();
    const account = JSON.parse(localStorage.getItem('account_user')) || {};
    const [productReal, setProductReal] = useState([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPage, setTotalPage] = useState(1);
    const [selectCategory, setSelectCategory] = useState("");
    const [selectBrand, setSelectBrand] = useState([]);

    const [productShow, setProductShow] = useState([]);

    const handleClickPage = (i) => {
        setPage(i);
    }

    const handleChangePage = (status) => {
        switch (status) {
            case -1:
                if (page > 1) {
                    setPage(page - 1);
                }
                break;
            case 1:
                if (page < totalPage) {
                    setPage(page + 1);
                }
                break
        }
    }

    const handleChangeBrand = (brand) => {
        const newBrand = [...selectBrand]
        const index = selectBrand.indexOf(brand);
        if (index !== -1) {
            // Nếu brandName đã tồn tại trong mảng, loại bỏ nó
            newBrand.splice(index, 1);
        } else {
            // Nếu brandName chưa tồn tại trong mảng, thêm vào mảng
            newBrand.push(brand);
        }
        // console.log(newBrand);

        let newTotalItem = productReal
            .filter((product) => (product.category.name.includes(selectCategory)))
            .filter(product => {
                if (newBrand.length === 0) { return product }
                else {
                    return newBrand.some(brand => brand.includes(product.brand.name))
                }
            }).length

        const newTotalPage = Math.ceil(newTotalItem / pageSize);
        setPage(1);
        setTotalPage(newTotalPage)
        setSelectBrand(newBrand)

    }

    const handleClearSelect = () => {
        // setSelectCategory("");
        // setSelectBrand([]);
        window.location.reload();
    }

    const handleRidirectToProduct = (product) => {
        localStorage.setItem("choose_product", JSON.stringify(product));
        navigate("/product")
    }

    const handleChangeWishlist = async (productId) => {
        const data = { accountId: account?.id, productId }
        if (data.accountId) {
            try {
                const result = await axios.put(`${linkBackend}/accounts/change-wishlists`, { accountId: account.id, productId })
                dispatch(getWishlists(account.id))
            } catch (error) {
                console.log(error);
            }
        } else {
            navigate('/login')
        }
    }

    useEffect(() => {
        const updatedProducts = products.map(product => {
            const category = getCategoryByBrand(product.brand);
            return { ...product, category };
        });
        // console.log(updatedProducts);
        const newToltalPage = Math.ceil(updatedProducts.length / pageSize);

        // const newProdcutShow = updatedProducts
        //     .filter((product) => { return product.category.name.includes(selectCategory) })
        //     .filter((p) => (p.brand.name.includes(selectBrand)))
        //     .slice((page - 1) * pageSize, page * pageSize)
        // console.log(newProdcutShow);

        setProductReal(updatedProducts);
        setTotalPage(newToltalPage);
        // setProductShow(newProdcutShow);
    }, [])


    return (
        <>
            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li>
                                <a href="/">Home</a>
                            </li>
                            <li className="active">Category</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9 order-1 order-lg-2">
                            {/* Begin Li's Banner Area */}
                            <div className="single-banner shop-page-banner">
                                <a href="#">
                                    <img src="images/bg-banner/2.jpg" alt="Li's Static Banner" />
                                </a>
                            </div>
                            {/* Li's Banner Area End Here */}
                            {/* shop-top-bar start */}
                            <div className="shop-top-bar mt-30">
                                <div className="shop-bar-inner">
                                    <div className="product-view-mode">
                                        {/* shop-item-filter-list start */}
                                        <ul className="nav shop-item-filter-list" role="tablist">
                                            {/* <li role="presentation">
                                                <a
                                                    data-toggle="tab"
                                                    role="tab"
                                                    aria-controls="grid-view"
                                                    href="#grid-view"
                                                >
                                                    <i className="fa fa-th" />
                                                </a>
                                            </li> */}
                                            <li className="active" role="presentation">
                                                <a
                                                    aria-selected="true"
                                                    className="active show"
                                                    data-toggle="tab"
                                                    role="tab"
                                                    aria-controls="list-view"
                                                    href="#list-view"
                                                >
                                                    <i className="fa fa-th-list" />
                                                </a>
                                            </li>
                                        </ul>
                                        {/* shop-item-filter-list end */}
                                    </div>
                                    <div className="toolbar-amount">
                                        <span>Showing 1 to 9 of 15</span>
                                    </div>
                                </div>
                                {/* product-select-box start */}
                                <div className="product-select-box">
                                    <div className="product-short">
                                        <p>Sort By:</p>
                                        <select className="nice-select" defaultValue={"none"}>
                                            <option value="none" disabled>Choose</option>
                                            <option value="sales">Name (A - Z)</option>
                                            <option value="sale">Name (Z - A)</option>
                                            <option value="rating">Price (Low &gt; High)</option>
                                            <option value="date">Rating (Lowest)</option>
                                        </select>
                                    </div>
                                </div>
                                {/* product-select-box end */}
                            </div>
                            {/* shop-top-bar end */}
                            {/* shop-products-wrapper start */}
                            <div className="shop-products-wrapper">
                                <div className="tab-content">
                                    <div
                                        id="list-view"
                                        className="tab-pane fade product-list-view active show"
                                        role="tabpanel"
                                    >
                                        <div className="row">
                                            <div className="col">

                                                {
                                                    productReal
                                                        .filter((product) => (product.category.name.includes(selectCategory)))
                                                        .filter(product => {
                                                            if (selectBrand.length === 0) { return product }
                                                            else {
                                                                return selectBrand.some(brand => brand.includes(product.brand.name))
                                                            }
                                                        })
                                                        .slice((page - 1) * pageSize, page * pageSize)
                                                        .map(product => (
                                                            <div className="row product-layout-list" key={product.id}>
                                                                <div className="col-lg-3 col-md-5 ">
                                                                    <div className="product-image">
                                                                        <a style={{ display: "flex", alignItems: "center", width: 190, height: 200, overflow: "hidden" }}>
                                                                            <img
                                                                                src={product.defaultImage}
                                                                                alt="Li's Product Image"
                                                                            />
                                                                        </a>
                                                                        {isNewProduct(product.createdAt) && <span className="sticker">New</span>}

                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-5 col-md-7">
                                                                    <div className="product_desc">
                                                                        <div className="product_desc_info">
                                                                            <div className="product-review">
                                                                                <h5 className="manufacturer">
                                                                                    <a>{product.brand.name}</a>
                                                                                </h5>
                                                                                <div className="rating-box">
                                                                                    <ul className="rating">
                                                                                        {Array(parseInt(product.averageRating)).fill().map((_, i) => (
                                                                                            <li key={i}>
                                                                                                <i className="fa fa-star-o" />
                                                                                            </li>
                                                                                        ))}
                                                                                        {Array(5 - parseInt(product.averageRating)).fill().map((_, i) => (
                                                                                            <li key={i} className="no-star">
                                                                                                <i className="fa fa-star-o" />
                                                                                            </li>
                                                                                        ))}
                                                                                    </ul>
                                                                                </div>
                                                                            </div>
                                                                            <h4>
                                                                                <a className="product_name" onClick={() => handleRidirectToProduct(product)}>
                                                                                    {product.name}
                                                                                </a>
                                                                            </h4>
                                                                            <div className="price-box">
                                                                                <span className="new-price">${product.price}</span>
                                                                            </div>
                                                                            <p>
                                                                                {product.description.substring(0, 120) + `${product.description.length > 30 ? "..." : ""}`}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-4">
                                                                    <div className="shop-add-action mb-xs-30">
                                                                        <ul className="add-actions-link">
                                                                            <li className="add-cart">
                                                                                <a href="#">Add to cart</a>
                                                                            </li>
                                                                            <li className="wishlist">
                                                                                <a onClick={() => handleChangeWishlist(product.id)}>
                                                                                    <i className="fa fa-heart-o"
                                                                                        style={{
                                                                                            color: `${wishlists.some(item => item.product_id === product.id) ? 'red' : '#333'}`,
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                    />
                                                                                    Add to wishlist
                                                                                </a>
                                                                            </li>
                                                                            <li>
                                                                                <a
                                                                                    className="quick-view"
                                                                                    data-toggle="modal"
                                                                                    data-target="#exampleModalCenter"
                                                                                    onClick={() => handleRidirectToProduct(product)}
                                                                                >
                                                                                    <i className="fa fa-eye" />
                                                                                    Quick view
                                                                                </a>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="paginatoin-area">
                                        <div className="row">
                                            <div className="col-lg-6 col-md-6">
                                                <p>Showing 1-12 of 13 item(s)</p>
                                            </div>
                                            <div className="col-lg-6 col-md-6">
                                                <ul className="pagination-box">
                                                    <li onClick={() => handleChangePage(-1)}>
                                                        <a className="Previous" style={{ cursor: "pointer" }}>
                                                            <i className="fa fa-chevron-left" /> Previous
                                                        </a>
                                                    </li>
                                                    {Array(totalPage).fill().map((_, index) => (
                                                        <li key={index} onClick={() => handleClickPage(index + 1)}>
                                                            <a
                                                                style={{ color: `${page === index + 1 ? "red" : "black"}`, cursor: "pointer" }}
                                                            >{index + 1}</a>
                                                        </li>
                                                    ))}
                                                    <li onClick={() => handleChangePage(1)}>
                                                        <a className="Next" style={{ cursor: "pointer" }}>
                                                            {" "}
                                                            Next <i className="fa fa-chevron-right" />
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* shop-products-wrapper end */}
                        </div>
                        <div className="col-lg-3 order-2 order-lg-1">

                            <div className="sidebar-categores-box">
                                <div className="sidebar-title">
                                    <h2>Filter By</h2>
                                </div>

                                <button className="btn-clear-all mb-sm-30 mb-xs-30" onClick={() => handleClearSelect()}>Clear all</button>

                                <div className="filter-sub-area pt-sm-10 pt-xs-10">
                                    <h5 className="filter-sub-titel">Categories</h5>
                                    <div className="categori-checkbox">
                                        <form action="#">
                                            <ul>
                                                {categories.map(cate => (
                                                    <li key={cate.id} onClick={() => setSelectCategory(cate.name)}>
                                                        <input type="radio" name="category" />
                                                        <a>{cate.name}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </form>
                                    </div>
                                </div>

                                <div className="filter-sub-area">
                                    <h5 className="filter-sub-titel">Brand</h5>
                                    <div className="categori-checkbox">
                                        <form>
                                            <ul>
                                                {brands.filter(brand => brand.category.name.includes(selectCategory)).map(brand => (
                                                    <li key={brand.id} onChange={() => handleChangeBrand(brand.name)}>
                                                        <input type="checkbox" name="product-categori" />
                                                        <a>{brand.name}</a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Category