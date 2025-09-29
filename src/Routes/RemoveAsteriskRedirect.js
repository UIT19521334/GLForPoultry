import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { publicRoutes } from ".";

export function RemoveAsteriskRedirect() {
	const location = useLocation();
	const navigate = useNavigate();
	const menu = useSelector((state) => state.FetchApi.menu);

	useEffect(() => {
		let denied = false;
		for (const router of publicRoutes) {
			const cleanPath = router.path.replace('/*', '');
			const isPathMatch = location.pathname.includes(cleanPath);
			if (isPathMatch) {
				if (!router?.menuid) {
					denied = false;
					break;
				}
				const hasMenu = menu.includes(router.menuid);
				if (!hasMenu) {
					denied = true;
					break;
				}
			}
		}

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
