import { connect } from 'react-redux';
import { XIcon } from '@heroicons/react/outline';
import { MdContentPaste } from 'react-icons/md';
import ParentCategories from './ParentCategories';
import { useCallback, useEffect, useState } from 'react';
import { changeStateCategoriesPopup } from '../../../store/actions/Schedules';
import { getParentCategories } from '../../../store/actions/categories';

const SelectCategories = (props) => {
  const { changeStateCategoriesPopup, getParentCategories, selectedCat } =
    props;
  const [selectedParent, setSelectedParent] = useState(0);

  const handleSaveButton = useCallback(() => {
    if (selectedCat?.id) {
      changeStateCategoriesPopup(false);
    } else {
      alert('Vui lòng chọn một cate để chúng tôi lọc kết quả tốt nhất');
    }
  }, [selectedCat, changeStateCategoriesPopup]);

  useEffect(() => {
    getParentCategories();
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
                Chọn chủ đề bạn đang quan tâm
              </h3>
            </div>
            {/*body*/}
            <div className="categoriesListing relative p-2 flex flex-auto gap-3">
              <div className="parentsCat w-full border-l border-r border-b">
                <ParentCategories selectedParent={selectedParent} />
              </div>
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end px-5 py-4 border-t border-solid border-gray-300 rounded-b">
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

const mapStateToProps = (state) => {
  return {
    selectedCat: state.schedules.selectedCat,
  };
};

export default connect(mapStateToProps, {
  changeStateCategoriesPopup,
  getParentCategories,
})(SelectCategories);
