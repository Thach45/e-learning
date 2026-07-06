<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/your_username/LearnHub">
    <!-- You can add a logo image here if you have one -->
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

  <h3 align="center">LearnHub Frontend</h3>

  <p align="center">
    Nền tảng học trực tuyến hiện đại với trải nghiệm tối ưu
    <br />
    <a href="https://github.com/your_username/LearnHub"><strong>Khám phá tài liệu »</strong></a>
    <br />
    <br />
    <a href="https://github.com/your_username/LearnHub">View Demo</a>
    ·
    <a href="https://github.com/your_username/LearnHub/issues">Báo lỗi</a>
    ·
    <a href="https://github.com/your_username/LearnHub/issues">Yêu cầu tính năng</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Mục lục (Table of Contents)</summary>
  <ol>
    <li>
      <a href="#about-the-project">Về dự án (About The Project)</a>
      <ul>
        <li><a href="#built-with">Được xây dựng bằng (Built With)</a></li>
      </ul>
    </li>
    <li>
      <a href="#features">Các chức năng chính (Features)</a>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu (Getting Started)</a>
      <ul>
        <li><a href="#prerequisites">Yêu cầu hệ thống (Prerequisites)</a></li>
        <li><a href="#installation">Cài đặt (Installation)</a></li>
      </ul>
    </li>
    <li><a href="#folder-structure">Cấu trúc thư mục (Folder Structure)</a></li>
    <li><a href="#roadmap">Định hướng (Roadmap)</a></li>
    <li><a href="#contributing">Đóng góp (Contributing)</a></li>
    <li><a href="#contact">Liên hệ (Contact)</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Đây là mã nguồn frontend cho hệ thống **LearnHub** - Nền tảng học trực tuyến hiện đại. Dự án được xây dựng với kiến trúc hướng Component, hiệu năng cao và thiết kế lấy cảm hứng từ hệ thống thiết kế (Design System) của Notion.

Giao diện của LearnHub được thiết kế chi tiết theo phong cách Notion (tham khảo chi tiết trong `DESIGN.md`), nổi bật với:
- **Typograpghy:** Notion Sans (dựa trên Inter).
- **Bảng màu:** Brand Navy, Primary Purple, cùng các thẻ màu pastel (Peach, Rose, Mint, Lavender).
- **Component:** Các components dạng Card, Badge, Modal, Input được thiết kế tỉ mỉ, bo góc chuẩn mực (8px cho button, 12px cho cards).

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>

### Built With

Dự án sử dụng các công nghệ hiện đại nhất trong hệ sinh thái React:

* [![React][React.js]][React-url]
* [![TypeScript][TypeScript.ts]][TypeScript-url]
* [![Vite][Vite.js]][Vite-url]
* [![TailwindCSS][Tailwind.css]][Tailwind-url]
* [![ReactQuery][ReactQuery.com]][ReactQuery-url]

Các thư viện nổi bật khác:
- **Routing:** React Router v7
- **Video Player:** Vidstack & hls.js (Hỗ trợ phát video streaming HLS hiệu năng cao)
- **Data Visualization:** Recharts
- **HTTP Client:** Axios
- **UI Components & Icons:** Lucide React, Sonner (Toasts)

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- FEATURES -->
## Features

Hệ thống cung cấp trải nghiệm học tập toàn diện với các phân hệ chính:

- **Hệ thống Học tập (Learning Section):** Hỗ trợ phát video khoá học tốc độ cao (HLS) qua Vidstack, ghi nhận tiến trình học tập.
- **Dành cho Học viên (Student):** 
  - Đăng ký/Đăng nhập, Quản lý tài khoản.
  - Xem danh sách khoá học, chi tiết khoá học.
  - Giỏ hàng (Cart) và Thanh toán (Checkout/Payment).
  - Quản lý khoá học đã mua (My Courses) và Lịch sử đơn hàng (My Orders).
  - Tham gia thảo luận trong Cộng đồng (Community).
