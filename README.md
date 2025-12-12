
![Logo](https://cdn.haitrieu.com/wp-content/uploads/2023/11/Logo-Japfa-1.png)


## 1. Tổng quan hệ thống

Japfa Poultry GL Web là ứng dụng web phục vụ nghiệp vụ kế toán – chi phí cho mảng Poultry.

Ứng dụng được xây dựng dưới dạng **SPA (Single Page Application)** trên nền **React**, sử dụng **Redux Toolkit** để quản lý state, tích hợp **Azure AD** cho xác thực, và giao tiếp với các backend domain qua REST API.

- **Frontend framework**: React (Create React App, cấu hình tuỳ biến qua `config-overrides.js`).
- **Routing**: `react-router-dom` (HashRouter).
- **State management**: `@reduxjs/toolkit` + `react-redux`.
- **Auth & SSO**: `@azure/msal-browser`, `@azure/msal-react` (Azure AD).
- **HTTP client**: `axios` với interceptor, `react-toastify` cho thông báo lỗi.
- **Reporting**: `@boldreports/javascript-reporting-controls`, `@boldreports/react-reporting-components`.
- **UI / Theme**: MUI (`@mui/material` – `ThemeProvider`), i18next cho đa ngôn ngữ.

---

## 2. Kiến trúc tổng thể

### 2.1 Luồng tổng quát

1. **User truy cập web** → ứng dụng chạy trong trình duyệt.
2. **MSAL / Azure AD** điều hướng user đến màn hình đăng nhập nếu chưa authenticated.
3. Sau khi đăng nhập thành công, component `ApiToken`:
   - Gọi **DomainMasterApp** để login Master App và nhận `accessToken` + thông tin user.
   - Gọi **DomainMasterApp** để lấy menu theo quyền user (menu nhiều cấp) → map thành danh sách `idNum`.
   - Gọi **DomainPoultry** (`/auth/info`) để lấy thông tin phân quyền & đơn vị (unit) Poultry.
   - Cập nhật Redux (`token`, `userInfo`, `userAccess`, menu, currentUnit...).
4. Mọi API tiếp theo dùng `apiClient` (axios instance) tự động gắn `Authorization: Bearer <token>` từ Redux.
5. Router (`publicRoutes`) render các màn hình Master, Transaction, Report theo quyền.

<div class="page-break"></div>

### 2.2 Cấu trúc chính (frontend)

- `src/App.js`
  - Khởi tạo `Router`, wrap bởi `MsalProvider`, `AuthenticatedTemplate` / `UnauthenticatedTemplate`.
  - Sử dụng `WrapperView` để:
    - Gọi `ApiToken()`.
    - Chờ `login.status` để quyết định render:
      - `Login` (chưa có token hoặc đang loading).
      - Layout + `publicRoutes` khi login OK.
      - `LoginError` khi call API token hoặc auth info lỗi.

- `src/Routes/index.js`
  - Định nghĩa các `Routes` theo group:
    - `otherRoutes`: home, user profile.
    - `masterRoutes`: AccountGroup, Expense, SubAccount, Account.
    - `transactionRoutes`: AccountingEntry, CostAllocation, Close/OpenAccountingPeriod.
    - `reportRoutes`: các route report (hiện comment, có thể mở lại khi backend sẵn sàng).
  - Mỗi route có: `path`, `component`, `title`, `menuid`, `groupid` (map với menu Master App).

- `src/Redux` (quản lý state toàn cục)
  - `store.js`: cấu hình Redux store bằng `configureStore`, với reducers:
    - `FetchApi`: slice chính chứa token, userInfo, userAccess, dialogError, dữ liệu master/transaction.
    - `Actions`: các action/flag UI khác.
  - `Reducer/Thunk.js`:
    - Khai báo `initialState`: token, userInfo, userAccess, menu, currentUnit, listData_* (Channel, Currency, Period, Account, Expense, Method...), `isLoading`, `isError`, `dialogError`...
    - `reducers`:
      - `updateToken`, `updateUserInfo`, `updateUserMenuFromMasterApp`, `updateCurrentUnit`, `updateUserAccess`, `updateListAccount`, `updateListExpense`, `updateDialogError`, `setGlobalLoading`.
    - `extraReducers`:
      - Xử lý kết quả các async thunk như `fetchApiChannel`, `fetchApiCurrency`, `fetchPeriod`, `fetchApiToken`, `fetchApiAuthInfo`, ...
      - Chuẩn hoá luồng `pending` / `fulfilled` / `rejected`, set `isLoading`, `isError` và `toast.error` khi lỗi.

- `src/DomainApi`
  - `index.js`:
    - `export default` (DomainApi): axios instance dùng `REACT_APP_API_URL`.
    - `DomainPoultry`: dùng `REACT_APP_API_URL_POULTRY`.
    - `DomainMasterApp`: dùng `REACT_APP_API_URL_MASTER_APP`.
  - `apiClient.js`:
    - Dùng `DomainApi` làm base.
    - **Request interceptor**: lấy `token` từ `store.getState().FetchApi.token`, gắn `Authorization`.
    - **Response interceptor**: show toast lỗi dùng `react-toastify` với message từ `error.response.data` hoặc `error.message`.

- `src/components/Api/ApiToken.js`
  - Hook component, sử dụng `useMsal`, `useDispatch`.
  - Lấy `activeAccount` từ MSAL.
  - `useEffect` khi `callApiToken = true`:
    - Gọi login Master App (`Apps/login`) với email/username/appID/clientID.
    - Lưu `accessToken` vào Redux (`updateToken`), lưu `userInfo`.
    - Gọi `Apps/menus` để lấy menu → duyệt menu nhiều cấp (`menulv2`, `menulv3`, `menulv4`) → lấy toàn bộ `idNum` có `status = "Y"` → `updateUserMenuFromMasterApp`.
    - Gọi `DomainPoultry.post('auth/info')` để lấy `userAccess` → lưu Redux, xác định `currentUnit` (ưu tiên unit đã lưu trong `localStorage`).
    - Khi lỗi: log error, set `valueAccessToken` với message chi tiết (bao gồm API name) và `status = false`.
  - Trả về `{ token, status }` cho `WrapperView` quyết định render.

- `src/Config.js`
  - Cấu hình `msalConfig` cho Azure AD:
    - `clientId`, `authority`, `redirectUri`, `postLogoutRedirectUri`.
    - `cacheLocation` = `sessionStorage`.
    - `loggerOptions` với `LogLevel` của MSAL.

---

## 3. Tech stack & dependency chính

### 3.1 React & CRA

- Khởi tạo từ Create React App, có `config-overrides.js` để custom webpack/babel nếu cần.
- Dùng alias `~` (cấu hình trong `jsconfig.json`) để import path ngắn: `~/Redux/store`, `~/Routes`, `~/DomainApi`, ...

### 3.2 Redux Toolkit

- Dùng `configureStore` và `createSlice`.
- Lợi ích:
  - Boilerplate ít, code rõ ràng.
  - Immer tích hợp, có thể mutate state trực tiếp trong reducer.
  - Tích hợp `createAsyncThunk` cho call API.

### 3.3 Routing (`react-router-dom` v6)

- Sử dụng `HashRouter as Router` để tránh cấu hình rewrite trên server.
- Dùng `Routes` / `Route`:
  - Mỗi route render thông qua `DefaultLayout` hoặc layout custom.
  - `RemoveAsteriskRedirect` xử lý redirect khi path không hợp lệ.

### 3.4 Azure AD & MSAL

- Thư viện:
  - `@azure/msal-browser`: core MSAL.
  - `@azure/msal-react`: integration với React: `MsalProvider`, `AuthenticatedTemplate`, `UnauthenticatedTemplate`.
- Luồng:
  - App wrap bởi `MsalProvider`.
  - Layout chính nằm trong `AuthenticatedTemplate`.
  - Login page nằm trong `UnauthenticatedTemplate`.
  - `ApiToken` dựa vào `instance.getActiveAccount()` để call các API nghiệp vụ.

### 3.5 Axios & toast

- `DomainApi`, `DomainPoultry`, `DomainMasterApp`: tách domain backend.
- `apiClient`: interceptor chung cho token + xử lý lỗi hiển thị toast.

### 3.6 Reporting (Bold Reports)

- Sử dụng các package:
  - `@boldreports/javascript-reporting-controls`.
  - `@boldreports/react-reporting-components`.
- Import script & css trong `App.js`.
- Các màn report hiện đang tạm comment trong `reportRoutes`, có thể enable khi cần.

---

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

1. Build app ra thư mục `web-build`:
   - (Theo README hiện tại: `npm build` – cần đảm bảo script trong `package.json` mapping đúng đến `react-scripts build` hoặc script custom.)
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
├─ README.md            # Tài liệu kỹ thuật (file hiện tại)
└─ Document.md          
```

---

## 6. Hướng dẫn mở rộng & best practices

### 6.1 Thêm API mới

1. Nếu API thuộc domain chung:
   - Dùng `apiClient` (import từ `~/DomainApi/apiClient`).
2. Nếu API thuộc domain Poultry hoặc Master App khác:
   - Dùng trực tiếp `DomainPoultry` hoặc `DomainMasterApp` nếu cần xử lý khác biệt.
3. Tạo async thunk mới (nếu cần lưu state toàn cục):
   - Định nghĩa trong file tương ứng trong `Redux/FetchApi/...` hoặc trong `Reducer/Thunk.js`.
   - Thêm xử lý `pending/fulfilled/rejected` trong `extraReducers`.
4. Update UI:
   - Dùng `useSelector` để lấy data, `useDispatch` để gọi thunk.

### 6.2 Thêm màn hình (page) mới

1. Tạo component trong `src/Pages/...`.
2. Đăng ký route trong `src/Routes/index.js`:
   - Thêm vào group phù hợp (`masterRoutes`, `transactionRoutes`, `reportRoutes` hoặc `otherRoutes`).
   - Chú ý:
     - `path`: unique.
     - `menuid`: phải trùng với `idNum` tương ứng từ Master App (để control hiển thị theo quyền).
     - `groupid`: map với group menu.
3. Nếu cần quyền từ Master App:
   - Đảm bảo `menuid` nằm trong danh sách `ids` do hàm `getAllIdNums` thu thập.

### 6.3 Làm việc với quyền & đơn vị (unit)

- Quyền được backend trả về qua `userAccess` từ `DomainPoultry.post('auth/info')`.
- `currentUnit` được xác định từ:
  - `localStorage['Unit']` nếu còn hợp lệ.
  - Hoặc phần tử đầu tiên trong `userAccess.units`.
- Khi thay đổi unit trong UI, nên:
  - Cập nhật Redux (`updateCurrentUnit`).
  - Ghi lại `localStorage['Unit']` để giữ trạng thái cho lần login sau.

### 6.4 Xử lý lỗi & thông báo

- Ưu tiên để axios interceptor xử lý lỗi chung (toast).
- Với lỗi đặc biệt (business rule):
  - Sử dụng `dialogError` trong Redux (`updateDialogError`) để bật dialog confirm/alert trên UI.

### 6.5 I18n

- Sử dụng `i18next` và `I18nextProvider` trong `App.js`.
- Khi thêm text mới:
  - Dùng key như `'menu-acc-group'`, `'menu-profile'`...
  - Khai báo mapping trong file ngôn ngữ tương ứng.

---

## 7. Ghi chú bảo trì

- Khi thay đổi cấu hình Azure AD (`clientId`, `redirectUri`), cần đồng bộ giữa:
  - `src/Config.js`.
  - Azure portal (App registration, Redirect URIs).
- Khi thêm domain backend mới:
  - Cập nhật `.env` với biến `REACT_APP_API_URL_...` tương ứng.
  - Thêm axios instance mới (nếu cần) trong `DomainApi/index.js`.
- Khi refactor Redux:
  - Giữ nguyên `initialState` các field quan trọng (`token`, `userInfo`, `userAccess`, `currentUnit`) để không phá luồng login.

Tài liệu này chỉ mô tả phần frontend. Mọi thay đổi lớn về API contract cần được align với team backend và cập nhật lại phần mô tả API/flow trong document này.

