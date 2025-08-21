"use client"

import { useState, useEffect } from "react";

type WindowDimensions = {
    width: number | undefined;
    height: number | undefined;
    isMobile: boolean
    isMd: boolean
};

export default function useWindowDimensions(): WindowDimensions {
    const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
        width: undefined,
        height: undefined,
        isMobile: false,
        isMd: false
    });

    useEffect(() => {
        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
                isMd: window.innerWidth < 1024
            });
        }

        handleResize(); // Set initial dimensions
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
}
