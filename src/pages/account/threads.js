import { DataView } from 'primereact/dataview';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import React, { useEffect, useState } from 'react';
import ReactFacebookLogin from 'react-facebook-login';
import { LoginFBService } from '../../services/loginFB';
import { userServices } from '../../services/users';
import { useDispatch, useSelector } from 'react-redux';
import { loginThreads } from '../../helpers/threads';
import { threadsService } from '../../services/threads';
import { OK } from '../../configs';
import { convertInstagramLink } from '../../helpers';
import auth from '../../utils/auth';
import { toast } from 'react-toastify';

const Threads = () => {
  const { user } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const { threads_access_token = '', threads_id = '' } = user || {};

  const [isLoadingThreadsInfo, setIsLoadingThreadsInfo] = useState(false);
  const [threadUserInfo, setThreadUserInfo] = useState(null);

  useEffect(() => {
    if (threads_access_token && threads_id) {
      setIsLoadingThreadsInfo(true);
      threadsService.getMyInfo().then((res) => {
        if (res.status === OK) {
          const { data = null } = res.data;
          setThreadUserInfo(data);
        }
        setIsLoadingThreadsInfo(false);
      });
    } else {
      setThreadUserInfo(null);
    }
  }, [threads_access_token, threads_id]);

  const onClickDetail = (username) => {
    window.open(`https://www.threads.net/@${username}`);
  };

  const onClickDisconnect = async () => {
    const res = await threadsService.disconnectThreads();
    if (res.status === OK) {
      setThreadUserInfo(null);
      // update user in store
      const userInfo = auth.getUserInfo();
      userInfo.threads_access_token = '';
      userInfo.threads_id = '';
      auth.setUserInfo(userInfo, true);
      toast.success('Ngắt kết nối thành công');
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center mb-2">
        {isLoadingThreadsInfo ? (
          <h3 className="mb-4 text-base font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
            Đang kiểm tra thông tin tài khoản Threads...
          </h3>
        ) : (
          <div>
            {threadUserInfo ? (
              <div>
                <h3 className="font-bold text-base mb-3 uppercase">Threads</h3>
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
                    onClick={loginThreads}
                  >
                    Kết nối lại
                  </button>
                </div>
                <div
                  className="col-12 rounded-md border-b border-dashed cursor-pointer hover:bg-gray-100"
                  onClick={() => onClickDetail(threadUserInfo.username)}
                >
                  <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4 items-center">
                    {threadUserInfo.threads_profile_picture_url ? (
                      <img
                        src={convertInstagramLink(
                          threadUserInfo.threads_profile_picture_url
                        )}
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
                            {threadUserInfo.name}
                          </p>
                        </a>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold font-md">
                            {threadUserInfo.username}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold text-base mb-3 uppercase">Threads</h3>
                <button
                  onClick={loginThreads}
                  className="text-white px-6 py-4 rounded-3xl uppercase bg-black text-sm"
                >
                  Đăng nhập Threads
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Threads;
