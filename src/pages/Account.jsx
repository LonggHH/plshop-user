import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { uploadImage } from '../common/upload';
import instanceAxios from '../configs/axios';
import axios from 'axios';

const defaultPassword = { oldPassword: "", newPassword: "", confirmPassword: "" }

const Account = () => {

    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('account_user')) || {});
    const [imageUrl, setImageUrl] = useState(user?.imagePath);
    const [notitfy, setNotify] = useState({ open: false, message: "", color: "red" });

    const [password, setPassword] = useState(defaultPassword);
    const [notifyPassword, setNotifyPassword] = useState({ open: false, message: "", color: "red" })


    const handleSelectImage = async (e) => {

        const formData = new FormData();
        formData.append('media', e.target.files[0]); // yourFile là một đối tượng File từ input[type="file"]
        // formData.append('models', 'nudity-2.0,wad,celebrities,offensive,scam,gore,qr-content,genai,gambling');
        formData.append('workflow', 'wfl_g4ZEFPooVHWhHnOzHGhh3');
        formData.append('api_user', '1799345288');
        formData.append('api_secret', 'QibbEfgNdLsAphiKppiummNaM8iC3xot');

        try {
            const response = await axios.post('https://api.sightengine.com/1.0/check-workflow.json', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const result = response.data;
            console.log(result);
            if (result.weapon > 0.5) {
                handleSetNotify('In the new photo there is weapon', 'red');
                return;
            }
            if (result.skull.prob > 0.5) {
                handleSetNotify('In the new photo there is skull', 'red');
                return;
            }
            if (result.scam.prob > 0.5) {
                handleSetNotify('In the new photo there is scam', 'red');
                return;
            }
            if (result.gambling.prob > 0.5) {
                handleSetNotify('In the new photo there is gambling', 'red');
                return;
            }
            if (result.nudity.erotica >= 0.5 || result.nudity.sextoy >= 0.5
                || result.nudity.sexual_activity >= 0.5 || result.nudity.sexual_display >= 0.5
                || result.nudity.suggestive >= 0.3) {
                handleSetNotify('In the new photo there is pornography', 'red');
                return;
            }

            const url = await uploadImage(e.target.files[0]);
            setImageUrl(url);

        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    }

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

        if (values.name.length < 5) {
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

        const data = {
            id: user.id,
            name: values.name,
            gender: values.gender,
            email: values.email,
            phone: values.phone,
            imagePath: imageUrl
        }

        try {
            const result = await instanceAxios.put(`/accounts/update`, data, {
                headers: {
                    'Authorization': `Bearer ${user.refreshToken}`
                }
            })
            if (result.data.statusCode === 200) {
                localStorage.setItem('account_user', JSON.stringify({ ...user, ...result.data.data }))
                setUser({ ...user, ...result.data.data });
                handleSetNotify(result.data.message, 'green')
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            handleSetNotify(error.response.data.message, 'red')
        }
    }

    const handleChangePassword = (e) => {
        const { name, value } = e.target
        setPassword({ ...password, [name]: value })
    }

    const handleShowNotifyPassword = (message, color) => {
        setNotifyPassword({ open: true, message, color })
        setTimeout(() => {
            setNotifyPassword({ open: false, message: "", color: "red" })
        }, 2000)
    }

    const handleSubmitPassword = async () => {
        const { oldPassword, newPassword, confirmPassword } = password

        if (newPassword.length < 6 || confirmPassword.length < 6) {
            handleShowNotifyPassword("Confirm the length password, min 6 character", "red")
            return
        }
        if (newPassword !== confirmPassword) {
            handleShowNotifyPassword("Confirm the new password", "red")
            return
        }

        try {
            const result = await instanceAxios.put('accounts/change-password', { oldPassword, newPassword });
            if (result.data.statusCode === 200) {
                handleShowNotifyPassword(result.data.message, 'green')
                setPassword(defaultPassword)
            }
        } catch (error) {
            handleShowNotifyPassword(error.response.data.message, 'red')
        }
    }

    useEffect(() => {
        if (!user.id) {
            navigate('/')
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
                            <li className="active">Account</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="checkout-area pt-60 pb-30">
                <div className="container">

                    <form className="row" onSubmit={onSubmit}>
                        <div className="col-lg-6 col-12">
                            <div>
                                <div className="checkbox-form">
                                    <h3>Account</h3>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>Name <span className="required">*</span></label>
                                                <input name="name" placeholder="" type="text" defaultValue={user?.name} />
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Gender <span className="required" >*</span>
                                                </label>
                                                <select name="gender" id="gender" defaultValue={user?.gender}>
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Email <span className="required">*</span>
                                                </label>
                                                <input name="email" placeholder="" type="email" defaultValue={user?.email} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="checkout-form-list">
                                                <label>
                                                    Phone
                                                </label>
                                                <input name="phone" type="text" defaultValue={user?.phone} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="different-address">
                                        <div className="order-notes">
                                            <div className="checkout-form-list">
                                                <label htmlFor='imagePath' className='dra-pointer'>Image</label>
                                                {imageUrl && <img width={200} src={imageUrl} alt="img" />}
                                                <input type="file" hidden id='imagePath' name='imagePath' accept="image/*"
                                                    onChange={handleSelectImage}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <input className='button dra-pointer' type='submit' value={"submit"} />
                                        {notitfy.open && <p style={{ color: `${notitfy.color}` }}>{notitfy.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6 col-12">
                            <div className="your-order">
                                <h3>Change password</h3>
                                <div className="your-order-table table-responsive">
                                    <table className="table">
                                        <tbody>
                                            <tr className="cart_item">
                                                <td className="cart-product-name">
                                                    <label htmlFor="oldPassword">
                                                        Old Password <span className="required">*</span>
                                                    </label>
                                                </td>
                                                <td className="cart-product-total">
                                                    <input id='oldPassword' name='oldPassword' type="password" value={password.oldPassword}
                                                        onChange={handleChangePassword}
                                                    />
                                                </td>
                                            </tr>
                                            <tr className="cart_item">
                                                <td className="cart-product-name">
                                                    <label htmlFor="newPassword">
                                                        New Password <span className="required">*</span>
                                                    </label>
                                                </td>
                                                <td className="cart-product-total">
                                                    <input id='newPassword' name='newPassword' type="password" value={password.newPassword}
                                                        onChange={handleChangePassword} />
                                                </td>
                                            </tr>
                                            <tr className="cart_item">
                                                <td className="cart-product-name">
                                                    <label htmlFor="confirmPassword">
                                                        Confirm Password <span className="required">*</span>
                                                    </label>
                                                </td>
                                                <td className="cart-product-total">
                                                    <input id='confirmPassword' name='confirmPassword' type="password" value={password.confirmPassword}
                                                        onChange={handleChangePassword} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    <button
                                                        type='button'
                                                        className='dra-pointer'
                                                        style={{
                                                            border: '1px solid black',
                                                            display: 'inline-block',
                                                            width: '100%',
                                                            padding: 10,
                                                        }}
                                                        onClick={handleSubmitPassword}
                                                    > Change </button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colSpan={2}>
                                                    {notifyPassword.open && <p style={{ color: `${notifyPassword.color}` }}>{notifyPassword.message}</p>}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Account