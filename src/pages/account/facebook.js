import React, { Fragment, useEffect, useState } from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import ReactFacebookLogin from 'react-facebook-login';
import { FaTag } from 'react-icons/fa';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { LoginFBService } from '../../services/loginFB';
import { userServices } from '../../services/users';
import auth from '../../utils/auth';
import { OK } from '../../configs';
const ButtonLoginFB = styled.div`
  .kep-login-facebook {
    border-radius: 24px !important;
    width: auto;
    font-size: 0.8rem;
    white-space: nowrap;
  }
`;

const Facebook = (props) => {
  const { user } = props;
  const [fanpages, setFanpages] = useState([]);
  const [isAccessTokenFb, setIsAccessTokenFb] = useState(false);
  const [isLoadingListFb, setIsLoadingListFb] = useState(false);

  const getFangpageAndGroup = async () => {
    setIsLoadingListFb(true);
    const res = await userServices.getFpAndGr();
    if (res.status === OK) {
      if (!res.data.success) setIsAccessTokenFb(false);
      else if (res.data.data.fanpages.error) setFanpages([]);
      else {
        setFanpages(res.data.data.fanpages);
        setIsAccessTokenFb(true);
      }
    }
    setIsLoadingListFb(false);
  };

  const responseFacebook = async (response) => {
    const { error = null, status = null } = response;
    if (error || (status && status === 'unknown')) {
      toast.error('Đăng nhập không thành công');
    } else {
      const newUserInfo = {
        fb_email: response.email,
        fb_name: response.name,
        fb_picture: response.picture.data.url,
        fb_id: response.id,
        fb_access_token: response.accessToken,
      };
      const res = await LoginFBService.updateUser(newUserInfo);
      if (res.status === OK) {
        const currentUserInfo = auth.getUserInfo();
        currentUserInfo.facebook_id = response.id;
        currentUserInfo.access_token = response.accessToken;
        currentUserInfo.fb_name = response.name;
        auth.setUserInfo(currentUserInfo, true);
        getFangpageAndGroup();
        toast.success('Kết nối với Facebook thành công !');
      } else {
        toast.success('Kết nối với Facebook thất bại , vui lòng thử lại !');
      }
    }
  };
  const itemTemplate = (product) => {
    const onClickFanpage = (id) => {
      window.open(`https://www.facebook.com/${id}`, '_blank');
    };
    return (
      <div
        className="col-12 rounded-md border-b border-dashed cursor-pointer hover:bg-gray-100"
        onClick={() => onClickFanpage(product.id)}
      >
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img
            className="w-16 h-16 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round rounded-full"
            src={`https://graph.facebook.com/${product?.id}/picture?width=1000&height=1000`}
            alt={product?.name}
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-col align-items-center sm:align-items-start gap-3">
              <a
                href={`https://www.facebook.com/${product.id}`}
                target="_blank"
                className="cursor-pointer hover:underline"
              >
                <p className="text-sm font-bold text-900">{product.name}</p>
              </a>
              {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <FaTag size={15} />
                  <span className="font-semibold font-md">
                    {product.category}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2"></div>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (user.facebook_id) {
      getFangpageAndGroup();
    }
  }, []);

  const onClickDisconnect = async () => {
    const res = await LoginFBService.disconnectFb();
    if (res.status === OK) {
      setFanpages([]);
      // update user in store
      const userInfo = auth.getUserInfo();
      userInfo.facebook_id = '';
      userInfo.access_token = '';
      userInfo.fb_name = '';
      auth.setUserInfo(userInfo, true);
      setIsAccessTokenFb(false);
      toast.success('Ngắt kết nối thành công');
    }
  };

  return (
    <div>
      {(user?.facebook_id !== '' || user?.facebook_id !== null) &&
      isAccessTokenFb ? (
        <div className="flex px-2">
          <div className="card w-full">
            <h3 className="font-bold text-base mb-3 uppercase">Facebook</h3>
            {/* button disconnect FB */}
            <div className="flex mb-3 gap-3">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-3xl uppercase font-bold text-sm"
                onClick={onClickDisconnect}
              >
                Ngắt kết nối
              </button>
              <ButtonLoginFB>
                <ReactFacebookLogin
                  appId={`${process.env.FB_APP_ID}`}
                  autoLoad={false}
                  fields="name,email,picture"
                  scope={`${process.env.FB_APP_SCOPE}`}
                  version={`${process.env.FB_APP_API_VERSION}`}
                  callback={responseFacebook}
                  textButton="Kết nối lại"
                />
              </ButtonLoginFB>
            </div>
            <div className="max-h-schedule-contents border rounded-md p-3 w-full overflow-auto">
              {fanpages.length > 0 &&
                fanpages.map((item, index) => {
                  return <Fragment key={index}>{itemTemplate(item)}</Fragment>;
                })}
              {fanpages.length === 0 && (
                <div className="flex justify-center items-center h-40">
                  <span className="text-sm font-bold">
                    Bạn chưa làm quản trị viên của trang nào
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isLoadingListFb ? (
        <div className="flex flex-col items-center justify-center mb-2">
          <div>
            <h3 className="mb-4 text-base font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
              Đang tải dữ liệu từ Facebook...
            </h3>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mb-2">
          <div>
            <h3 className="mb-3 text-base font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
              Sử dụng dụng tài khoản Facebook để đăng nhập !
            </h3>
          </div>
          <ButtonLoginFB>
            <ReactFacebookLogin
              appId={`${process.env.FB_APP_ID}`}
              autoLoad={false}
              fields="name,email,picture"
              scope={`${process.env.FB_APP_SCOPE}`}
              version={`${process.env.FB_APP_API_VERSION}`}
              callback={responseFacebook}
              textButton="Kết nối với Facebook"
            />
          </ButtonLoginFB>
        </div>
      )}
    </div>
  );
};

export default Facebook;
