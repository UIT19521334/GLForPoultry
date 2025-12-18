
![Logo](https://cdn.haitrieu.com/wp-content/uploads/2023/11/Logo-Japfa-1.png)

## 4. Cấu hình môi trường & build

### 4.1 Biến môi trường

File `.env` (không commit chi tiết ở đây) định nghĩa các biến chính (theo chuẩn CRA `REACT_APP_...`):

- `REACT_APP_API_URL`: base URL backend chung (DomainApi, dùng cho nhiều API master).
- `REACT_APP_API_URL_POULTRY`: base URL backend Poultry.
- `REACT_APP_API_URL_MASTER_APP`: base URL Master App.

Khi deploy sang môi trường mới, cần:

- Tạo file `.env` phù hợp (hoặc `.env.production`) với các URL tương ứng.
- Đảm bảo Azure AD `redirectUri` đã được whitelist bên Azure portal.

### 4.2 Yêu cầu môi trường

- Node.js: `>= 18`.

### 4.3 Run dev

1. Cài đặt dependency:
   - `npm i`
2. Chạy dev server:
   - `npm start`

### 4.4 Build & deploy

1. Build app ra thư mục `build`:
   - `npm run build`
2. Deploy:
   - Copy output lên máy dev qua FTP: `ftp://10/94.17.21:42479` (theo hướng dẫn nội bộ).
   - Nếu không truy cập được, liên hệ: `viet.vominh` hoặc `tan.nguyenminh`.

Lưu ý: Quy trình cụ thể có thể tuỳ thuộc hạ tầng nội bộ (IIS / Nginx / reverse proxy, …), nhưng về phía frontend chỉ cần build ra static file.

---

## 5. Cấu trúc thư mục (rút gọn)

```text
GLForPoultry/
├─ public/              # Index.html, favicon, static asset public
├─ src/
│  ├─ App.js            # Root component, cấu hình Router, MSAL, Theme, i18n
│  ├─ Config.js         # Cấu hình MSAL (Azure AD)
│  ├─ DomainApi/
│  │  ├─ index.js       # Khởi tạo axios instance cho từng domain
│  │  └─ apiClient.js   # Interceptor token + toast lỗi
│  ├─ Redux/
│  │  ├─ store.js       # Cấu hình Redux store
│  │  └─ Reducer/
│  │     ├─ Thunk.js    # createSlice + extraReducers cho các async thunk
│  │     └─ Actions.js  # Reducer khác (UI / flag)
│  ├─ Routes/
│  │  ├─ index.js       # Khai báo route, map với menuid/groupid
│  │  └─ RemoveAsteriskRedirect.js
│  ├─ Pages/
│  │  ├─ Home/
│  │  ├─ Login/
│  │  ├─ Master/        # Account, AccountGroup, Expense, SubAccount...
│  │  ├─ Transaction/   # AccountingEntry, CostAllocation, Period...
│  │  └─ Report/        # Report COGM, InOutWard, ...
│  ├─ components/
│  │  ├─ Layout/        # DefaultLayout và layout khác
│  │  └─ Api/ApiToken.js
│  ├─ TranslationLanguage/
│  │  └─ i18n.js        # i18next config
│  ├─ AppStyles.css
│  └─ globals.js        # Biến global, polyfill nếu có
├─ .env                 # Biến môi trường (local)
├─ package.json
├─ README.md           (file hiện tại)
└─ Document.md          # Tài liệu kỹ thuật  

