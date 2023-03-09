import { useEffect, useState } from "react";

type UseMobileMedia = () => { isMobile: boolean; };

// Small hook to get boolean if mobile (in my case under 720px in width) device is beeing used
export const useMobileMedia: UseMobileMedia = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 720);
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 720) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return { isMobile };
};
