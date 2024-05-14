import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getWishlists } from "../redux/slices/wishlist"
import axios from "axios"
import { linkBackend } from "../constants/url"

const Wishlist = () => {


    const navigate = useNavigate()
    const dispatch = useDispatch()
    const account = JSON.parse(localStorage.getItem('account_user')) || {}

    const wishlists = useSelector(state => state.wishlist.data)
    const products = useSelector(state => state.product.data)

    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const totalPage = Math.ceil(wishlists.length / pageSize) || 1

    const handleRidirectToProduct = (product) => {
        localStorage.setItem("choose_product", JSON.stringify(product));
        navigate("/product")
    }

    const handleClickPage = (i) => {
        setCurrentPage(i);
    }

    const handleChangePage = (status) => {
        switch (status) {
            case -1:
                if (currentPage > 1) {
                    setCurrentPage(currentPage - 1);
                }
                break;
            case 1:
                if (currentPage < totalPage) {
                    setCurrentPage(currentPage + 1);
                }
                break
        }
    }

    const handleChangeWishlist = async (productId) => {
        const data = { accountId: account?.id, productId }
        if (data.accountId) {
            try {
                await axios.put(`${linkBackend}/accounts/change-wishlists`, { accountId: account.id, productId })
                dispatch(getWishlists(account.id))
                setCurrentPage(1)
            } catch (error) {
                console.log(error);
            }
        } else {
            navigate('/login')
        }
    }

    return (
        <>
            <div className="breadcrumb-area">

                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li>
                                <a style={{ cursor: "pointer" }} onClick={() => navigate("/")}>Home</a>
                            </li>
                            <li className="active">Wishlist</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="wishlist-area pt-60 pb-20">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form>
                                <div className="table-content table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="li-product-remove">remove</th>
                                                <th className="li-product-thumbnail">images</th>
                                                <th className="cart-product-name">Product</th>
                                                <th className="li-product-price">Unit Price</th>
                                                <th className="li-product-add-cart">add to cart</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {wishlists.slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                                .map((wishlist) => {
                                                    const product = products.find(p => p.id === wishlist.product_id)
                                                    return (
                                                        <tr key={wishlist.id}>
                                                            <td className="li-product-remove">
                                                                <a onClick={() => handleChangeWishlist(product.id)}>
                                                                    <i className="fa fa-times" />
                                                                </a>
                                                            </td>
                                                            <td className="li-product-thumbnail">
                                                                <a>
                                                                    <img width={100} src={product.defaultImage} alt="" />
                                                                </a>
                                                            </td>
                                                            <td className="li-product-name">
                                                                <a>{product.name}</a>
                                                            </td>
                                                            <td className="li-product-price">
                                                                <span className="amount">
                                                                    ${(product.price * (100 - product.discountPercentage) / 100).toFixed(2)}
                                                                </span>
                                                            </td>
                                                            <td className="li-product-add-cart">
                                                                <a onClick={() => handleRidirectToProduct(product)}>add to cart</a>
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


            <div className="container">
                <div className="paginatoin-area">
                    <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <p>Showing 5 item(s)</p>
                        </div>
                        <div className="col-lg-6 col-md-6">
                            <ul className="pagination-box">
                                <li
                                    onClick={() => handleChangePage(-1)}
                                >
                                    <a className="Previous" style={{ cursor: "pointer" }}>
                                        <i className="fa fa-chevron-left" /> Previous
                                    </a>
                                </li>
                                {Array(totalPage).fill().map((_, index) => (
                                    <li key={index}
                                        onClick={() => handleClickPage(index + 1)}
                                    >
                                        <a
                                            style={{ color: `${currentPage === index + 1 ? "red" : "black"}`, cursor: "pointer" }}
                                        >{index + 1}</a>
                                    </li>
                                ))}
                                <li
                                    onClick={() => handleChangePage(1)}
                                >
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
        </>
    )
}

export default Wishlist