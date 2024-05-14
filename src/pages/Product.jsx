import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { linkBackend } from '../constants/url';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"
import { getCart } from '../redux/slices/cart';
import moment from 'moment';

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

const defaultErr = { open: false, message: "", color: "red" }

const Product = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const product = JSON.parse(localStorage.getItem("choose_product")) || {};
    const account = JSON.parse(localStorage.getItem("account_user")) || {};
    const [productReal, setProductReal] = useState(product);
    const [imageMain, setImageMain] = useState(product.defaultImage)
    const [tabSelect, setTabSelect] = useState('specifications');
    const [variationSelect, setVariationSelect] = useState({});
    const [err, setErr] = useState({ open: false, message: "", color: "red" });
    const [errReview, setErrReview] = useState(defaultErr);
    const [accountRating, setAccountRating] = useState(5)
    const [reviews, setReviews] = useState([])

    const [quantity, setQuantity] = useState(1);
    const [recommends, setRecommends] = useState([])
    const [modalControl, setModalControl] = useState({ open: false, data: null })

    const handleRidirectToProduct = (product) => {
        localStorage.setItem("choose_product", JSON.stringify(product));
        window.location.reload()
        // navigate("/product")
    }

    const handleChangeQuantity = (status) => {
        switch (status) {
            case -1:
                if (quantity > 1) {
                    setQuantity(quantity - 1);
                }
                break;
            case 1:
                if (quantity < 3) {
                    setQuantity(quantity + 1);
                }
                break;
        }
    }

    const getProduct = async () => {
        const result = await axios.get(`${linkBackend}/products/${product.id}`)
        setProductReal(result.data.data);
        setVariationSelect(result.data.data.variations[0]);
    }

    const handleClickAddToCart = async () => {

        const user = JSON.parse(localStorage.getItem("account_user")) || {};

        if (!user?.id) {
            navigate("/login")
            return
        }

        if (quantity > product.stock) {
            setErr({ open: true, message: "The number is not sufficient" })
            setTimeout(() => {
                setErr({ open: false, message: "" })
            }, 2000)
            return
        }

        const data = {
            account_id: user.id,
            variation_id: variationSelect.id,
            quantity
        }

        try {
            const result = await axios.post(`${linkBackend}/carts/create`, data);
            if (result.data.statusCode === 201) {

                dispatch(getCart(account.id));

                setErr({ open: true, message: "Has added the product to the cart", color: "green" })
                setTimeout(() => {
                    setErr({ open: false, message: "", color: "red" })
                }, 2000)
            }
        } catch (error) {
            setErr({ open: true, message: error.response.data.message, color: "red" })
            setTimeout(() => {
                setErr({ open: false, message: "", color: "red" })
            }, 2000)
            return
        }
    }

    const getRecommendProduct = async () => {
        try {
            const result = await axios.get(`http://localhost:3006/recommend/${product.id}`)
            const data = result.data.data
            if (data.length > 0) {
                const productRecommend = []
                for (let i = 0; i < data.length; i++) {
                    const resultDetail = await axios.get(`${linkBackend}/products/${data[i].id}`)
                    productRecommend.push(resultDetail.data.data)
                }
                setRecommends(productRecommend)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getAccountRating = async () => {
        try {
            const result = await axios.get(`${linkBackend}/evaluations/account/${account.id}`)
            if (result.data.statusCode === 200) {
                const data = result.data.data;
                const ratingFind = data.find(item => item.product.id == product.id)
                if (!ratingFind) {
                    setAccountRating(5)
                } else {
                    setAccountRating(ratingFind.star)
                }
            }
        } catch (error) {
            console.log(err);
        }
    }

    const getReviews = async () => {
        try {
            const result = await axios.get(`${linkBackend}/evaluations/reviews/${product.id}`)
            if (result.data.statusCode === 200) {
                setReviews(result.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }
        const data = { star: parseInt(values.star), content: values.content, productId: product.id, accountId: account.id }

        if (data.content === "") {
            setErrReview({ open: true, message: "Review is not empty", color: "red" })
            setTimeout(() => {
                setErrReview(defaultErr)
            }, [2000])
            return
        }

        try {
            const result = await axios.post(`${linkBackend}/evaluations/create`, data)
            if (result.data.statusCode === 201) {
                console.log("thanh cong", result.data);
                setErrReview({ open: true, message: "Reviews success", color: "green" })
                setTimeout(() => {
                    setErrReview(defaultErr)
                }, [2000])
                setModalControl({ open: false, data: null })
                window.location.reload()
            }
        } catch (error) {
            setErrReview({ open: true, message: "Reviews error", color: "red" })
            setTimeout(() => {
                setErrReview(defaultErr)
            }, [2000])
        }
    }

    useEffect(() => {
        getProduct()
        getRecommendProduct()
        getAccountRating()
        getReviews()
    }, [])

    return (
        <>
            <div className="breadcrumb-area">

                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li>
                                <a style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</a>
                            </li>
                            <li className="active">Product</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper">
                <div className="container">
                    <div className="row single-product-area">
                        <div className="col-lg-5 col-md-6">
                            {/* Product Details Left */}

                            <div classname="product-details-images slider-navigation-1">
                                <div classname="lg-image" style={{ marginBottom: 12 }}>
                                    <img width={450} src={imageMain} alt="product image" />
                                </div>
                                <div style={{ display: "flex", gap: 12, width: 'fit-content' }}>
                                    <div style={{ display: 'inline-block' }} onClick={() => setImageMain(product.defaultImage)} >
                                        <img width={100} src={product.defaultImage} alt="product image" />
                                    </div>
                                    {productReal.images.map((image) => (
                                        <div key={image.id} style={{ display: 'inline-block' }} onClick={() => setImageMain(image.image_path)} >
                                            <img width={100} src={image.image_path} alt="product image" />
                                        </div>
                                    ))}
                                </div>

                            </div>
                            {/*// Product Details Left */}
                        </div>
                        <div className="col-lg-7 col-md-6">
                            <div className="product-details-view-content sp-normal-content pt-60">
                                <div className="product-info">
                                    <h2>{product.name}</h2>
                                    {/* <span className="product-details-ref">Reference: demo_15</span> */}
                                    <div className="rating-box pt-20">
                                        <ul className="rating rating-with-review-item">
                                            {Array(parseInt(productReal.averageRating)).fill().map((_, i) => (
                                                <li key={i}>
                                                    <i className="fa fa-star-o" />
                                                </li>
                                            ))}
                                            {Array(5 - parseInt(productReal.averageRating)).fill().map((_, i) => (
                                                <li key={i} className="no-star">
                                                    <i className="fa fa-star-o" />
                                                </li>
                                            ))}

                                            <span style={{ marginLeft: 12 }}>{reviews.length} reviews</span>
                                        </ul>
                                        <div style={{ paddingTop: "10px", display: "flex" }}>
                                            {
                                                productReal?.variations.map((variation => (
                                                    <div
                                                        key={variation.id}
                                                        style={{
                                                            margin: "5px 10px 5px 0",
                                                            border: `1px solid ${variationSelect.id === variation.id ? "red" : "black"}`,
                                                            padding: "5px 10px",
                                                            display: 'flex',
                                                            gap: 12,
                                                            alignItems: 'center',
                                                            width: 'fit-content',
                                                            cursor: 'pointer'
                                                        }}
                                                        onClick={() => {
                                                            setVariationSelect(variation)
                                                            setImageMain(variation.image)
                                                            setQuantity(1)
                                                        }}
                                                    >
                                                        <img width={30} src={variation.image} alt="img" />
                                                        <span style={{ borderRadius: 4, padding: 4, backgroundColor: `${variation.color}`, color: "white" }}>{variation.color}</span>
                                                        <span>${variation.price}</span>
                                                        <span>{variation.stock !== 0 ? variation.stock : `Sold out`}</span>
                                                    </div>
                                                )))
                                            }
                                        </div>
                                    </div>
                                    <div className="price-box pt-20">
                                        <span>Sale: </span>
                                        <span className="new-price new-price-2">{productReal.discountPercentage}%</span>
                                        <span className="new-price new-price-2" style={{ color: "green", marginLeft: 24 }}>${(productReal.price * (100 - productReal.discountPercentage) / 100).toFixed(2)}</span>
                                    </div>
                                    <div className="product-desc">
                                        <p>
                                            <span>
                                                {productReal.description}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="single-add-to-cart">
                                        <form className="cart-quantity">
                                            <div className="quantity">
                                                <label>Quantity</label>
                                                <div className="cart-plus-minus">
                                                    <input
                                                        className="cart-plus-minus-box"
                                                        defaultValue={1}
                                                        type="text"
                                                        value={quantity}
                                                        readOnly
                                                        onChange={() => { }}
                                                    />
                                                    <div className="dec qtybutton" onClick={() => handleChangeQuantity(-1)}>
                                                        <i className="fa fa-angle-down" />
                                                    </div>
                                                    <div className="inc qtybutton" onClick={() => handleChangeQuantity(1)}>
                                                        <i className="fa fa-angle-up" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="add-to-cart" type='button'
                                                onClick={() => handleClickAddToCart()}
                                            >
                                                Add to cart
                                            </button>
                                            {err.open && <p style={{ color: `${err.color}` }}>{err.message}</p>}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <div className="product-area pt-40">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-product-tab">
                                <ul className="nav li-product-menu">
                                    <li onClick={() => setTabSelect('specifications')}>
                                        <a data-toggle="tab">
                                            <span>Specifications</span>
                                        </a>
                                    </li>
                                    <li onClick={() => setTabSelect('reviews')}>
                                        <a data-toggle="tab">
                                            <span>Reviews</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* Begin Li's Tab Menu Content Area */}
                        </div>
                    </div>
                    <div className="tab-content">
                        {
                            tabSelect === "specifications" ?
                                <div id="description" className="tab-pane active show" role="tabpanel">
                                    <div className="product-description">
                                        <span>
                                            <pre style={{ whiteSpace: "pre-line" }}>
                                                {product[tabSelect]}
                                            </pre>
                                        </span>
                                    </div>
                                </div> :
                                <div id="reviews" className="tab-pane active show" >
                                    <div className="product-reviews">
                                        <div className="product-details-comment-block">
                                            <div className="review-btn" style={{ marginBottom: 12 }}>
                                                <a
                                                    className="review-links"
                                                    style={{ color: "white", cursor: "pointer" }}
                                                    onClick={() => setModalControl(pre => ({ ...pre, open: true }))}
                                                >
                                                    Write Your Review!
                                                </a>
                                            </div>

                                            <div className='dra-scope-review' style={{ maxHeight: 500, overflowY: "scroll" }}>
                                                {reviews.map(review => (
                                                    <div className="comment-author-infos pt-25">
                                                        <p style={{ margin: 0 }}>
                                                            <span style={{ width: 32, height: 32 }}>
                                                                <img width={32} height={32} src={review.account.imagePath} alt="" style={{ borderRadius: '50%' }} />
                                                            </span>
                                                            <span style={{ margin: "0 12px" }}>{review.account.name}</span>
                                                            <i>{moment.utc(review.createdAt).utcOffset('+0700').format('HH:mm DD/MM/YYYY')}</i>
                                                        </p>
                                                        <em style={{ paddingLeft: 44 }}>{review.content}</em>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Begin Quick View | Modal Area */}
                                            <div className="modal fade modal-wrapper"
                                                style={{ opacity: `${modalControl.open ? 1 : 0}`, zIndex: 100, top: 10 }}
                                            >
                                                <div
                                                    // className="modal-dialog modal-dialog-centered"
                                                    // role="document"
                                                    style={{ opacity: 1, visibility: "visible", zIndex: 100, top: 180, width: 800, margin: "auto" }}
                                                >
                                                    <div className="modal-content">
                                                        <div className="modal-body">
                                                            <h3 className="review-page-title">Write Your Review</h3>
                                                            <div className="modal-inner-area row">
                                                                <div className="col-lg-6">
                                                                    <div className="li-review-product">
                                                                        <img
                                                                            style={{ width: 360 }}
                                                                            src={product.defaultImage}
                                                                            alt="Li's Product"
                                                                        />
                                                                        <div className="li-review-product-desc">
                                                                            <p>
                                                                                <span>
                                                                                    {product.description}
                                                                                </span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-6">
                                                                    <div className="li-review-content">
                                                                        {/* Begin Feedback Area */}
                                                                        <div className="feedback-area">
                                                                            <div className="feedback">
                                                                                <h3 className="feedback-title">Our Feedback</h3>
                                                                                <form onSubmit={onSubmit}>
                                                                                    <p className="your-opinion">
                                                                                        <label>Your Rating</label>
                                                                                        <span>
                                                                                            <select name='star' className="star-rating" defaultValue={Math.round(accountRating)} style={{ outline: "none" }}>
                                                                                                <option value={1}>1</option>
                                                                                                <option value={2}>2</option>
                                                                                                <option value={3}>3</option>
                                                                                                <option value={4}>4</option>
                                                                                                <option value={5}>5</option>
                                                                                            </select>
                                                                                        </span>
                                                                                    </p>
                                                                                    <p className="feedback-form">
                                                                                        <label htmlFor="feedback">Your Review</label>
                                                                                        <textarea
                                                                                            id="feedback"
                                                                                            name="content"
                                                                                            cols={45}
                                                                                            rows={8}
                                                                                            aria-required="true"
                                                                                            defaultValue={""}
                                                                                        />
                                                                                    </p>
                                                                                    <div className="feedback-input">
                                                                                        <div className="feedback-btn pb-15">
                                                                                            <a

                                                                                                className="close"
                                                                                                data-dismiss="modal"
                                                                                                aria-label="Close"
                                                                                                onClick={() => setModalControl({ open: false, data: null })}
                                                                                            >
                                                                                                Close
                                                                                            </a>
                                                                                            <button type='submit'
                                                                                                style={{ width: 'fit-content', outline: "none", border: "none", padding: 0 }}
                                                                                            >
                                                                                                <a>Submit</a>
                                                                                            </button>
                                                                                        </div>
                                                                                        {errReview.open && <p style={{ color: `${errReview.color}` }}>{errReview.message}</p>}
                                                                                    </div>
                                                                                </form>
                                                                            </div>
                                                                        </div>
                                                                        {/* Feedback Area End Here */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Quick View | Modal Area End Here */}
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>

            <section className="product-area li-laptop-product pt-30 pb-50">
                <div className="container">
                    <div className="row">
                        {/* Begin Li's Section Area */}
                        <div className="col-lg-12">
                            <div className="li-section-title">
                                <h2>
                                    <span>4 other products:</span>
                                </h2>
                            </div>
                            <div className="row">
                                <div className="" style={{ display: "flex" }}>
                                    {
                                        recommends.slice(-4).map((product) => (
                                            <div key={product.id} className="col-lg-12" style={{ maxWidth: 300 }}>

                                                <div className="single-product-wrap">
                                                    <div className="product-image">
                                                        <a>
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
                                                                {
                                                                    product.discountPercentage > 0 ?
                                                                        <>
                                                                            <span className="new-price new-price-2">${(product.price * (100 - product.discountPercentage) / 100).toFixed(2)}</span>
                                                                            <span className="old-price">${product.price}</span>
                                                                            <span className="discount-percentage">-{product.discountPercentage}%</span>
                                                                        </>
                                                                        : <span className="new-price">${product.price}</span>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="add-actions">
                                                            <ul className="add-actions-link">
                                                                <li className="add-cart active">
                                                                    <a>Add to cart</a>
                                                                </li>
                                                                <li>
                                                                    <a

                                                                        title="quick view"
                                                                        className="quick-view-btn"
                                                                        data-toggle="modal"
                                                                        data-target="#exampleModalCenter"
                                                                    >
                                                                        <i className="fa fa-eye" />
                                                                    </a>
                                                                </li>
                                                                <li>
                                                                    <a className="links-details">
                                                                        <i className="fa fa-heart-o" />
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* single-product-wrap end */}
                                            </div>
                                        ))
                                    }

                                </div>
                            </div>
                        </div>
                        {/* Li's Section Area End Here */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Product