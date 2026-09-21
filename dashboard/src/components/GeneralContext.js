import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  openSellWindow: (uid, price) => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [orderMode, setOrderMode] = useState("BUY");

  const handleOpenBuyWindow = (uid, price = 0) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedPrice(price);
    setOrderMode("BUY");
  };

  const handleOpenSellWindow = (uid, price = 0) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedPrice(price);
    setOrderMode("SELL");
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedPrice(0);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeBuyWindow: handleCloseBuyWindow,
      }}
    >
      {props.children}
      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          initialPrice={selectedPrice}
          mode={orderMode}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
