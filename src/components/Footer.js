import React from 'react';
import logoMark from '../assets/images/logoSaleNoti.png';

const Footer = () => {
  return (
    <footer
      id="footer"
      className="w-full px-4 flex items-center bg-white shadow-zenius overflow-x-hidden font-bold justify-center"
    >
      <div className="flex w-10/12">
        <div className="lg:w-4/12 sm:w-1/2 w-full p-5 leading-7">
          <p>Một sản phẩm của ASV Software</p>
          <div className="text-center w-1/2 p-0">
            <img
              src={logoMark}
              alt="Đã thông báo Bộ Công Thương"
              className="max-w-full"
            />
          </div>
          <ul className="list-disc">
            <li>
              <a
                href="https://kingcontent.pro/chinh-sach-bao-mat"
                target="_blank"
                className="underline"
              >
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a
                href="https://kingcontent.pro/huong-dan-su-dung"
                target="_blank"
                className="underline"
              >
                Hướng dẫn sử dụng
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:w-4/12 sm:w-1/2 w-full p-5 leading-7">
          <p>
            THỜI GIAN LÀM VIỆC <br /> Từ 7h30 đến 17h30 các ngày trong tuần{' '}
            <br />
            Hotline: 0704.499.995 (Mr. Phước)
          </p>
          <a href="mailto:kingcontent.pro@gmail.com" target="_blank">
            kingcontent.pro@gmail.com
          </a>
        </div>
        <div className="lg:w-4/12 sm:w-1/2 w-full p-5 leading-7">
          <p>
            Kingcontent.pro chỉ là công cụ giúp bạn tổng hợp các nguồn content
            vào một trang web duy nhất. Việc sử dụng lại content này vào bất kì
            mục đích nào khác do người dùng tự chịu trách nhiệm trước tác giả và
            pháp luật quy định.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
