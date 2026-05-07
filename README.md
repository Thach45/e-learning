# LearnHub (Frontend)

Ứng dụng web học trực tuyến — React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, React Router. Gọi API backend trong `e-learning-nest`.

## Scripts

```bash
npm install
npm run dev      # development server
npm run build    # production build
npm run preview  # xem bản build
npm run lint
```

## Cấu hình

- URL API và cookie/token: cấu hình trong `.env` của frontend (ví dụ base URL axios) cho khớp backend.
- Backend phải cho phép origin của frontend qua biến `FRONTEND_URL` và CORS.

## Tài liệu API

Luồng nghiệp vụ và endpoint tổng quan: [README gốc repo](../README.md) và [README backend](../e-learning-nest/README.md).
