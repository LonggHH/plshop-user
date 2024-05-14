
const Banner = () => {
    return (
        <div className="li-static-banner">
            <div className="container">
                <div className="row">
                    {/* Begin Single Banner Area */}
                    <div className="col-lg-4 col-md-4 text-center">
                        <div className="single-banner">
                            <a href="#">
                                <img src="images/banner/1_3.jpg" alt="Li's Static Banner" />
                            </a>
                        </div>
                    </div>
                    {/* Single Banner Area End Here */}
                    {/* Begin Single Banner Area */}
                    <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                        <div className="single-banner">
                            <a href="#">
                                <img src="images/banner/1_4.jpg" alt="Li's Static Banner" />
                            </a>
                        </div>
                    </div>
                    {/* Single Banner Area End Here */}
                    {/* Begin Single Banner Area */}
                    <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                        <div className="single-banner">
                            <a href="#">
                                <img src="images/banner/1_5.jpg" alt="Li's Static Banner" />
                            </a>
                        </div>
                    </div>
                    {/* Single Banner Area End Here */}
                </div>
            </div>
        </div>

    )
}

export default Banner