- **Dành cho Giảng viên (Instructor):** 
  - Phân hệ riêng (`/instructor`) để quản lý khoá học, thống kê doanh thu và tương tác với học viên.
- **Dành cho Quản trị viên (Admin):** 
  - Trang quản trị (`/admin`) kiểm soát toàn bộ hệ thống (người dùng, khoá học, giao dịch, thống kê báo cáo sử dụng Recharts).
- **Phân quyền (Permissions):** Giao diện tự động thay đổi tuỳ theo vai trò (Role) của người dùng hiện tại (Admin, Instructor, Student).

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

Dưới đây là hướng dẫn để bạn có thể cài đặt và chạy thử dự án ở môi trường local.

### Prerequisites

* npm (hoặc yarn)
  ```sh
  npm install npm@latest -g
  ```
* Node.js (phiên bản 18+ khuyến nghị)

### Installation

1. Clone kho lưu trữ
   ```sh
   git clone https://github.com/your_username/LearnHub.git
   ```
2. Cài đặt các gói NPM
   ```sh
   npm install
   ```
3. Cấu hình môi trường
   Tạo file `.env` ở thư mục gốc (ngang hàng `package.json`)
   ```js
   VITE_API_BASE_URL=http://localhost:3000/api # Trỏ đến backend e-learning-nest
   ```
4. Khởi chạy server phát triển
   ```sh
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ mặc định: `http://localhost:5173`

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- FOLDER STRUCTURE -->
## Folder Structure

Cấu trúc thư mục mã nguồn chính trong `src`:

```
src/
├── api/          # Nơi chứa các hàm gọi API (sử dụng axios)
├── assets/       # Tài nguyên tĩnh (images, icons)
├── components/   # Các thành phần giao diện dùng chung (UI components)
├── custome/      # Các custom module/components
├── hooks/        # Các custom hooks (vd: xử lý logic tái sử dụng, gọi React Query)
├── layouts/      # Layout components (Header, Footer, Sidebar, Admin Layout...)
├── pages/        # Các trang chính của ứng dụng
├── types/        # Định nghĩa các TypeScript interfaces/types
├── utils/        # Các hàm tiện ích (format date, tiền tệ, validation)
├── App.tsx       # Component gốc, cấu hình Router & Providers
└── main.tsx      # Entry point của ứng dụng
```

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- ROADMAP -->
## Roadmap

- [x] Tích hợp hệ thống Design Notion
- [x] Xây dựng luồng học tập với Vidstack (HLS)
- [ ] Thêm tính năng đa ngôn ngữ (Multi-language)
- [ ] Tối ưu SEO và Performance

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Bất kỳ đóng góp nào của bạn cũng được đánh giá cao và giúp cho cộng đồng mã nguồn mở trở thành một nơi tuyệt vời hơn.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- CONTACT -->
## Contact

Tên của bạn - [@your_twitter](https://twitter.com/your_twitter) - email@example.com

Project Link: [https://github.com/your_username/LearnHub](https://github.com/your_username/LearnHub)

<p align="right">(<a href="#readme-top">quay lại đầu trang</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/your_username/LearnHub.svg?style=for-the-badge
[contributors-url]: https://github.com/your_username/LearnHub/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/your_username/LearnHub.svg?style=for-the-badge
[forks-url]: https://github.com/your_username/LearnHub/network/members
[stars-shield]: https://img.shields.io/github/stars/your_username/LearnHub.svg?style=for-the-badge
[stars-url]: https://github.com/your_username/LearnHub/stargazers
[issues-shield]: https://img.shields.io/github/issues/your_username/LearnHub.svg?style=for-the-badge
[issues-url]: https://github.com/your_username/LearnHub/issues
[license-shield]: https://img.shields.io/github/license/your_username/LearnHub.svg?style=for-the-badge
[license-url]: https://github.com/your_username/LearnHub/blob/master/LICENSE.txt
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript.ts]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Vite.js]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind.css]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[ReactQuery.com]: https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white
[ReactQuery-url]: https://tanstack.com/query/v5
