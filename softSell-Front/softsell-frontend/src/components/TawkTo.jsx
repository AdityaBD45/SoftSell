// src/components/TawkTo.jsx
import { useEffect } from 'react'

const TawkTo = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://embed.tawk.to/68205a53dcadb6190b021928/1iqv61m0k";
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [])

  return null;
}

export default TawkTo
