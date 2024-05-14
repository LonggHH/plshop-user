import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { linkBackend } from "../constants/url";

const defaultError = { open: true, message: "", color: "red" };

const Forgot = () => {

    const navigate = useNavigate();

    const [err, setErr] = useState(defaultError);

    const handleSetErr = async (error) => {
        setErr(error)
        setTimeout(() => {
            setErr(defaultError)
        }, 2000)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        const { email } = values;

        if (!email.trim()) {
            handleSetErr({ open: true, message: "Email invalid", color: 'red' })
            return
        }

        try {
            const result = await axios.post(`${linkBackend}/mailer/forgot-password`, values);
            if (result.data.statusCode === 200) {
                e.target.reset();
                console.log(result.data);
                handleSetErr({ open: true, message: "Success send, open your email", color: 'green' })
            }
        } catch (error) {
            console.log(error);
            handleSetErr({ open: true, message: "Error send", color: 'red' })
        }
    }

    return (
        <div className="page-section mb-60">
            <div className="container">
                <div className="row" style={{ paddingTop: "100px" }}>
                    <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6 mb-30" style={{ margin: "auto" }}>
                        {/* Login Form s*/}
                        <form
                            onSubmit={onSubmit}
                        >
                            <div className="login-form">
                                <h4 className="login-title">Forgot Password</h4>
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

                                    <div className="col-md-12"
                                        style={{
                                            display: "flex", justifyContent: 'space-between', alignItems: "center"
                                        }}
                                    >
                                        <button className="register-button mt-0" type="submit">Send</button>
                                        <span className="dra-forgot"
                                            style={{ textDecoration: 'underline' }}
                                            onClick={() => navigate('/login')}
                                        >
                                            Login
                                        </span>
                                    </div>
                                    <div className="col-md-12">
                                        {err.open && <p style={{ color: `${err.color}` }}>{err.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forgot