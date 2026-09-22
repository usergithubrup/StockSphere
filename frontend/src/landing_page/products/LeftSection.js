import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDesription,
  tryDemo,
  learnMore,
  googlePlay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
          <img src={imageURL} className="img-fluid" alt={productName} />
        </div>
        <div className="col-12 col-md-6 p-3 p-md-5">
          <h1>{productName}</h1>
          <p>{productDesription}</p>
          <div>
            <a href={tryDemo}>Try Demo</a>
            <a href={learnMore} style={{ marginLeft: "30px" }}>
              Learn More
            </a>
          </div>
          <div className="mt-3">
            <a href={googlePlay}>
              <img src="media/images/googlePlayBadge.svg" className="img-fluid me-3 mb-2" alt="Google Play" />
            </a>
            <a href={appStore}>
              <img
                src="media/images/appstoreBadge.svg"
                className="img-fluid mb-2"
                alt="App Store"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;