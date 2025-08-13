import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const Page = (props) => {
  const { user } = useSelector((state) => state.userReducer);
  const history = useHistory();

  const onClickLink = () => {
    window.open('https://m.me/kingcontentdream', '_blank');
  };
  const onClickAccountLink = () => {
    history.push('/user-info');
  };

  return (
    <section className="z-10 -ml-18 px-2">
      <div className="bg-red-200 p-3 rounded-md mb-2 text-center leading-6 text-base hidden">
        Kingcontent Dream bản beta, đang trong quá trình thử nghiệm nên có thể
        vẫn còn những lỗi nhỏ. Rất mong nhận được sự thông cảm và góp ý nhẹ
        nhàng, yêu thương từ quý khách để công cụ ngày càng tốt hơn ạ! Link góp
        ý{' '}
        <label
          className="cursor-pointer italic font-bold"
          onClick={() => onClickLink()}
        >
          TẠI ĐÂY
        </label>
      </div>
      {user?.is_fb_token_valid === false && (
        <div className="bg-red-200 p-3 rounded-md mb-2 text-center leading-6 text-base">
          CHÚ Ý: Tài khoản Facebook của bạn đã mất kết nối với KingContent. Vui
          lòng kết nối lại
          <label
            className="cursor-pointer italic uppercase font-bold underline"
            onClick={() => onClickAccountLink()}
          >
            TẠI ĐÂY
          </label>{' '}
          để tiếp tục lên lịch đăng bài
        </div>
      )}
      {props.children}
    </section>
  );
};

export default Page;
