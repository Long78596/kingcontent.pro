import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect, useState } from 'react';
import { FiCheck, FiEdit, FiX } from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { _dashed_border, _input_style, _text_title } from '../../utility';
import { useDispatch, useSelector } from 'react-redux';
import {
  KEY_HASH_TAG_PLANS,
  KEY_LABELS,
  KEY_LABEL_SELECT,
  KEY_PLAN_SELECT,
} from '../../../../reducers/createContent';
import {
  actionGetLabels,
  actionGetPlan,
  actionSelectLabel,
} from '../../../../store/actions/createContent';
import { CreateContent } from '../../../../services/createContent';
import { toast } from 'react-toastify';
import { isObjEmpty } from '../../../../utils/utilityFunc';
import { OK } from '../../../../configs';

const PopupSelectTag = ({
  isOpen,
  setOpen,
  isEditInList = false,
  itemEdit = {},
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [colorSelect, setColorSelect] = useState('#ffffff');
  const {
    [KEY_LABELS]: labels,
    [KEY_LABEL_SELECT]: labelId,
    [KEY_PLAN_SELECT]: plan,
  } = useSelector((state) => state['createPost']);
  const { user } = useSelector((state) => state.userReducer);
  const [idEdit, setIdEdit] = useState('');
  const dispatch = useDispatch();
  const handelSelectTag = (item) => {
    dispatch(actionSelectLabel(item.id));
    setOpen(false);
  };
  const handelCreate = async () => {
    const isHasTag = labels.some((_elt) => _elt.name === inputValue);
    if (isHasTag && !isEdit && !isEditInList) {
      toast.error(
        'Phân loại đã tồn tại trong hệ thông . Vui lòng đặt tên khác !'
      );
      return;
    }
    if (isEdit || isEditInList) {
      const res = await CreateContent.updateLabel(idEdit, {
        name: inputValue,
        color: colorSelect,
        user_id: user.id,
      });
      if (res.status === OK) {
        toast.success('Cập nhật thành công !');
        dispatch(actionGetLabels());
        setInputValue('');
        setColorSelect('');
        setIdEdit('');
        setIsEdit(false);
        if (isEditInList) {
          setOpen(false);
          dispatch(actionGetPlan(plan?.id));
        }
      }
    } else {
      const res = await CreateContent.createLabel({
        name: inputValue,
        color: colorSelect,
        user_id: user.id,
      });
      if (res.status === OK) {
        toast.success('Tạo mới thành công !');
        setInputValue('');
        setColorSelect('');
        dispatch(actionGetLabels());
      }
    }
  };
  useEffect(() => {
    if (!isObjEmpty(itemEdit)) {
      setIsEdit(true);
      setColorSelect(itemEdit.color);
      setInputValue(itemEdit.name);
      setIdEdit(itemEdit.id);
    }
  }, [isOpen]);

  useEffect(() => {
    if (labels === null) {
      dispatch(actionGetLabels());
    }
  }, [labels]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 max-w-lg mt-1"
          style={{ maxWidth: '80%' }}
          onClose={() => {}}
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
                  className=" transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
                  style={{ height: '80%', width: '500px' }}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold  uppercase">Chọn thẻ</h2>
                    <div>
                      <button
                        className="rounded-full p-1 bg-gray-400"
                        onClick={() => setOpen(false)}
                      >
                        <FiX size={25} color="#fff" />
                      </button>
                    </div>
                  </div>
                  <div className={_dashed_border}></div>
                  <div>
                    <span className={_text_title}>Tên phân loại</span>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className={`${_input_style} mb-3`}
                    />
                    <span className={_text_title}>Màu phân loại</span>
                    <input
                      type="color"
                      className={`${_input_style} mb-3`}
                      value={colorSelect}
                      onChange={(e) => setColorSelect(e.target.value)}
                    />
                    {!isEditInList && (
                      <>
                        {' '}
                        <span className={_text_title}>Gợi ý</span>
                        <PerfectScrollbar
                          className=" w-full mt-1"
                          style={{ height: '400px' }}
                        >
                          {labels &&
                            labels.map(({ id, name, color }, index) => (
                              <div
                                style={{ backgroundColor: color || '#222222' }}
                                key={index}
                                className={`flex justify-between mb-3 gap-2 cursor-pointer px-2 py-4 rounded-lg duration-200 transition-all ${
                                  labelId === id ? 'border-2 border-white' : ''
                                }`}
                              >
                                <span
                                  className="w-10/12 text-white"
                                  onClick={() => handelSelectTag({ name, id })}
                                >
                                  #{name}
                                </span>
                                <button
                                  onClick={() => {
                                    setIsEdit(true);
                                    setInputValue(name);
                                    setColorSelect(color);
                                    setIdEdit(id);
                                  }}
                                >
                                  <FiEdit size={25} color="#000" />
                                </button>
                              </div>
                            ))}
                        </PerfectScrollbar>
                      </>
                    )}
                    {inputValue ? (
                      <div className="flex justify-center mt-5">
                        <button
                          onClick={handelCreate}
                          className="p-3 rounded-md bg-blue-500 text-white w-full hover:bg-gray-500"
                          type="submit"
                        >
                          {isEdit ? 'Cập nhật' : 'Tạo mới'}{' '}
                        </button>
                      </div>
                    ) : null}
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

export default PopupSelectTag;
