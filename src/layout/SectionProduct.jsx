import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { getWishlists } from "../redux/slices/wishlist";
import axios from "axios";
import { linkBackend } from "../constants/url";

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

const SectionProduct = (props) => {

    const { cateBrand } = props;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlists = useSelector(state => state.wishlist.data)
    const account = JSON.parse(localStorage.getItem('account_user')) || {}

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

    const handleRidirectToProduct = (product) => {
        localStorage.setItem("choose_product", JSON.stringify(product));
        navigate("/product")
    }

    return (
        <>
            {
                cateBrand.map(category => (
                    <section key={category.id} className="product-area li-laptop-product pt-60 pb-45">
                        <div className="container">
                            <div className="row">
                                {/* Begin Li's Section Area */}
                                <div className="col-lg-12">
                                    <div className="li-section-title">
                                        <h2>
                                            <span>{category.name}</span>
                                        </h2>
                                        <ul className="li-sub-category-list">
                                            {category.brands.map((brand) => (
                                                <li key={brand.id} className="active">
                                                    <a onClick={() => navigate("/category")}>{brand.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="row">
                                        <div className="product-active" style={{ display: "flex", }}>

                                            {category.products.sort(() => 0.5 - Math.random())
                                                .slice(0, 4).map(product => (
                                                    <div className="col-lg-12" style={{ maxWidth: 300 }}>
                                                        {/* single-product-wrap start */}
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
                                                                        src={product.defaultImage}
                                                                        alt="Li's Product Image"
                                                                    />
                                                                </a>
                                                                {isNewProduct(product.createdAt) && <span className="sticker">New</span>}
                                                            </div>
                                                            <div className="product_desc">
                                                                <div className="product_desc_info">
                                                                    <div className="product-review">
                                                                        <h5 className="manufacturer">
                                                                            <a href="shop-left-sidebar.html">{product.brand.name}</a>
                                                                        </h5>
                                                                        <div className="rating-box">
                                                                            <ul className="rating">
                                                                                {Array(parseInt(product.averageRating)).fill().map(() => (
                                                                                    <li>
                                                                                        <i className="fa fa-star-o" />
                                                                                    </li>
                                                                                ))}
                                                                                {Array(5 - parseInt(product.averageRating)).fill().map(() => (
                                                                                    <li className="no-star">
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
                                                                        {
                                                                            product.discountPercentage > 0 ?
                                                                                <>
                                                                                    <span class="new-price new-price-2">${(product.price * (100 - product.discountPercentage) / 100).toFixed(2)}</span>
                                                                                    <span class="old-price">${product.price}</span>
                                                                                    <span class="discount-percentage">-{product.discountPercentage}%</span>
                                                                                </>
                                                                                : <span className="new-price">${product.price}</span>
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className="add-actions">
                                                                    <ul className="add-actions-link">
                                                                        <li className="add-cart active">
                                                                            <a onClick={() => handleRidirectToProduct(product)}>Add to cart</a>
                                                                        </li>
                                                                        <li>
                                                                            <a className="links-details"
                                                                                onClick={() => handleChangeWishlist(product.id)}
                                                                            >
                                                                                <i className="fa fa-heart-o"
                                                                                    style={{
                                                                                        color: `${wishlists.some(item => item.product_id === product.id) ? 'red' : '#333'}`,
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                />
                                                                            </a>
                                                                        </li>
                                                                        <li>
                                                                            <a
                                                                                onClick={() => handleRidirectToProduct(product)}
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
                                                        {/* single-product-wrap end */}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Li's Section Area End Here */}
                            </div>
                        </div>
                    </section>
                ))
            }
        </>
    )
}

export default SectionProduct