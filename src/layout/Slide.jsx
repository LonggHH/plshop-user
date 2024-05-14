
const Slide = () => {
    return (
        <div className="slider-with-banner">
            <div className="container">
                <div className="row">
                    {/* Begin Slider Area */}
                    <div className="col-lg-8 col-md-8">
                        <div className="slider-area">

                            <img style={{ width: "100%" }} src="images/banner/1_1.jpg" alt="" />

                        </div>
                    </div>
                    {/* Slider Area End Here */}
                    {/* Begin Li Banner Area */}
                    <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                        <div className="li-banner">
                            <a href="#">
                                <img src="images/banner/1_1.jpg" alt="" />
                            </a>
                        </div>
                        <div className="li-banner mt-15 mt-sm-30 mt-xs-30">
                            <a href="#">
                                <img src="images/banner/1_2.jpg" alt="" />
                            </a>
                        </div>
                    </div>
                    {/* Li Banner Area End Here */}
                </div>
            </div>
        </div>
    )
}

export default Slide