import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export function RemoveAsteriskRedirect() {
    const location = useLocation();
    const navigate = useNavigate();
    const menu = useSelector((state) => state.FetchApi.menu);

    // Id lấy từ menu lv2 của master app
    const permissionMap = {
        accountgroup: 618,
        subaccount: 622,
        expense: 620,
        account: 621,
    };

    useEffect(() => {
        const denied = Object.entries(permissionMap).find(
            ([key, id]) => location.pathname.includes(key) && !menu.includes(id)
        );

        if (denied) {
            navigate("/", { replace: true });
            toast.error("You do not have permission to access this page");
            return;
        }

        if (location.pathname.includes("/*")) {
            // Xóa chuỗi "/*" ra khỏi path
            const cleanPath = location.pathname.replace("/*", "");
            navigate(cleanPath + location.search + location.hash, { replace: true });
        }
    }, [location, navigate]);

    return null; // component này chỉ làm nhiệm vụ redirect
}
