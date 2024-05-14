import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { linkBackend } from "../constants/url"

const defaultError = { open: true, message: "", color: "" }

const Contact = () => {

    const navigate = useNavigate();

    const [error, setError] = useState(defaultError);

    const handleSetError = (err) => {
        setError(err)
        setTimeout(() => {
            setError(defaultError)
        }, 2000)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const values = {};
        for (let [name, value] of formData.entries()) {
            values[name] = value;
        }

        console.log(values);
        const { name, email, subject, message } = values;

        if (!name.trim() || !email.trim()) {
            handleSetError({ open: true, message: "Enter full fields value required", color: "red" })
            return
        }

        if (!subject.trim() || !message.trim()) {
            handleSetError({ open: true, message: "Enter full content before send mail for we", color: "red" })
            return
        }

        try {
            const result = await axios.post(`${linkBackend}/mailer/send-mail`, values)
            if (result.data.statusCode === 200) {
                e.target.reset();
                handleSetError({ open: true, message: "Success send mail", color: "green" })

            }
        } catch (error) {
            console.log(error);
            handleSetError({ open: true, message: "Error send mail", color: "red" })
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
                            <li className="active">Contact</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="contact-main-page mt-60 mb-40 mb-md-40 mb-sm-40 mb-xs-40">
                <div className="container mb-60">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.294934055389!2d105.7962285!3d20.9808114!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc508f938fd%3A0x883e474806a2d1f2!2sAcademy%20of%20Cryptography%20Techniques!5e0!3m2!1sen!2s!4v1713521427173!5m2!1sen!2s"
                        width="600" height="450" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-lg-5 offset-lg-1 col-md-12 order-1 order-lg-2">
                            <div className="contact-page-side-content">
                                <h3 className="contact-page-title">Contact Us</h3>
                                <p className="contact-page-message mb-25">
                                    Welcome to the Contact page of Lipuma! We're delighted that you're interested in our products and services.
                                    If you have any questions, feedback, or need assistance,
                                    please don't hesitate to reach out to us using the information provided below.
                                    The Lipuma team is always ready to assist you.
                                </p>
                                <div className="single-contact-block">
                                    <h4>
                                        <i className="fa fa-fax" /> Address
                                    </h4>
                                    <p>141 Chien Thang Street, Tan Trieu Commune, Thanh Tri District, Ha Noi City, Viet Nam</p>
                                </div>
                                <div className="single-contact-block">
                                    <h4>
                                        <i className="fa fa-phone" /> Phone
                                    </h4>
                                    <p>Mobile: (84) 981 055 321</p>
                                    <p>Hotline: 1009 678 456</p>
                                </div>
                                <div className="single-contact-block last-child">
                                    <h4>
                                        <i className="fa fa-envelope-o" /> Email
                                    </h4>
                                    <p>lipuma@domain.com</p>
                                    <p>support@hastech.company</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 order-2 order-lg-1">
                            <div className="contact-form-content pt-sm-55 pt-xs-55">
                                <h3 className="contact-page-title">Tell Us Your Message</h3>
                                <div className="contact-form">
                                    <form onSubmit={onSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="name">
                                                Your Name <span className="required">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                required=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">
                                                Your Email <span className="required">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                required=""
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subject">Subject</label>
                                            <input type="text" name="subject" id="subject" />
                                        </div>
                                        <div className="form-group mb-30">
                                            <label htmlFor="message">Your Message</label>
                                            <textarea
                                                name="message"
                                                id="message"
                                                defaultValue={""}
                                                style={{ height: 250 }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <button
                                                type="submit"
                                                value="submit"
                                                id="submit"
                                                className="li-btn-3"
                                                name="submit"
                                            >
                                                send
                                            </button>
                                        </div>
                                    </form>
                                </div>
                                {error.open && <p className="form-messege" style={{ color: `${error.color}` }}>{error.message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact