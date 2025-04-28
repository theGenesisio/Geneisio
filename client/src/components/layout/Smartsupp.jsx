import { useEffect } from "react";

const SmartsuppChat = () => {
  useEffect(() => {
    if (document.getElementById("smartsupp-script")) return;

    // Set up Smartsupp global variables
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = "cbeba9c065b8d03432c847390281f7c881e7c9d6";

    // Create and append script
    const script = document.createElement("script");
    script.id = "smartsupp-script";
    script.type = "text/javascript";
    script.async = true;
    script.src = "https://www.smartsuppchat.com/loader.js?";
    document.head.appendChild(script);

    return () => {
      // Uncomment if you want to remove the script when unmounting
      // document.head.removeChild(script);
    };
  }, []);

  return null;
};

export default SmartsuppChat;
