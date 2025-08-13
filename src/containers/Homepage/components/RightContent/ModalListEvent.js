import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SingleContent from '../../../../components/Schedules/SingleContent';
import {
  getEventContents,
  setIsShowFinalStep,
  setSelectedScheduleContent,
  setShowSourceIdeasPopup,
} from '../../../../store/actions/Schedules';
import { TYPE_GO_CHAT } from '../../../../utils/utilityFunc';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import DialogDetailPost from '../../../../components/Schedules/SingleContent/dialogPostDetail';
// import DialogDetailPost from '../../../../components/Schedules/SingleContent/index';
import { setContentDetailToShow } from '../../../../store/actions/Contents/contentActions';
const ModalListEvent = (props) => {
  const {
    event,
    setIsShowModal,
    isShowModal,
    type = TYPE_GO_CHAT,
    events,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventContents: contents = [] } = useSelector(
    (state) => state.schedules
  );

  const handleActionShowPopup = (elt) => {
    dispatch(setContentDetailToShow(elt));
  };

  const handleAddToSchedule = (elt) => {
    dispatch(
      setSelectedScheduleContent({
        ...elt,
        source_type: 'system',
        is_event_content: true,
        //   cat_id: event?.event_cat_id,
      })
    );
    dispatch(setIsShowFinalStep(true));
    dispatch(setShowSourceIdeasPopup(false));
    history.push('/lich-dang-bai');
  };

  useEffect(() => {
    dispatch(getEventContents(44, 1));
  }, []);

  return (
    <Transition appear show={isShowModal} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-9999 max-w-xl mt-1"
        style={{ maxWidth: '70%' }}
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
                className="w-3/4 transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                style={{ height: '50%' }}
              >
                <div className="p-2">
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2`}
                  >
                    {events.map((_elt, index) => (
                      <SingleContent
                        content_type="system"
                        // isAuto={isAuto}
                        // cat_id={event?.event_cat_id}
                        // handleAddToWaitingList={handleAddToWaitingList}
                        handleAddToSchedule={handleAddToSchedule}
                        handleActionShowPopup={handleActionShowPopup}
                        key={index}
                        item={_elt}
                        isShowEditContentBtn={true}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-600 text-white rounded-lg shadow-md p-3"
                    onClick={() => setIsShowModal(false)}
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

export default ModalListEvent;
