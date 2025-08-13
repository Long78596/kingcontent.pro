import { useEffect, useState } from 'react';
import { connectTikTokAccount } from '../../helpers/tiktok';
import { useSelector } from 'react-redux';
import { tiktokService } from '../../services/tiktok';
import { OK } from '../../configs';
import { toast } from 'react-toastify';
import auth from '../../utils/auth';


const TikTokAccount = () => {
  const { user } = useSelector((state) => state.userReducer);
  const { tiktok_access_token } = user || {};

  const [isLoadingTiktokInfo, setIsLoadingTiktokInfo] = useState(false);
  const [tiktokUserInfo, setTiktokUserInfo] = useState(null);

  useEffect(() => {
    if (tiktok_access_token) {
      setIsLoadingTiktokInfo(true);
      tiktokService.getTikTokUserInfo().then((res) => {
        if (res.status === OK) {
          const { data = null } = res.data;
          setTiktokUserInfo(data);
        }
        setIsLoadingTiktokInfo(false);
      });
      setIsLoadingTiktokInfo(false);
    } else {
      setTiktokUserInfo(null);
    }
  }, [tiktok_access_token]);

  const onClickDisconnect = async () => {
    const res = await tiktokService.disconnectTikTok();
    if (res.status === OK) {
      setTiktokUserInfo(null);
      // update user in store
      const userInfo = auth.getUserInfo();
      userInfo.tiktok_access_token = '';
      auth.setUserInfo(userInfo, true);
      toast.success('Ngắt kết nối thành công');
    }
  };

  const onClickDetail = (username) => {
    window.open(`https://www.tiktok.com/@${username}`);
  };

  return (
    <div>
      {isLoadingTiktokInfo ? (
        <h3 className="mb-4 text-base font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          Đang kiểm tra thông tin tài khoản TikTok...
        </h3>
      ) : (
        <div>
          {tiktokUserInfo ? (
            <div>
              <h3 className="font-bold text-base mb-3 uppercase">TikTok</h3>
              {/* button disconnect FB */}
              <div className="flex mb-3 gap-3">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-3xl uppercase font-bold text-sm"
                  onClick={onClickDisconnect}
                >
                  Ngắt kết nối
                </button>
                <button
                  className="text-white px-4 py-5 rounded-3xl uppercase font-bold bg-black text-sm"
                  onClick={connectTikTokAccount}
                >
                  Kết nối lại
                </button>
              </div>
              <div
                className="col-12 rounded-md border-b border-dashed cursor-pointer hover:bg-gray-100"
                onClick={() => onClickDetail(tiktokUserInfo.username)}
              >
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 items-center">
                  {tiktokUserInfo.avatar_url ? (
                    <img
                      src={tiktokUserInfo.avatar_url}
                      alt="Avatar"
                      className="w-16 h-16 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round rounded-full"
                    />
                  ) : (
                    <span className="w-16 h-16 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round rounded-full bg-gray-200">
                      &nbsp;
                    </span>
                  )}
                  <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                    <div className="flex flex-col align-items-center sm:align-items-start gap-3">
                      <a
                        href="#"
                        target="_blank"
                        className="cursor-pointer hover:underline"
                      >
                        <p className="text-sm font-bold text-900">
                          {tiktokUserInfo.display_name}
                        </p>
                      </a>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold font-md">
                          {tiktokUserInfo.bio_description}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-bold text-base mb-3 uppercase">TikTok</h3>
              <button
                className="text-white px-4 py-5 rounded-3xl uppercase font-bold bg-black text-sm"
                onClick={connectTikTokAccount}
              >
                Kết nối TikTok
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TikTokAccount;
