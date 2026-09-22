import React from 'react';
import { Link } from 'react-router-dom';

function Hero() {
    return (
        <div className = "container p-5 mb-5">
            <div className="row text-center">
                <img src = "media/images/homeHero.png" className="img-fluid mb-5" alt="Hero Image"/>
                <h1 className="mt-5"> Invest in everything</h1>
                <p>Online platform to invest in stocks,derivatives,mutual funds, and more</p>
                <Link to="/signup" className="p-2 btn btn-primary fs-5 mb-5" style={{ width: "auto", minWidth: "180px", margin:"0 auto", display: "inline-block", textDecoration: "none" }}>Signup Now</Link>
            </div>

        </div>
    );
}

export default Hero;