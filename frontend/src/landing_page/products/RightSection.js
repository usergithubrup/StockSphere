import React from "react";

function RightSection({ imageURL, productName, productDesription, learnMore }) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 col-md-6 p-3 p-md-5 order-2 order-md-1">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div>
            <a href={learnMore}>Learn More</a>
          </div>
        </div>
        <div className="col-12 col-md-6 text-center mb-4 mb-md-0 order-1 order-md-2">
          <img src={imageURL} className="img-fluid" alt={productName} />
        </div>
      </div>
    </div>
  );
}

export default RightSection;