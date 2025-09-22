import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function RemoveAsteriskRedirect() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.pathname.includes("/*")) {
            // Xóa chuỗi "/*" ra khỏi path
            const cleanPath = location.pathname.replace("/*", "");
            navigate(cleanPath + location.search + location.hash, { replace: true });
        }
    }, [location, navigate]);

    return null; // component này chỉ làm nhiệm vụ redirect
}
