import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"
import { getCart, saveCart } from '../redux/slices/cart';
import { useLocation } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userLogin = JSON.parse(localStorage.getItem("account_user")) || {}
    const cart = useSelector(state => state.cart.data)
    const categories = useSelector(state => state.category.data) || [];
    const wishlists = useSelector(state => state.wishlist.data) || [];
    const products = useSelector(state => state.product.data) || [];

    const [selectCategory, setSelectCategory] = useState('');
    const [keyword, setKeyword] = useState("");
    const [searchproducts, setSearchproducts] = useState([]);
    const [show, setShow] = useState(false);

    const handleLogout = () => {
        dispatch(saveCart(null))
        localStorage.removeItem("account_user")
        navigate("/")
    }

    const handleRidirectToProduct = (product) => {
        const currentPath = location.pathname;
        localStorage.setItem("choose_product", JSON.stringify(product));
        setSearchproducts([])
        setShow(false)
        setKeyword()
        if (currentPath !== "/product") {
            navigate("/product")
        } else {
            navigate("/product")
            window.location.reload()
        }
    }

    useEffect(() => {
        if (userLogin.id) {
            dispatch(getCart(userLogin.id))
        }
    }, [])

    useEffect(() => {

        const timer = setTimeout(() => {

            if (keyword) {
                let productFilter = products.filter(product => product.name.toLowerCase().includes(keyword.toLowerCase().trim()));
                if (productFilter.length < 8) {
                    productFilter = productFilter.concat(products.slice(0, 8 - productFilter.length));
                } else {
                    productFilter = productFilter.slice(0, 8)
                }
                setSearchproducts(productFilter)
                setShow(true)
            } else {
                setShow(false)
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [keyword])

    return (
        <header>
            <div className="header-middle pl-sm-0 pr-sm-0 pl-xs-0 pr-xs-0">
                <div className="container">
                    <div className="row">

                        <div className="col-lg-3">
                            <div className="logo pb-sm-30 pb-xs-30" onClick={() => navigate("/")}>
                                <a>
                                    <img src="images/menu/logo/1.jpg" alt="" />
                                </a>
                            </div>
                        </div>

                        <div className="col-lg-9 pl-0 ml-sm-15 ml-xs-15">
                            <form className="hm-searchbox" style={{ minWidth: "500px !important", position: "relative" }}>
                                <select className="nice-select select-search-category">
                                    <option value={""}>All</option>
                                    {/* {categories.map((c) => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))} */}
                                </select>

                                <input
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    type="text"
                                    placeholder="Enter your search key ..."
                                />

                                <button
                                    className="li-btn" type="submit"
                                >
                                    <i className="fa fa-search" />
                                </button>

                                {show &&
                                    <div className='dra-scope-search'>
                                        {searchproducts.map((p, i) => (
                                            <div key={i} className='dra-scope-search-item'>
                                                <div className='dra-search-item-image'>
                                                    <img width={50} height={50} src={p.defaultImage} alt="" />
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexGrow: 1 }}>
                                                    <div>
                                                        <div style={{ textAlign: "start" }}>
                                                            <span className='dra-product-name' style={{ cursor: "pointer" }}
                                                                onClick={() => handleRidirectToProduct(p)}
                                                            >
                                                                {p.name.length > 20 ? `${p.name.substring(0, 20)}...` : p.name}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            {Array(parseInt(p.averageRating)).fill().map(() => (
                                                                <li style={{ color: "#fed700" }}>
                                                                    <i className="fa fa-star-o" />
                                                                </li>
                                                            ))}
                                                            {Array(5 - parseInt(p.averageRating)).fill().map(() => (
                                                                <li className="no-star">
                                                                    <i className="fa fa-star-o" />
                                                                </li>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>${p.price}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                            </form>

                            <div className="header-middle-right">
                                <ul className="hm-menu">

                                    <li className="hm-wishlist" style={{ cursor: "pointer" }} onClick={() => navigate('/wishlist')}>
                                        <a>
                                            <span className="cart-item-count wishlist-item-count">{wishlists?.length || 0}</span>
                                            <i className="fa fa-heart-o" />
                                        </a>
                                    </li>

                                    <li className="hm-minicart" onClick={() => navigate("/cart")}>
                                        <div className="hm-minicart-trigger">
                                            <span className="item-icon" />
                                            <span className="item-text">
                                                Cart
                                                <span className="cart-item-count">{cart ? cart?.length : 0}</span>
                                            </span>
                                        </div>
                                    </li>

                                    <li style={{ marginTop: 10 }}>
                                        <span style={{ border: "1px solid pink", padding: "5px 10px", cursor: "pointer" }}>
                                            {
                                                userLogin?.name ?
                                                    <span className='dra-menu' >
                                                        {userLogin?.imagePath && <img width={24} height={24} src={userLogin.imagePath} alt="" />}
                                                        <span style={{ marginLeft: 4 }}>{userLogin.name}</span>
                                                        <span style={{
                                                            margin: "0 10px",
                                                            borderRadius: 4,
                                                            backgroundColor: "#e80f0f",
                                                            padding: "3px 5px",
                                                            color: "white"
                                                        }}
                                                            onClick={handleLogout}
                                                        >
                                                            Logout
                                                        </span>
                                                        <ul className='dra-menu-ul' >
                                                            <li className='dra-menu-li' onClick={() => navigate('/account')}>Account</li>
                                                            <li className='dra-menu-li' onClick={() => navigate('/order')}>Order</li>
                                                        </ul>
                                                    </span>
                                                    :
                                                    <span onClick={() => navigate("/login")}>Login / Register</span>
                                            }
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="header-bottom header-sticky d-none d-lg-block d-xl-block">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">

                            <div className="hb-menu">
                                <nav>
                                    <ul>
                                        <li className="megamenu-holder">
                                            <a href="#">Category</a>

                                            <ul className="megamenu hb-megamenu">
                                                {categories.map((c) => (
                                                    <li key={c.id}>
                                                        <a href="#">{c.name}</a>
                                                        <ul>
                                                            {c.brands.map((b) => (
                                                                <li key={b.id}>
                                                                    <img width={50} src={b.logo} alt="logo" />
                                                                    <a onClick={() => navigate("/category")} style={{ display: "inline-block", marginLeft: 8 }}>{b.name}</a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        <li className="megamenu-static-holder">
                                            <a href="index.html">Pages</a>
                                            <ul className="megamenu hb-megamenu">
                                                <li>
                                                    <a href="#">Pages</a>
                                                    <ul>
                                                        <li>
                                                            <a href="#">Home</a>
                                                        </li>
                                                        <li>
                                                            <a href="#">Category</a>
                                                        </li>
                                                        <li>
                                                            <a href="#">Cart</a>
                                                        </li>
                                                        <li>
                                                            <a href="#">Order</a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>

                                        <li>
                                            <a style={{ cursor: "pointer" }} onClick={() => navigate('/contact')}>Contact</a>
                                        </li>

                                    </ul>
                                </nav>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            <div className="mobile-menu-area d-lg-none d-xl-none col-12">
                <div className="container" >
                    <div className="row">
                        <div className="mobile-menu"></div>
                    </div>
                </div>
            </div>

        </header>
    )
}

export default Header