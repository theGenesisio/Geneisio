import { useEffect, useRef } from "react";

const EURTicker = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "FX:EURUSD",
      width: "100%",
      isTransparent: true,
      colorTheme: "dark",
      locale: "en",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className='tradingview-widget-container flex items-center justify-center p-4'
      style={{ flexGrow: 1, maxWidth: "350px" }}>
      <div className='tradingview-widget-container__widget' ref={containerRef}></div>
      <div className='tradingview-widget-copyright text-center mt-2 invisible'>
        <a href='https://www.tradingview.com/' rel='noopener nofollow' target='_blank'>
          <span className='blue-text'>Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default EURTicker;
