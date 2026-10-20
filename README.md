# Một chiều bên em — Hạnh Hạnh 20/10

Bản 2: thiệp tương tác như một trò chơi lãng mạn, góc nhìn thứ nhất.

## Chạy

Giải nén toàn bộ và mở `index.html` bằng trình duyệt hiện đại. Không cần npm, máy chủ hoặc thư viện. Giữ nguyên thư mục `assets` cùng các file HTML/CSS/JS.

## Trải nghiệm

1. Thiệp đặt trên bàn cạnh cửa sổ nhìn ra biển lúc hoàng hôn.
2. Bấm **Mở thiệp** để cầm phong bì lên trước mắt.
3. Bấm dấu sáp: sáp vỡ rơi, nắp mở và tờ giấy được rút ra.
4. Đọc thư bằng nút mũi tên. Nội dung tự chia trang dựa trên chiều cao thực tế của giấy, không cần cuộn. Có thể dùng phím trái/phải.
5. Bấm **Nhận bó hoa của anh**, sau đó **Đưa tay nhận hoa**. Hai bàn tay nâng bó hoa lên theo góc nhìn thứ nhất.
6. Quay lại vẫn giữ trang thư đang đọc. Cất thư sẽ chạy ngược hiệu ứng và cho lựa chọn dán sáp hoặc để vậy thôi.
7. Có thể xem quà trực tiếp qua vùng **Quà của em** góc trên.

Nút Escape quay lại một bước. Trong lúc hiệu ứng đang chạy, nút tạm khóa để tránh thao tác chồng nhau. Hỗ trợ tùy chọn giảm chuyển động của thiết bị. Tải lại trang bắt đầu trải nghiệm mới.

## Upload GitHub Pages

Upload `index.html`, `style.css`, `script.js` và **toàn bộ thư mục assets** vào thư mục gốc repository. Bật Pages từ nhánh chứa mã nguồn và thư mục gốc. Khi triển khai hoàn tất, gửi URL website do Pages cung cấp, không gửi đường dẫn repository.

## Sửa nội dung

- Lời chúc: mảng `letterParagraphs` ở đầu `script.js`.
- Tên người nhận, tiêu đề và các lựa chọn: `index.html`.
- Giao diện, kích cỡ và tốc độ hiệu ứng: `style.css`.
- Ảnh nền: `assets/seaside.png`.
- Bó hoa và hai bàn tay, có kênh alpha: `assets/bouquet-hands.png`.

## Nguồn hình

Hai ảnh được tạo bằng công cụ tạo ảnh tích hợp cho project này, không dùng ảnh từ website bên ngoài.

Brief ảnh nền: khung cảnh game lãng mạn ở góc nhìn người đang ngồi, bàn gỗ trống cạnh cửa sổ với rèm trắng, nhìn ra biển xanh lúc hoàng hôn, ánh sáng ấm; không có chữ, người hoặc phong bì trong ảnh.

Brief ảnh hoa: tài nguyên tiền cảnh có nền trong suốt, đúng hai bàn tay và cẳng tay đi từ hai góc dưới vào, cầm bó hồng đỏ/hồng phấn gói giấy kem nơ đỏ theo góc nhìn của người cầm; ánh nắng chiều, không có mặt hoặc cơ thể.

## Kiểm tra

Đã kiểm tra cú pháp JavaScript và mô phỏng luồng trạng thái: cầm thiệp, phá sáp, đọc thư, nhận/hạ hoa, cất thư, dán lại, mở lại khi không dán. Kiểm tra chia trang ở bốn chiều cao giả lập: không mất chữ và nội dung nằm trong vùng chứa theo phép đo giả lập.

Chưa chạy kiểm tra trực quan trong trình duyệt trong phiên tạo này. Trước khi gửi, mở thử trên điện thoại theo đầy đủ luồng trên, thử xoay màn hình khi đang đọc và xem hoa. Ảnh được tải từ file cục bộ của project, không có phụ thuộc mạng bên ngoài.
