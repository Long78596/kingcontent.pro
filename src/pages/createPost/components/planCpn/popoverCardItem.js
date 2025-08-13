import { Popover, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// @ts-ignore
import editIcon from '../../../../assets/images/icon/plan/edit.png';
// @ts-ignore
import PinIcon from '../../../../assets/images/icon/plan/pin-angle-fill.png';
// @ts-ignore
import sortIcon from '../../../../assets/images/icon/plan/sort.png';
// @ts-ignore
import trashIcon from '../../../../assets/images/icon/plan/trash.png';
import {
  KEY_PLAN_DATA,
  KEY_PLAN_SELECT,
} from '../../../../reducers/createContent';
import { CreateContent } from '../../../../services/createContent';
import {
  actionGetPlan,
  updateProps,
} from '../../../../store/actions/createContent';
import { OK } from '../../../../configs';

export default function PopoverTopCardItem({
  id,
  originalPlan,
  handelEditTag,
  labelId,
  name,
  color,
  is_pin_to_top,
  setOriginalPlan,
  keyword,
}) {
  // @ts-ignore
  const { [KEY_PLAN_SELECT]: plan } = useSelector((state) => state.createPost);
  const dispatch = useDispatch();
  const handleEdit = () => {
    handelEditTag && handelEditTag({ id: labelId, name, color });
  };
  const handleSortItem = () => {
    const copyListItems = [...originalPlan.labels];
    copyListItems[id].contents = copyListItems[id].contents.sort((o1, o2) => {
      // @ts-ignore
      return new Date(o1.created) - new Date(o2.created);
    });
    dispatch(
      updateProps([
        {
          prop: KEY_PLAN_DATA,
          value: { ...originalPlan, labels: copyListItems },
        },
      ])
    );
  };
  const handleDeleteTag = async () => {
    const copyListItems = [...originalPlan.labels];
    const listRequest = copyListItems[id].contents
      .filter((_item) => !_item.saved)
      .map((_elt) => {
        return _elt.id;
      });
    // call api request
    listRequest.map(async (_elt) => {
      await CreateContent.deleteContent(_elt, 50000);
    });

    copyListItems.splice(id, 1);
    dispatch(
      updateProps([
        {
          prop: KEY_PLAN_DATA,
          value: { ...originalPlan, labels: copyListItems },
        },
      ])
    );
    toast.success('Xoá phân loại thành công !');
  };
  const pinLabel = async () => {
    const res = await CreateContent.pinLabel(labelId, {
      is_pin_to_top: is_pin_to_top === 1 ? false : true,
    });
    if (res.status === OK) {
      dispatch(actionGetPlan(plan?.id, setOriginalPlan));
      toast.success('Thao tác thành công !');
    }
  };
  return (
    <div className="">
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              id={labelId}
              className={`
                ${open ? '' : 'text-opacity-90'}
                group inline-flex items-center rounded-md bg-orange-700 px-3 py-2  text-sm font-medium text-white hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <FiMoreHorizontal
                size={30}
                color="#fff"
                className="bg-gray-700 p-1 rounded-md"
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 -translate-x-1/2 transform px-4 sm:px-0 w-72">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative bg-white p-2 text-black">
                    <div
                      className="flex gap-2 items-center mb-2 cursor-pointer"
                      onClick={pinLabel}
                    >
                      <img src={PinIcon} alt="" width={25} height={25} />
                      <span className="hover:underline hover:text-red-500">
                        {is_pin_to_top === 1 ? 'Bỏ ghim' : 'Ghim phân loại'}{' '}
                      </span>
                    </div>
                    {!keyword && (
                      <div
                        className="flex gap-2 items-center mb-2 cursor-pointer"
                        onClick={handleEdit}
                      >
                        <img src={editIcon} alt="" width={25} height={25} />
                        <span className="hover:underline hover:text-red-500">
                          Sửa phân loại
                        </span>
                      </div>
                    )}

                    <div
                      className="flex gap-2 items-center mb-2 cursor-pointer"
                      onClick={handleSortItem}
                    >
                      <img src={sortIcon} alt="" width={25} height={25} />
                      <span className="hover:underline hover:text-red-500">
                        Sắp xếp theo thời gian tạo
                      </span>
                    </div>
                    <div
                      className="flex gap-2 items-center mb-2 cursor-pointer"
                      onClick={() => handleDeleteTag()}
                    >
                      <img src={trashIcon} alt="" width={25} height={25} />
                      <span className="hover:underline hover:text-red-500">
                        Xoá phân loại
                      </span>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
}
