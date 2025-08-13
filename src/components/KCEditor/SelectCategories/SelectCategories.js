import { connect } from 'react-redux';
import { XIcon } from '@heroicons/react/outline';
import { MdContentPaste } from 'react-icons/md';
import ParentCategories from './ParentsCategories';
import ChildCategories from './ChildCategories';
import { useCallback, useState } from 'react';
import { changeStateCreateContentForm } from '../../../store/actions/editor/createContentActions';
import { changeStateCategoriesPopup } from '../../../store/actions/editor/editorActions';

const SelectCategories = (props) => {
  const { changeStateCategoriesPopup, changeStateCreateContentForm } = props;
  const [selectedParent, setSelectedParent] = useState(0);

  const changeParent = useCallback(
    (parentId) => {
      setSelectedParent(parentId);
    },
    [setSelectedParent]
  );

  const handleSaveButton = useCallback(() => {
    changeStateCategoriesPopup(false);
    changeStateCreateContentForm(true);
  }, []);

  return (
    <>
      <div
        className="opacity-25 fixed inset-0 z-9999 bg-black"
        onClick={() => changeStateCategoriesPopup(false)}
      ></div>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-9999 outline-none focus:outline-none max-h-screen">
        <div className="relative w-5/6 my-6 mx-auto">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between px-2 py-4 border-b border-solid border-gray-300 rounded-t">
              <h3 className="text-xl font-semibold text-center flex items-center text-gray-700 ">
                <MdContentPaste className="mr-2 text-editor-facebook" />
                Chọn kịch bản từ nguồn Facebook
              </h3>
              <XIcon
                className="close-icon h-8 w-8 p-1 bg-indigo-100 rounded-full cursor-pointer hover:bg-indigo-400 hover:text-white transition-all duration-200 ease-linear"
                onClick={() => changeStateCategoriesPopup(false)}
              />
            </div>
            {/*body*/}
            <div className="categoriesListing relative p-2 flex flex-auto gap-3">
              <div className="parentsCat w-1/4 border-l border-r border-b">
                <ParentCategories
                  changeParent={changeParent}
                  selectedParent={selectedParent}
                />
              </div>
              <div className="listingCats w-3/4">
                <ChildCategories selectedParent={selectedParent} />
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end px-5 py-4 border-t border-solid border-gray-300 rounded-b">
              <button
                className="text-red-400 hover:text-red-600 background-transparent font-bold uppercase px-6 py-2 outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={() => changeStateCategoriesPopup(false)}
              >
                Đóng
              </button>
              <button
                className="bg-emerald-500 text-gray-300 active:bg-emerald-600 font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 bg-primary hover:text-white"
                type="button"
                onClick={() => handleSaveButton()}
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  changeStateCategoriesPopup,
  changeStateCreateContentForm,
})(SelectCategories);
