import { useEffect, useRef, memo } from "react";

const TradingViewForexHeatMap = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      currencies: [
        "EUR",
        "USD",
        "JPY",
        "GBP",
        "CHF",
        "AUD",
        "CAD",
        "NZD",
        "CNY",
        "TRY",
        "SEK",
        "NOK",
        "DKK",
        "ZAR",
        "HKD",
        "SGD",
        "THB",
        "MXN",
        "IDR",
        "KRW",
        "PLN",
        "ISK",
        "KWD",
        "PHP",
        "MYR",
        "INR",
        "TWD",
        "SAR",
        "AED",
        "RUB",
        "ILS",
        "ARS",
        "CLP",
        "COP",
        "PEN",
        "UYU",
      ],
      isTransparent: true,
      colorTheme: "dark",
      locale: "en",
    });
    containerRef.current.innerHTML = ""; // Clear the container to avoid duplication
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className='tradingview-widget-container h-[100dvh] py-4' ref={containerRef}>
      <div className='tradingview-widget-container__widget'></div>
      <div className='tradingview-widget-copyright invisible'>
        <a href='https://www.tradingview.com/' rel='noopener nofollow' target='_blank'>
          <span className='blue-text'>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(TradingViewForexHeatMap);
