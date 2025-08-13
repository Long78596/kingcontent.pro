import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { FaComment, FaHeart, FaShare } from 'react-icons/fa';
import { nFormatter, OK } from '../../../configs';
import { douyinService } from '../../../services/douyin';
import LoadingApp from '../../LoadingApp';

const DetailDouyin = ({ open, setOpen, obj }) => {
  const [isLinkVideo, setIsLinkVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDetailVideo = async (video_id) => {
      setIsLoading(true);
      const res = await douyinService.getDetailVideo(video_id);
      if (res.status === OK) {
        setIsLinkVideo(res.data.data.video);
      }
      setIsLoading(false);
    };
    if (obj && obj.video_id) {
      getDetailVideo(obj.video_id);
    }
  }, [obj]);

  return (
    <>
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-auto max-w-md transform overflow-hidden rounded-md bg-white p-6 text-center align-middle shadow-xl transition-all">
                  {isLoading && (
                    <div
                      className="text-center flex justify-center items-center"
                      style={{ height: '500px', width: '300px' }}
                    >
                      <LoadingApp />
                    </div>
                  )}
                  {!isLoading && isLinkVideo && (
                    <div className="iframe-placeholder">
                      <video
                        src={`https://v3.api.kingcontent.pro/api/v1/user/media/bypass-cors?url=${isLinkVideo}&type=video`}
                        height={500}
                        allow="autoplay; encrypted-media"
                        autoPlay
                        controls
                        crossOrigin="anonymous"
                        playsInline={true}
                      />
                    </div>
                  )}

                  <div className="flex justify-between mt-1">
                    {/* like icon */}
                    <div className="flex items-center gap-2">
                      <FaHeart size={24} />
                      <span>{nFormatter(obj?.likes)}</span>
                    </div>
                    {/* comment icon */}
                    <div className="flex items-center gap-2">
                      <FaComment size={24} />
                      <span>{nFormatter(obj?.comments)}</span>
                    </div>
                    {/* share icon */}
                    <div className="flex items-center gap-2">
                      <FaShare size={24} />
                      <span>{nFormatter(obj?.shares)}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={setOpen}
                    >
                      Đóng
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default DetailDouyin;
