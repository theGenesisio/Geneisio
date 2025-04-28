import { useEffect } from "react";

const useScript = (url, id) => {
  useEffect(() => {
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.id = id;
    document.head.appendChild(script);

    return () => {
      // Don't remove the script unless necessary
      // document.head.removeChild(script);
    };
  }, [url, id]);
};

export default useScript;
