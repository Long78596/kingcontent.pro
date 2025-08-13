import { XIcon } from '@heroicons/react/outline';
import moment from 'moment';
import { TYPE_GO_CHAT, getCurrentYear } from '../../../../utils/utilityFunc';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import {
  actionUpdateStep1,
  createContentToHomepage,
  resetCreateContent,
  toggleEditorText,
  updateProps,
} from '../../../../store/actions/createContent';
import { useHistory } from 'react-router-dom';
import Image from '../../../../components/CategoriesContent/CategonesContentltem/Image';
// import Image from '../../../../components/CategoriesContent/CategoriesContentItem/Image';
import { FiEdit2, FiEdit3, FiX } from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { actionPushContentToCreateContentScreen } from '../../../../store/actions/homepage';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import { isArrayEmpty } from '../../../../configs';
const PopupDetailContentPlan = ({
  isOpen,
  item,
  setIsOpenDetail,
  showTool = false,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const pushToScreenCreateContent = (content, medias) => {
    //reset content => replace content
    dispatch(actionUpdateStep1(true));
    dispatch(resetCreateContent());
    dispatch(actionPushContentToCreateContentScreen(content, medias));
    history.push('/tao-content');
  };
  const videoLinkMP4Regex = /\.(mp4|mov|avi|mkv|wmv|flv)$/i;
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-lg mt-1"
        style={{ maxWidth: '50%' }}
        onClose={() => setIsOpenDetail(false)}
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
              <Dialog.Panel
                className="w-2/4 transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                style={{ height: '50%' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold  uppercase">CHI TIẾT BÀI ĐĂNG</h2>
                  <div className="flex gap-2">
                    {showTool && (
                      <button
                        className="rounded-full p-1 bg-gray-400"
                        title="Soạn thảo bài đăng"
                        onClick={() =>
                          pushToScreenCreateContent(item.post_text, item.medias)
                        }
                      >
                        <FiEdit3 color="#fff" size={25} />
                      </button>
                    )}
                    <button
                      className="rounded-full p-1 bg-gray-400"
                      onClick={() => setIsOpenDetail(false)}
                    >
                      <FiX size={25} color="#fff" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-4/12">
                    {videoLinkMP4Regex.test(item?.image) ? (
                      <>
                        <ReactPlayer
                          className="react-player rounded-md -ml-5"
                          height={'100'}
                          width={200}
                          url={(item?.image && item?.image[0]) || ''}
                          playing={false}
                        />
                      </>
                    ) : (
                      <Image medias={item.image || item.medias} />
                    )}
                  </div>
                  <PerfectScrollbar className="w-8/12 max-h-96">
                    <p
                      className="mt-2"
                      dangerouslySetInnerHTML={{ __html: item.post_text }}
                    ></p>
                    <div>
                      <p className="mt-2 italic text-gray-500 font-bold ">
                        {moment(item.created).format('YYYY-DD-MM')}
                      </p>
                    </div>
                  </PerfectScrollbar>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupDetailContentPlan;
