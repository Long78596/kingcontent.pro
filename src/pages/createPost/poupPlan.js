import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { FiEdit, FiSearch, FiTrash, FiX } from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
// @ts-ignore
import menuIcon from '../../assets/images/icon/plan/menu.png';
import Select from '../../components/select';
import {
  KEY_PLANS,
  KEY_PLAN_SELECT,
} from '../../reducers/createContent';
import {
  actionGetPlans,
  actionUpdateStep1,
  actionUpdateStep2,
  backEditorScreen,
  createContentToHomepage,
  resetCreateContent,
  updateProps,
} from '../../store/actions/createContent';
import PopupCreatePlan from './components/planCpn/popCreatePlan';
import PopupListContentPlan from './popupListContentPlan';
import { CreateContent } from '../../services/createContent';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { lineGadientReg } from './utility';
import { OK } from '../../configs';
// @ts-ignore
const PoupPlan = ({ isOpen = true }) => {
  const {
    step_1,
    step_2,
    [KEY_PLANS]: plans,
    isCreateToHomepage,
    textContent,
    // @ts-ignore
    imageSelect,
    [KEY_PLAN_SELECT]: plan,
  // @ts-ignore
  } = useSelector((state) => state.createPost);
  const filterList = [
    { id: 2, name: 'Cũ nhất', unavailable: false, type: 'OLD' },
    { id: 1, name: 'Mới nhất', unavailable: false, type: 'NEW' },
  ];
  const [inputValue, setInputValue] = useState('');
  const history = useHistory();
  const [selected, setSelected] = useState(filterList[0]);
  const [isOpenPopupCreate, setIsOpenPopupCreate] = useState(false);
  const [originalPlans, setOriginalPlans] = useState(plans);
  const [planEdit, setPlanEdit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();
  const rightPlanList = [
    'Bất động sản',
    'Nhà',
    'Xe các loại',
    'Vui cười , giải trí',
  ];

  const applySort = (sortType) => {
    if (sortType === 'NEW') {
      const filter = plans.sort((o1, o2) => {
        // @ts-ignore
        return new Date(o2.created_at) - new Date(o1.created_at);
      });
      dispatch(
        updateProps([
          {
            prop: KEY_PLANS,
            value: filter,
          },
        ])
      );
    } else {
      const filter = plans.sort((o1, o2) => {
        // @ts-ignore
        return new Date(o1.created_at) - new Date(o2.created_at);
      });
      dispatch(
        updateProps([
          {
            prop: KEY_PLANS,
            value: filter,
          },
        ])
      );
    }
  };

  const handleOnchangeSelect = (item) => {
    setSelected(item);
    applySort(item.type);
  };

  const handleSelectPlan = (plan) => {
    // reset label columns
    dispatch(
      updateProps([
        {
          prop: KEY_PLAN_SELECT,
          value: plan,
        },
      ])
    );
    dispatch(actionUpdateStep1(false));
    dispatch(actionUpdateStep2(true));
    if (isCreateToHomepage.status) {
      dispatch(actionUpdateStep2(false));
      dispatch(createContentToHomepage({ status: false }));
    }
  };

  const handleSearchPlan = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== '' && value) {
      const filterItem = originalPlans.filter((_elt) => {
        const { name = '', hashtag = '' } = _elt;
        return name
          ? name.toLowerCase().includes(value.toLowerCase())
          : false || hashtag
          ? hashtag.toLowerCase().includes(value.toLowerCase())
          : false;
      });
      dispatch(
        updateProps([
          {
            prop: KEY_PLANS,
            value: filterItem,
          },
        ])
      );
      // applySort(selected.type);
    } else {
      dispatch(
        updateProps([
          {
            prop: KEY_PLANS,
            value: originalPlans,
          },
        ])
      );
    }
  };

  const handleDeletePlan = async (id) => {
    confirmAlert({
      title: 'Cảnh báo !',
      // @ts-ignore
      message: (
        <span className="warning-content">
          Bạn có chắc chắn muốn xoá kế hoạch này không? Nếu xoá toàn bộ content
          bên trong sẽ bị xoá mà không thể phục hồi!
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            const res = await CreateContent.deletePlan(id);
            if (res.status === OK) {
              const filterItem = plans.filter((_elt) => _elt.id !== id);
              dispatch(
                updateProps([
                  {
                    prop: KEY_PLANS,
                    value: filterItem,
                  },
                ])
              );
              dispatch(actionGetPlans(setOriginalPlans));
              toast.success('Xoá kế hoạch thành công !');
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
    });
  };
  const handleEditPlan = async (item) => {
    setIsEdit(true);
    setPlanEdit(item);
    setIsOpenPopupCreate(true);
  };
  useEffect(() => {
    dispatch(actionGetPlans(setOriginalPlans));
  }, []);

  return (
    <>
      <Transition appear show={step_1} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          style={{ maxWidth: '80%', minHeight: '80%' }}
          onClose={() => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300 opacity-900"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-80" />
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
                  style={{ height: '80%', minHeight: '500px' }}
                >
                  <div className="flex gap-2 relative">
                    <div className="w-full hidden">
                      <button
                        className="bg-blue-500 h-14 text-white rounded-md shadow-md p-2 w-full"
                        onClick={() => setIsOpenPopupCreate(true)}
                      >
                        Lập kế hoạch mới
                      </button>
                      <div className="flex items-center gap-2 py-3">
                        <img src={menuIcon} width={40} height={40} />{' '}
                        <span className="text-blue-500"> Mẫu kế hoạch</span>
                      </div>
                      <PerfectScrollbar className="max-h-96 flex flex-col ">
                        {rightPlanList.map((_elt, index) => (
                          <span className="text-blue-700 " key={index}>
                            {_elt}
                          </span>
                        ))}
                      </PerfectScrollbar>
                    </div>
                    <div className="w-full h-full">
                      <div className="flex items-center mb-5 gap-4">
                        <button
                          className="bg-blue-500 h-14 text-white rounded-md shadow-md p-2 w-2/12"
                          onClick={() => setIsOpenPopupCreate(true)}
                        >
                          Lập kế hoạch mới
                        </button>
                        <span className="uppercase font-bold text-base">
                          Danh sách kế hoạch của bạn
                        </span>
                        <div className="flex gap-5 ml-auto">
                          {plan &&
                            !/^\s*$/.test(textContent) &&
                            !isCreateToHomepage.status && (
                              <span
                                onClick={() => dispatch(backEditorScreen())}
                                className="bg-white border-2 font-bold border-blue-500 rounded-full shadow-md cursor-pointer p-2 hover:bg-blue-500 hover:text-white"
                                title="Tiếp tục soạn thảo"
                              >
                                {/* <AiOutlineEdit color='green' size={25} /> */}
                                Tiếp tục soạn thảo
                              </span>
                            )}

                          <span
                            onClick={() => {
                              dispatch(
                                createContentToHomepage({ status: false })
                              );
                              dispatch(resetCreateContent());
                              history.push('/');
                            }}
                            className="bg-white rounded-full shadow-md cursor-pointer p-2"
                            title="Trở về trang chủ"
                          >
                            <FiX color="red" size={25} />
                          </span>
                        </div>
                      </div>
                      {/* TOP BAR  */}
                      <div className="flex items-center">
                        <div className="flex items-center gap-5">
                          <div className="flex items-center cursor-text rounded-lg h-12  border-2 px-1 border-blue-300 bg-white text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                            <input
                              type="text"
                              placeholder="Tìm theo tên hoặc hashtag#"
                              defaultValue={inputValue}
                              onChange={handleSearchPlan}
                              className="border-none bg-none rounded-lg w-96"
                              style={{ background: 'none' }}
                            />
                            <button disabled>
                              <FiSearch size={25} />
                            </button>
                          </div>
                          <Select
                            data={filterList}
                            onChangeFunc={handleOnchangeSelect}
                            selected={selected}
                            width="w-96"
                          />
                        </div>
                      </div>
                      <div className="w-ful h-2 border-b-2 border-dashed border-gray-200 mt-5 mb-5"></div>
                      {/* LIST PLAN  */}
                      <PerfectScrollbar
                        className="grid gap-5 mt-2 grid-cols-4 max-h-500"
                        // @ts-ignore
                        style={{ minheight: '350px' }}
                      >
                        {plans.map((planItem, index) => {
                          const {
                            id,
                            name,
                            thumbnail,
                            hashtag,
                            // @ts-ignore
                            createdDate,
                            color,
                            contents_count = 0,
                          } = planItem;
                          const isLinegadient = lineGadientReg.test(color);
                          return (
                            <div key={index}>
                              {isLinegadient || thumbnail !== null ? (
                                <div
                                  key={index}
                                  style={{
                                    backgroundImage:
                                      !isLinegadient && color === null
                                        ? `linear-gradient(90deg, rgba(0, 0, 0, .6) 12%, RGBA(0, 0, 0, .6) 48%, rgba(0, 0, 0, .6) 69%, rgba(0, 0, 0, .6) 100%), url(${thumbnail})`
                                        : color,
                                    backgroundSize: 'cover',
                                  }}
                                  className="transform duration-500 border-4 w-full hover:border-indigo-500 hover:bg-blue-600 h-44  cursor-pointer p-4 relative rounded-lg shadow-md leading flex justify-center items-center"
                                >
                                  <span className="absolute top-3 right-3">
                                    <div className="flex items-center gap-2">
                                      <FiEdit
                                        size={30}
                                        color="#fff"
                                        title="Sửa kế hoạch"
                                        className="bg-gray-400  rounded-lg p-1 hover:bg-gray-600"
                                        onClick={() => handleEditPlan(planItem)}
                                      />
                                      <FiTrash
                                        size={30}
                                        color="#fff"
                                        title="Xoá kế hoạch"
                                        className="bg-gray-400  rounded-lg p-1 hover:bg-gray-600"
                                        onClick={() => handleDeletePlan(id)}
                                      />{' '}
                                    </div>
                                  </span>
                                  <span
                                    className="text-white rounded-lg p-3 font-bold text-xl uppercase duration-200 text-center hover:underline"
                                    onClick={() =>
                                      handleSelectPlan({ name, id })
                                    }
                                  >
                                    {name} ({contents_count})
                                  </span>
                                  {hashtag && (
                                    <span className="absolute bottom-3 right-3 p-1 rounded-lg font-bold text-white">
                                      #{hashtag}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div
                                  key={index}
                                  style={{
                                    backgroundSize: 'cover',
                                    background: `linear-gradient(90deg, rgba(0, 0, 0, .4) 90%, RGBA(0, 0, 0, .4) 90%, rgba(0, 0, 0, .4) 90%, rgba(0, 0, 0, .4) 100%),
                                  ${color}`,
                                  }}
                                  className="transform duration-500 border-4 hover:border-indigo-500 hover:bg-blue-600 h-44  cursor-pointer p-4 relative rounded-lg shadow-md leading flex justify-center items-center"
                                >
                                  <span className="absolute top-3 right-3">
                                    <div className="flex items-center gap-2">
                                      <FiEdit
                                        size={30}
                                        color="#fff"
                                        title="Sửa kế hoạch"
                                        className="bg-gray-400  rounded-lg p-1 hover:bg-gray-600"
                                        onClick={() =>
                                          handleEditPlan({
                                            id,
                                            name,
                                            thumbnail,
                                            color,
                                            hashtag,
                                          })
                                        }
                                      />
                                      <FiTrash
                                        size={30}
                                        color="#fff"
                                        title="Xoá kế hoạch"
                                        className="bg-gray-400  rounded-lg p-1 hover:bg-gray-600"
                                        onClick={() => handleDeletePlan(id)}
                                      />{' '}
                                    </div>
                                  </span>
                                  <span
                                    className="text-white rounded-lg p-3 font-bold text-xl uppercase duration-200 text-center hover:underline"
                                    onClick={() =>
                                      handleSelectPlan({ name, id })
                                    }
                                  >
                                    {name} ({contents_count})
                                  </span>
                                  {hashtag && (
                                    <span className="absolute bottom-3 right-3 p-1 rounded-lg font-bold text-white">
                                      #{hashtag}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div></div>
                      </PerfectScrollbar>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* POPUP CREATE PLAN  */}
      <PopupCreatePlan
        isOpen={isOpenPopupCreate}
        setOpen={setIsOpenPopupCreate}
        setOriginalPlans={setOriginalPlans}
        editItem={planEdit}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        handleSelectPlan={handleSelectPlan}
      />
      {/* IF SELECT PLAN => SHOW POPUP LIST CHILD PLAN  */}
      <PopupListContentPlan isOpen={step_2} />
    </>
  );
};

export default PoupPlan;
