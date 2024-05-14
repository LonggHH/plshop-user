import axios from "axios";
import { useState } from "react"
import { linkBackend } from "../constants/url";
import { useNavigate } from "react-router-dom";

const namePage = {
    login: "login",
    register: "register"
}

const Login = () => {

    const navigate = useNavigate();
    const [page, setPage] = useState(namePage.login);
    const [errorRegister, setErrorRegister] = useState({ open: false, message: "" });
    const [errorLogin, setErrorLogin] = useState({ open: false, message: "" })

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        if (values?.firstName) {

            if ((values.firstName.trim() + values.lastName.trim()) < 6) {
                setErrorRegister({ open: true, message: "Full name needs longer than 6 characters" })
                setTimeout(() => {
                    setErrorRegister({ open: false, message: "" })
                }, 2000)
                return
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                setErrorRegister({ open: true, message: "Enter the correct email format" })
                setTimeout(() => {
                    setErrorRegister({ open: false, message: "" })
                }, 2000)
                return
            }
            if (values.password.length < 6) {
                setErrorRegister({ open: true, message: "Password needs longer than 6 characters" })
                setTimeout(() => {
                    setErrorRegister({ open: false, message: "" })
                }, 2000)
                return
            }
            if (values.password !== values.confirmPassword) {
                setErrorRegister({ open: true, message: "Password incorrect" })
                setTimeout(() => {
                    setErrorRegister({ open: false, message: "" })
                }, 2000)
                return
            }

            const data = {
                name: values.firstName.trim() + " " + values.lastName.trim(),
                email: values.email,
                password: values.password
            }

            try {
                const result = await axios.post(`${linkBackend}/auth/register`, data);
                if (result.data.statusCode === 201) {
                    setPage(namePage.login);
                }
            } catch (error) {
                console.log(error);
                setErrorRegister({ open: true, message: error.response.data.message })
                setTimeout(() => {
                    setErrorRegister({ open: false, message: "" })
                }, 2000)
                return
            }
            return;

        } else {
            const data = { ...values, role: "user" }
            try {
                const result = await axios.post(`${linkBackend}/auth/login`, data);
                if (result.data.statusCode === 200) {
                    localStorage.setItem("account_user", JSON.stringify(result.data.data))
                    navigate('/')
                }
            } catch (error) {
                console.log(error);
                setErrorLogin({ open: true, message: error.response.data.message })
                setTimeout(() => {
                    setErrorLogin({ open: false, message: "" })
                }, 2000)
                return
            }
        }
    }


    return (
        <div className="page-section mb-60">
            <div className="container">
                <div className="row" style={{ paddingTop: "100px" }}>
                    {
                        page === namePage.login ?
                            <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6 mb-30" style={{ margin: "auto" }}>
                                {/* Login Form s*/}
                                <form onSubmit={onSubmit}>
                                    <div className="login-form">
                                        <h4 className="login-title">Login</h4>
                                        <div className="row">
                                            <div className="col-md-12 col-12 mb-20">
                                                <label>Email Address*</label>
                                                <input
                                                    className="mb-0"
                                                    type="email"
                                                    placeholder="Email Address"
                                                    name="email"
                                                />
                                            </div>
                                            <div className="col-12 mb-20">
                                                <label>Password</label>
                                                <input
                                                    className="mb-0"
                                                    type="password"
                                                    placeholder="Password"
                                                    name="password"
                                                />
                                            </div>
                                            <div className="col-md-8">
                                                <div className="check-box d-inline-block ml-0 ml-md-2 mt-10">
                                                    <input type="checkbox" id="remember_me" />
                                                    <label htmlFor="remember_me">Remember me</label>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mt-10 mb-20 text-left text-md-right">
                                                <a
                                                    style={{
                                                        cursor: "pointer",
                                                        padding: "5px 10px",
                                                        backgroundColor: "#333",
                                                        color: "white",
                                                        borderRadius: 4

                                                    }}
                                                    onClick={() => setPage(namePage.register)}
                                                >
                                                    Register
                                                </a>
                                            </div>
                                            <div className="col-md-12"
                                                style={{
                                                    display: "flex", justifyContent: 'space-between', alignItems: "center"
                                                }}
                                            >
                                                <button className="register-button mt-0" type="submit">Login</button>
                                                <span className="dra-forgot"
                                                    style={{ textDecoration: 'underline' }}
                                                    onClick={() => navigate('/forgot-password')}
                                                >Forgot password</span>
                                            </div>
                                            {errorLogin.open && <p style={{ color: "red" }}>{errorLogin.message}</p>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                            : <div className="col-sm-12 col-md-12 col-lg-6 col-xs-12" style={{ margin: "auto" }}>
                                <form onSubmit={onSubmit}>
                                    <div className="login-form">
                                        <h4 className="login-title">Register</h4>
                                        <div className="row">
                                            <div className="col-md-6 col-12 mb-20">
                                                <label>First Name</label>
                                                <input name="firstName" className="mb-0" type="text" placeholder="First Name" />
                                            </div>
                                            <div className="col-md-6 col-12 mb-20">
                                                <label>Last Name</label>
                                                <input name="lastName" className="mb-0" type="text" placeholder="Last Name" />
                                            </div>
                                            <div className="col-md-12 mb-20">
                                                <label>Email Address*</label>
                                                <input
                                                    className="mb-0"
                                                    type="email"
                                                    placeholder="Email Address"
                                                    name="email"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-20">
                                                <label>Password</label>
                                                <input
                                                    className="mb-0"
                                                    type="password"
                                                    placeholder="Password"
                                                    name="password"
                                                />
                                            </div>
                                            <div className="col-md-6 mb-20">
                                                <label>Confirm Password</label>
                                                <input
                                                    className="mb-0"
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    name="confirmPassword"
                                                />
                                            </div>
                                            <div className="col-12" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <button className="register-button mt-0" type="submit">Register</button>

                                                <span style={{
                                                    borderRadius: 4,
                                                    backgroundColor: "#333",
                                                    color: "white",
                                                    padding: "5px 10px",
                                                    cursor: "pointer"
                                                }}
                                                    onClick={() => setPage(namePage.login)}
                                                >
                                                    Login
                                                </span>

                                            </div>
                                            {errorRegister.open && <p style={{ color: "red" }}>{errorRegister.message}</p>}
                                        </div>
                                    </div>
                                </form>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Login