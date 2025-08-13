import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateContent } from '../../../../../services/createContent';
import defaultImage from '../../../../../assets/images/category_default_loading.png';
import { actionLoadingApp } from '../../../../../store/actions/loading';
import { FiFacebook } from 'react-icons/fi';
import {
  actionGetMyTopic,
  actionSelectMyTopic,
  saveChosenCategories,
} from '../../../../../store/actions/homepage';
import LoadingApp from '../../../../../components/LoadingApp';
import { toast } from 'react-toastify';
import { id } from 'date-fns/locale';
import { OK } from '../../../../../configs';
const PopupSelectCate = ({ isOpen, toggle }) => {
  const [loading, setLoading] = useState(false);
  const [parentListArr, setParentListArr] = useState([]);
  const [availabelData, setAvailabelData] = useState([]);
  const [topicSelect, setTopicSelect] = useState('');
  const dispatch = useDispatch();
  const { chosenCategories = [] } = useSelector((state) => state.homepage);
  const [listContent, setListContent] = useState([]);

  const handleGetAll = async () => {
    setLoading(true);
    setTopicSelect('all');
    const res = await CreateContent.getAllChildCategories();
    if (res.status === OK) {
      setListContent(res.data.data);
      setAvailabelData(res.data.data);
    }
    setLoading(false);
  };

  const handleGetChildCategories = async (ids) => {
    setLoading(true);
    setTopicSelect(ids);
    dispatch(actionLoadingApp(true));
    const res = await CreateContent.getChildCategories(ids);
    if (res.status === OK) {
      setListContent(res.data.data);
      setAvailabelData(res.data.data);
      dispatch(actionLoadingApp(false));
    }
    setLoading(false);
  };

  const handleChangeSearchCate = (input) => {
    if (input === '') handleGetAll();
    else {
      const result = availabelData.filter((_elt) =>
        _elt.cate_name.toLowerCase().includes(input)
      );
      setListContent(result);
    }
  };

  const handleSelectCategory = async (item) => {
    const isChosen = chosenCategories.find(
      (element) => element.cate_id === item.cate_id
    );
    if (isChosen) {
      toast.info('Chủ đề này đã được theo dõi');
    } else {
      dispatch(saveChosenCategories({ id: item.cate_id }));
      toggle();
    }
  };

  const renderWorkfolow = () => {
    return (
      <>
        {loading ? (
          <LoadingApp />
        ) : (
          <>
            {!loading && listContent.length !== 0 ? (
              <div
                className="grid grid-cols-4 gap-2 pr-2 pl-2  overflow-y-scroll overflow-x-hidden"
                style={{ height: '100%' }}
              >
                {listContent.map((_elt, index) => {
                  const { cate_id = 0, image_url = '', cate_name } = _elt;
                  const isChosen = chosenCategories.find(
                    (item) => item.cate_id === cate_id
                  );
                  return (
                    <div
                      className={`bg-gray-100 rounded-md mt-2 p-3 `}
                      key={index}
                    >
                      <div className="flex justify-center">
                        <div
                          className="thumbnail w-full h-40 block bg-no-repeat bg-cover"
                          style={{
                            backgroundImage: `url(${
                              image_url || defaultImage
                            })`,
                          }}
                        >
                          {' '}
                        </div>
                      </div>
                      <h3 className="font-bold text-center my-3 h-10 flex items-center justify-center">
                        {cate_name}
                      </h3>
                      <div className="flex justify-center my-2">
                        <button
                          className={`rounded-lg ${
                            isChosen ? 'bg-red-500' : 'bg-blue-500'
                          } hover:bg-red-500 py-2 px-3 text-white transition-all flex items-center gap-1`}
                          onClick={() => handleSelectCategory(_elt)}
                        >
                          <FiFacebook />
                          {isChosen ? (
                            <span>Đã theo dõi</span>
                          ) : (
                            <span>Theo dõi</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex justify-center">
                <span className="font-bold">Không có dữ liệu hiển thị</span>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  const renderSugTopic = () => {
    return (
      <div className="flex flex-wrap overflow-y-scroll gap-1 overflow-x-hidden">
        <div
          className={`border-2  hover:bg-gray-200 hover:text-black cursor-pointer rounded-lg p-4 ${
            topicSelect === 'all' ? 'bg-blue-500 text-white' : 'border-blue-200'
          }`}
          onClick={() => handleGetAll()}
        >
          Tất cả
        </div>
        {parentListArr.map((_elt, index) => (
          <div
            key={index}
            className={`border-2  hover:bg-gray-200 hover:text-black cursor-pointer rounded-lg p-4 ${
              topicSelect === _elt?.cate_id
                ? 'bg-blue-500 text-white'
                : 'border-blue-200'
            }`}
            onClick={() => handleGetChildCategories(_elt?.cate_id)}
          >
            {_elt?.cate_name}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const getParentCate = async () => {
      const res = await CreateContent.getParentCategory();
      if (res.status === OK) {
        let parentList = [];
        res.data.data.forEach((element) => {
          parentList.push(element);
        });
        const unique = parentList
          .map((e) => e['cate_id'])
          // store the keys of the unique objects
          .map((e, i, final) => final.indexOf(e) === i && i)
          // eliminate the dead keys & store unique objects
          .filter((e) => parentList[e])
          .map((e) => parentList[e]);
        setParentListArr(unique);
        handleGetAll();
      }
    };
    getParentCate();
  }, []);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          style={{ maxWidth: '80%' }}
          onClose={() => toggle}
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
                  className="w-full transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{ height: '80%' }}
                >
                  <div className="mt-2">
                    <h1 className="font-bold uppercase text-base">
                      Danh sách chủ đề
                    </h1>
                    <div className="flex mt-3">
                      <div className="w-1/3 max-h-70 overflow-y-scroll overflow-x-hidden">
                        {renderSugTopic()}
                      </div>
                      <div className="w-2/3 max-h-70">
                        <div className="flex gap-1 p-1">
                          <input
                            className="w-full p-2 rounded-md border-2 border-blue-300 outline-none"
                            placeholder="Nhập từ khoá tìm kiếm ..."
                            onChange={(e) =>
                              handleChangeSearchCate(e.target.value)
                            }
                          />
                        </div>
                        {renderWorkfolow()}
                      </div>
                    </div>
                  </div>

                  <div className="mt-16 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-blue-600 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 font-bold"
                      onClick={() => toggle()}
                    >
                      Quay lại
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

export default PopupSelectCate;
