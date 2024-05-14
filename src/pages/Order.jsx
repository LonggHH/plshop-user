import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import axios from "axios";
import { linkBackend } from "../constants/url";

const Order = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("account_user")) || {};
    const [order, setOrder] = useState([]);
    const [status, setStatus] = useState("");

    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${linkBackend}/orders/${user.id}`)
            console.log(result.data.data);
            if (result.data.statusCode === 200) {
                setOrder(result.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDeny = async (id) => {
        try {
            const result = await axios.post(`${linkBackend}/orders/status`, { id, status: "user_deny" });
            if (result.data.statusCode === 200) {
                handleGetOrder()
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (!user.id) {
            navigate("/")
        }
        handleGetOrder()
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
                            <li className="active">Order</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="Shopping-cart-area pt-60 pb-60">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form action="#">

                                <div className="row" style={{ marginBottom: 24 }}>
                                    <div className="col-12">

                                        <div className="coupon-all">
                                            <div className="coupon">
                                                <span>Status: </span>
                                                <input
                                                    className="button"
                                                    defaultValue="All"
                                                    type="button"
                                                    onClick={() => setStatus("")}
                                                />
                                                <input
                                                    className="button"
                                                    defaultValue="Pending"
                                                    type="button"
                                                    style={{ margin: "0 12px" }}
                                                    onClick={() => setStatus("pending")}
                                                />
                                                <input
                                                    className="button"
                                                    defaultValue="Accept"
                                                    type="button"
                                                    style={{ margin: "0 12px" }}
                                                    onClick={() => setStatus("accept")}
                                                />
                                                <input
                                                    className="button"
                                                    defaultValue="Deny"
                                                    type="button"
                                                    onClick={() => setStatus("deny")}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div className="table-content table-responsive" style={{ maxHeight: 700, overflowY: "scroll" }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove" style={{ width: 200 }}>Receiver</th>
                                                <th className="li-product-thumbnail">Note</th>
                                                <th className="cart-product-name">Detail</th>
                                                <th className="li-product-quantity">Total</th>
                                                <th className="li-product-price" style={{ width: 100 }}>Date</th>
                                                <th className="li-product-subtotal">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order
                                                .filter(item => item.status.includes(status))
                                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                                .map(item => {
                                                    const date = new Date(item.date);
                                                    const formattedDateH =
                                                        `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
                                                    const formattedDateD =
                                                        `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
                                                    let details = item.details;
                                                    details = details.map((item) => {
                                                        return {
                                                            ...item,
                                                            variation: JSON.parse(item.variation)
                                                        }
                                                    })
                                                    return (
                                                        <tr key={item.id}>
                                                            <td className="li-product-remove">
                                                                <a
                                                                    style={{
                                                                        display: "flex",
                                                                        flexDirection: "column",
                                                                        alignItems: "start",
                                                                        fontWeight: 100, fontSize: 14
                                                                    }}
                                                                >
                                                                    <span> {item.name} </span>
                                                                    <span> {item.phone} </span>
                                                                    <span> {item.email} </span>
                                                                    <span style={{ textAlign: 'start' }}> {item.address} </span>
                                                                </a>
                                                            </td>
                                                            <td className="li-product-thumbnail">
                                                                <a>
                                                                    <span>{item.note}</span>
                                                                </a>
                                                            </td>
                                                            <td className="li-product-name" style={{ padding: 0 }}>
                                                                <table>
                                                                    <tbody>
                                                                        {details.map((detail) => (
                                                                            <tr key={detail.id}>
                                                                                <td style={{ width: 80 }}>
                                                                                    <img width={50} src={detail.variation.image} alt="img" />
                                                                                </td>
                                                                                <td style={{ padding: 0 }}>{detail.variation.name}</td>
                                                                                <td style={{ width: 80 }}>{detail.variation.color}</td>
                                                                                <td style={{ width: 80 }}>${detail.variation.price}</td>
                                                                                <td style={{ width: 20 }}>{detail.quantity}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                            <td className="quantity">
                                                                ${item.total}
                                                            </td>
                                                            <td className="li-product-price">
                                                                <p className="amount"> {formattedDateH} </p>
                                                                <p className="amount"> {formattedDateD} </p>
                                                            </td>
                                                            <td className="product-subtotal">
                                                                {
                                                                    item.status.includes("pending") ?
                                                                        <div style={{ display: "flex", flexDirection: "column" }}>
                                                                            <span style={{ fontWeight: 100, fontSize: 14, color: `${item.pay ? "green" : "black"}` }}>{item.status}</span>
                                                                            <button type="button"
                                                                                onClick={() => handleDeny(item.id)}
                                                                                style={{ cursor: "pointer", borderRadius: 4, padding: 0 }}
                                                                            >Deny</button>
                                                                        </div>
                                                                        : <span style={{ fontWeight: 100, fontSize: 14 }}>{item.status}</span>
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Order