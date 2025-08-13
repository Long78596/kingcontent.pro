import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';
import { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  actionUpdateStep1,
  createContentToHomepage,
  resetCreateContent,
  writeContentHomeToCreateScreen,
} from '../../../../store/actions/createContent';
import {
  TYPE_GO_CHAT,
  TYPE_GO_CONTENT,
  getCurrentYear,
} from '../../../../utils/utilityFunc';
import PerfectScrollbar from 'react-perfect-scrollbar';
const ModalEvent = (props) => {
  const { event, setIsShowModal, isShowModal, type = TYPE_GO_CHAT } = props;
  const {
    title = '',
    event_date = '',
    event_icon = '',
    description = '',
  } = event;
  const history = useHistory();
  const dispatch = useDispatch();
  const actionWriteContent = (question = '', content, image) => {
    if (type === TYPE_GO_CHAT) {
      dispatch(
        createContentToHomepage({
          status: true,
          question: question,
          type: TYPE_GO_CHAT,
        })
      );
      //reset content => replace content
      dispatch(actionUpdateStep1(true));
      dispatch(resetCreateContent());
      // ======================
      history.push('/tao-content');
    } else {
      //reset content => replace content
      dispatch(actionUpdateStep1(true));
      dispatch(resetCreateContent());
      // ======================
      dispatch(createContentToHomepage({ status: true, question, type }));
      dispatch(writeContentHomeToCreateScreen(content, image, type));
      history.push('/tao-content');
    }
  };
  return (
    <Transition appear show={isShowModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-lg mt-1"
        style={{ maxWidth: '50%' }}
        onClose={() => setIsShowModal(false)}
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
                <div className="flex items-center gap-5">
                  <div className="eventThumbnail text-center px-3">
                    <img
                      src={event_icon}
                      alt="title"
                      className="rounded-full"
                      width={200}
                      height={200}
                    />
                  </div>
                  <PerfectScrollbar className="eventDetail max-h-96">
                    <h5 className="font-bold text-base">{title}</h5>
                    <p className="mt-2 italic text-gray-500">
                      {moment(event_date).format('DD-MM') +
                        '-' +
                        getCurrentYear()}
                    </p>
                    <span
                      dangerouslySetInnerHTML={{ __html: description }}
                    ></span>
                  </PerfectScrollbar>
                </div>
                <div className="flex justify-end gap-5 mt-3">
                  {type === TYPE_GO_CONTENT && (
                    <button
                      onClick={() => history.push('/dang-thinh-hanh')}
                      className="bg-green-500 px-3 h-10 rounded-md text-white"
                    >
                      Đến trang đang thịnh hành
                    </button>
                  )}
                  <button
                    onClick={() =>
                      actionWriteContent(title, description, event_icon)
                    }
                    className="bg-blue-400 px-3 h-10 rounded-md text-white"
                  >
                    Soạn thảo
                  </button>
                  <button
                    onClick={() => setIsShowModal(false)}
                    className="bg-red-400 px-3 h-10 rounded-md text-white"
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
  );
};

export default ModalEvent;
