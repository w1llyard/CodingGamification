import { useState, useEffect } from "react";
// import logo from "../../assets/CC logo (1).png";
import "./logo.css";
import { Image } from "@nextui-org/react";

function Loading() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <div className="overlayContent">
      {loading && (
        <div className="loader">
          <div className="inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/LOGO.png" className="logo" alt="logo" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Loading;
