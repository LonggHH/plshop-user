import { useNavigate } from "react-router-dom"
import axios from "axios";
import { linkBackend } from "../constants/url"
import { useDispatch, useSelector } from "react-redux";
import { getWishlists } from "../redux/slices/wishlist";

const HotProduct = (props) => {

    const { newProducts } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const account = JSON.parse(localStorage.getItem('account_user')) || {};
    const wishlists = useSelector(state => state.wishlist.data)

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

    return (
        <div className="product-area pt-60 pb-50">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="li-product-tab">
                            <ul className="nav li-product-menu">
                                <li>
                                    <a className="active" data-toggle="tab" href="#">
                                        <span>New</span>
                                    </a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#li-bestseller-product">
                                        <span>Bestseller</span>
                                    </a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#li-featured-product">
                                        <span>Hot</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* Begin Li's Tab Menu Content Area */}
                    </div>
                </div>
                <div className="tab-content">
                    <div id="li-new-product" className="tab-pane active show" role="tabpanel">
                        <div className="row">
                            <div className="product-active" style={{ display: "flex", maxWidth: 1200 }}>
                                {/* start */}
                                {newProducts && newProducts.map((p) => (
                                    <div className="col-lg-12" style={{ maxWidth: 300 }}>
                                        <div className="single-product-wrap">
                                            <div className="product-image">
                                                <a
                                                    style={{
                                                        display: "flex", justifyContent: "center",
                                                        alignItems: 'center', height: 270, overflow: "hidden", width: 270
                                                    }}
                                                >
                                                    <img
                                                        style={{ width: 200 }}
                                                        src={p.defaultImage}
                                                        alt="Li's Product Image"
                                                    />
                                                </a>
                                                <span className="sticker">New</span>
                                            </div>
                                            <div className="product_desc">
                                                <div className="product_desc_info">
                                                    <div className="product-review">
                                                        <h5 className="manufacturer">
                                                            <a>{p.brand.name}</a>
                                                        </h5>
                                                        <div className="rating-box">
                                                            <ul className="rating">
                                                                {
                                                                    Array(parseInt(p.averageRating)).fill().map((s, index) => (
                                                                        <li>
                                                                            <i className="fa fa-star-o" />
                                                                        </li>
                                                                    ))
                                                                }
                                                                {
                                                                    Array(5 - parseInt(p.averageRating)).fill().map((s, index) => (
                                                                        <li className="no-star">
                                                                            <i className="fa fa-star-o" />
                                                                        </li>
                                                                    ))
                                                                }
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <h4>
                                                        <a className="product_name" onClick={() => handleRidirectToProduct(p)}>
                                                            {p.name}
                                                        </a>
                                                    </h4>
                                                    <div className="price-box">
                                                        {
                                                            p.discountPercentage > 0 ?
                                                                <>
                                                                    <span class="new-price new-price-2">${(p.price * (100 - p.discountPercentage) / 100).toFixed(2)}</span>
                                                                    <span class="old-price">${p.price}</span>
                                                                    <span class="discount-percentage">-{p.discountPercentage}%</span>
                                                                </>
                                                                : <span className="new-price">${p.price}</span>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="add-actions">
                                                    <ul className="add-actions-link">
                                                        <li className="add-cart active">
                                                            <a onClick={() => handleRidirectToProduct(p)}>Add to cart</a>
                                                        </li>
                                                        <li>
                                                            <a className="links-details"
                                                                onClick={() => handleChangeWishlist(p.id)}
                                                            >
                                                                <i className="fa fa-heart-o"
                                                                    style={{
                                                                        color: `${wishlists.some(item => item.product_id === p.id) ? 'red' : '#333'}`,
                                                                        cursor: "pointer"
                                                                    }}
                                                                />
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a
                                                                onClick={() => handleRidirectToProduct(p)}
                                                                title="quick view"
                                                                className="quick-view-btn"
                                                                data-toggle="modal"
                                                                data-target="#exampleModalCenter"
                                                            >
                                                                <i className="fa fa-eye" />
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* end */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HotProduct