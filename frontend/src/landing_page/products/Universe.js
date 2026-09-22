import React from 'react';
import { Link } from 'react-router-dom';

function Universe() {
  // Common style to make all images uniform in size without distortion
  const logoStyle = {
    height: "50px",
    width: "auto",
    maxWidth: "180px",
    objectFit: "contain",
    display: "block",
    margin: "0 auto 12px auto"
  };

  return (
    <div className="container mt-5">
      <div className="row text-center">
        <h1>The StockSphere Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-12 col-sm-6 col-md-4 p-3 mt-3 mt-md-5">
          <img 
            src="media/images/smallcaseLogo.png" 
            alt="Smallcase" 
            style={logoStyle} 
          />
          <p className="text-small text-muted">Thematic investment platform</p>
        </div>

        <div className="col-12 col-sm-6 col-md-4 p-3 mt-3 mt-md-5">
          <img 
            src="media/images/streakLogo.png" 
            alt="Streak" 
            style={logoStyle} 
          />
          <p className="text-small text-muted">Algo & strategy platform</p>
        </div>

        <div className="col-12 col-sm-6 col-md-4 p-3 mt-3 mt-md-5">
          <img 
            src="media/images/sensibullLogo.svg" 
            alt="Sensibull" 
            style={logoStyle} 
          />
          <p className="text-small text-muted">Options trading platform</p>
        </div>

        <div className="col-12 col-sm-6 col-md-4 p-3 mt-3 mt-md-5">
          <img 
            src="media/images/goldenpiLogo.png" 
            alt="GoldenPi" 
            style={logoStyle} 
          />
          <p className="text-small text-muted">Bonds trading platform</p>
        </div>

        <div className="col-12 col-sm-6 col-md-4 p-3 mt-3 mt-md-5">
          <img 
            src="media/images/dittoLogo.png" 
            alt="Ditto" 
            style={logoStyle} 
          />
          <p className="text-small text-muted">Insurance</p>
        </div>

        <div className="col-12 mt-4">
          <Link
            to="/signup"
            className="p-2 btn btn-primary fs-5 mb-5"
            style={{ width: "20%", minWidth: "150px", display: "inline-block", textDecoration: "none" }}
          >
            Signup Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Universe;