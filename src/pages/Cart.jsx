import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { linkBackend } from "../constants/url";
import { getCart } from "../redux/slices/cart"
import { useEffect } from "react";

const Cart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("account_user")) || {};
    let cart = useSelector(state => state.cart.data);

    if (cart.length > 0) {
        const newCart = [...cart]
        const x = newCart.sort((a, b) => a.id - b.id)
        cart = x
    }

    const subTotal = cart.reduce((total, item) => {
        return total +=
            item.quantity
            * parseFloat(item.variation.price * (100 - item.variation.product.discountPercentage) / 100).toFixed(2)
    }, 0)

    const handleDeleteCart = async (id) => {
        try {
            const result = await axios.delete(`${linkBackend}/carts/${id}`)
            if (result.data.statusCode === 200) {
                dispatch(getCart(user.id));
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleClickCheckout = () => {
        navigate("/checkout")
    }

    const handleChangeQuantity = async (status, cart) => {
        if ((status === -1 && cart.quantity === 1) || (status === 1 && cart.quantity === 3)) {
            return;
        }

        try {
            const result = await axios.put(`${linkBackend}/carts/update-quantity`, { status, id: cart.id })
            if (result.data.statusCode === 200) {
                dispatch(getCart(user.id));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!user.id) {
            navigate("/")
        }
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
                            <li className="active">Cart</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="container">
                <ul className="minicart-product-list">
                    {cart.map((cart) => (
                        <li key={cart.id}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                borderBottom: "1px solid grey"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <a className="minicart-product-image">
                                    <img width={150} src={cart.variation.image} alt="cart products" />
                                </a>
                                <div className="minicart-product-details">
                                    <h6>
                                        <a>{cart.variation.product.name}
                                            <span
                                                style={{
                                                    borderRadius: 4, padding: "2px 5px",
                                                    backgroundColor: `#f9f9f9`,
                                                    marginLeft: 12,
                                                    color: '',
                                                    border: `2px solid #666`
                                                }}
                                            >{cart.variation.color}</span>
                                        </a>
                                    </h6>
                                    <span>${(cart.variation.price * (100 - parseInt(cart.variation.product.discountPercentage)) / 100).toFixed(2)} x </span>
                                    <button className="dra-btn-quantity" onClick={() => handleChangeQuantity(-1, cart)} >-</button>
                                    <span style={{ margin: "0px 10px" }}>{cart.quantity}</span>
                                    <button className="dra-btn-quantity" onClick={() => handleChangeQuantity(1, cart)} >+</button>
                                </div>
                            </div>
                            <button className="close" title="Remove" onClick={() => handleDeleteCart(cart.id)}>
                                <i className="fa fa-close" />
                            </button>
                        </li>
                    ))}
                </ul>

                {cart?.length > 0 &&
                    <>
                        <p className="minicart-total">
                            SUBTOTAL: <span>${subTotal.toFixed(2)}</span>
                        </p>
                        <div className="minicart-button">
                            <a className="li-button li-button-fullwidth" onClick={handleClickCheckout}>
                                <span>Checkout</span>
                            </a>
                        </div>
                    </>
                }
            </div>
        </>
    )
}

export default Cart