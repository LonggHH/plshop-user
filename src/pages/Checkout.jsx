import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { linkBackend } from "../constants/url";
import { getCart } from "../redux/slices/cart";
import { PayPalButton } from "react-paypal-button-v2";

const Checkout = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("account_user")) || {};
    let cart = useSelector(state => state.cart.data);
    const [notitfy, setNotify] = useState({ open: false, message: "", color: "red" });
    const [pay, setPay] = useState(false);

    const subTotal = cart.reduce((total, item) => {
        return total +=
            item.quantity
            * parseFloat(item.variation.price * (100 - item.variation.product.discountPercentage) / 100).toFixed(2)
    }, 0)

    const handleSetNotify = (message, color) => {
        setNotify({ open: true, message, color })
        setTimeout(() => {
            setNotify({ open: false, message: "", color: "red" })
        }, 2000)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        if (cart.length === 0) {
            handleSetNotify("Cart is empty", "red")
            return;
        }

        const name = values.firstname.trim() + " " + values.lastname.trim();
        if (name.length < 5) {
            handleSetNotify("Name is longer than 4 characters", "red")
            return;
        }

        if (values.address === "") {
            handleSetNotify("Address is not empty", "red")
            return;
        }

        if (!/^0[13579][0-9]{8}$/.test(values.phone)) {
            handleSetNotify("Phone Viet Nam format", "red")
            return;
        }

        if (values.email !== "" && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email)) {
            handleSetNotify("Enter the correct email format", "red")
            return;
        }
        const { firstname, lastname, ...info } = values;

        const data = { ...info, total: parseFloat(subTotal.toFixed(2)), account_id: user.id, name, pay: false }

        try {
            const result = await axios.post(`${linkBackend}/orders/create`, data)
            if (result.data.statusCode === 200) {
                e.target.reset();
                dispatch(getCart(user.id));
                navigate('/order');
            }
        } catch (error) {
            handleSetNotify("Order eror", "red");
        }
    }

    const handlePaypalOrder = async () => {
        const formData = new FormData(formRef.current);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        const { firstname, lastname, ...info } = values;
        const name = values.firstname.trim() + " " + values.lastname.trim();
        const data = { ...info, total: parseFloat(subTotal.toFixed(2)), account_id: user.id, name, pay: true }

        try {
            const result = await axios.post(`${linkBackend}/orders/create`, data)
            if (result.data.statusCode === 200) {
                dispatch(getCart(user.id));
                navigate('/order');
            }
        } catch (error) {
            handleSetNotify("Order eror", "red");
        }
    }


    useEffect(() => {
        if (!user.id || cart.length === 0) {
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
                            <li className="active">Checkout</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="checkout-area pt-60 pb-30">
                <div className="container">

                    <form ref={formRef} className="row" onSubmit={onSubmit}>
                        <div className="col-lg-6 col-12">
                            <div>
                                <div className="checkbox-form">
                                    <h3>Billing Details</h3>
                                    <div className="row">

                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    First Name <span className="required">*</span>
                                                </label>
                                                <input name="firstname" placeholder="" type="text" defaultValue="Nguyen" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Last Name <span className="required">*</span>
                                                </label>
                                                <input name="lastname" placeholder="" type="text" defaultValue="Nam" />
                                            </div>
                                        </div>
                                        {/* <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>Company Name</label>
                                                <input name="company" placeholder="" type="text" />
                                            </div>
                                        </div> */}
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Address <span className="required">*</span>
                                                </label>
                                                <input name="address" placeholder="Street address" type="text"
                                                    defaultValue="141 đường Chiến Thắng - Tân Triều - Thanh Trì - Hà Nội"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Phone <span className="required">*</span>
                                                </label>
                                                <input name="phone" type="text" defaultValue="0987654321" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Email Address
                                                </label>
                                                <input name="email" placeholder="" type="email" defaultValue="user@gmail.com" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="different-address">
                                        <div className="order-notes">
                                            <div className="checkout-form-list">
                                                <label>Notes</label>
                                                <textarea
                                                    id="checkout-mess"
                                                    name="note"
                                                    cols={30}
                                                    rows={20}
                                                    placeholder="Notes about your order, e.g. special notes for delivery."
                                                    style={{ resize: "none", height: 250 }}
                                                    defaultValue={"Hàng dễ vỡ, xin cẩn thận !!!"}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-12">
                            <div className="your-order">
                                <h3>Your order</h3>
                                <div className="your-order-table table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="cart-product-name">Product</th>
                                                <th className="cart-product-total">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cart.map(item => (
                                                <tr key={item.id} className="cart_item">
                                                    <td className="cart-product-name">
                                                        {" "}
                                                        {item.variation.product.name}
                                                        <span style={{ border: "1px solid black", margin: "0px 6px" }}> {item.variation.color} </span>
                                                        <strong className="product-quantity"> × {item.quantity}</strong>
                                                    </td>
                                                    <td className="cart-product-total">
                                                        <span className="amount">
                                                            ${(item.quantity * (item.variation.price * (100 - item.variation.product.discountPercentage) / 100)).toFixed(2)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="order-total">
                                                <th>Order Total</th>
                                                <td>
                                                    <strong>
                                                        <span className="amount">${subTotal.toFixed(2)}</span>
                                                    </strong>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="payment-method">
                                    <div className="payment-accordion">
                                        <div id="accordion">
                                            <div className="card">
                                                <div className="card-header" id="#payment-1">
                                                    <h5 className="panel-title">
                                                        <a
                                                            className=""
                                                            data-toggle="collapse"
                                                            data-target="#collapseOne"
                                                            aria-expanded="true"
                                                            aria-controls="collapseOne"
                                                        >
                                                            Direct Bank Transfer.
                                                        </a>
                                                    </h5>
                                                </div>
                                                <div
                                                    id="collapseOne"
                                                    className="collapse show"
                                                    data-parent="#accordion"
                                                >
                                                    <div className="card-body">
                                                        <p>
                                                            Make your payment directly into our bank account. Please
                                                            use your Order ID as the payment reference. Your order
                                                            won’t be shipped until the funds have cleared in our
                                                            account.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <label htmlFor="paypal">Paypal</label>
                                                <input id="paypal" style={{ display: "inline", width: 24 }} type="radio"
                                                    onClick={() => setPay(true)} checked={pay}
                                                />
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                <label htmlFor="order">Order</label>
                                                <input id="order" style={{ display: "inline", width: 24 }} type="radio"
                                                    onClick={() => setPay(false)} checked={!pay}
                                                />
                                            </div>
                                        </div>
                                        {
                                            pay ?
                                                <PayPalButton
                                                    amount={subTotal}
                                                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                                    onSuccess={(details, data) => {

                                                        handlePaypalOrder();
                                                        // OPTIONAL: Call your server to save the transaction
                                                        // return fetch("/paypal-transaction-complete", {
                                                        //     method: "post",
                                                        //     body: JSON.stringify({
                                                        //         orderID: data.orderID
                                                        //     })
                                                        // });
                                                    }}

                                                    onError={(error) => {
                                                        console.log(error);
                                                    }}
                                                />
                                                : <div className="order-button-payment">
                                                    <input defaultValue="Place order" type="submit" value={"Order"} />
                                                </div>
                                        }
                                        {notitfy.open && <p style={{ color: `${notitfy.color}` }}>{notitfy.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Checkout