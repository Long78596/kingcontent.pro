import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CreateContent } from '../../../../services/createContent';
import defaultImage from '../../../../assets/images/category_default_loading.png';
import {
  actionSelectCategory,
  actionTogglePopupSelectCate,
} from '../../../../store/actions/createContent';
import { isObjEmpty } from '../../../../utils/utilityFunc';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { actionLoadingApp } from '../../../../store/actions/loading';
import LoadingApp from '../../../../components/LoadingApp';
import { resetState } from '../../../../store/actions/Contents/contentActions';
import { DEFAULT_TAKE_CARE_CAT, OK } from '../../../../configs';
import Select from 'react-select';

const listOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'takeCare', label: 'Content nuôi dưỡng' },
  { value: 'theRest', label: 'Content bán hàng' },
];

const IdeaCategories = () => {
  const { categorySelect } = useSelector((state) => state.createPost);
  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [availableData, setAvailableData] = useState([]);
  const dispatch = useDispatch();
  const [listContent, setListContent] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [cateType, setCateType] = useState('all');
  const defaultValue = listOptions.find((item) => item.value === cateType);
  const [keyword, setKeyword] = useState('');

  const handleGetAll = async () => {
    const res = await CreateContent.getAllChildCategories();
    const { status, data } = res;
    if (status === OK) {
      setListContent(data?.data);
      setAvailableData(data?.data);
      if (isObjEmpty(categorySelect)) {
        handleSelectCategory(data?.data[0]);
      }
      dispatch(actionLoadingApp(false));
    } else {
      setListContent([]);
      setAvailableData([]);
      handleSelectCategory(null);
      dispatch(actionLoadingApp(false));
    }
  };

  useEffect(() => {
    if (availableData.length > 0) {
      let filteredCats = [...availableData];
      if (cateType !== 'all') {
        if (cateType === 'takeCare') {
          // search all categories that have parent category is TakeCare
          filteredCats = availableData.reduce((acc, cat) => {
            if (parseInt(cat?.parent_id) === DEFAULT_TAKE_CARE_CAT) {
              acc.push(cat);
              // get child category from current category
              const childCats = availableData.filter(
                (item) => item.parent_id === cat.cate_id
              );
              if (childCats?.length) {
                acc.push(...childCats);
              }
            }
            return acc;
          }, []);
        } else {
          // search all categories that have parent category is not TakeCare
          filteredCats = availableData.reduce((acc, cat) => {
            if (parseInt(cat?.parent_id) !== DEFAULT_TAKE_CARE_CAT) {
              acc.push(cat);
              // get child category from current category
              const childCats = availableData.filter(
                (item) => item.parent_id === cat.cate_id
              );
              if (childCats?.length) {
                acc.push(...childCats);
              }
            }
            return acc;
          }, []);
        }
      }
      if (keyword) {
        filteredCats = filteredCats.reduce((acc, cat) => {
          let { cate_name = '', parent = null } = cat;
          if (cate_name.toLowerCase().includes(keyword)) {
            if (parent) {
              // get parent category from child childCategories
              const parentCat = [...availableData].find(
                (item) => item.cate_id === parent.cate_id
              );
              if (parentCat && !acc.includes(parentCat)) {
                acc.push(parentCat);
              }
            }
            acc.push(cat);
          }
          return acc;
        }, []);
      }
      setListContent(filteredCats);
    }
  }, [cateType, keyword]);

  const handleSelectCategory = (cate) => {
    setSelectedCat(cate);
  };

  const handleChosenCategory = (cate) => {
    dispatch(actionSelectCategory(cate));
    dispatch(resetState());
  };

  const renderCategories = () => {
    return (
      <PerfectScrollbar className="categoriesListing max-h-screen">
        {listContent.length !== 0 ? (
          <div
            className="grid grid-cols-3 gap-2 pr-2 pl-2  overflow-y-scroll overflow-x-hidden"
            style={{ height: '100%' }}
          >
            {listContent.map((_elt, index) => {
              return (
                <div
                  className={`bg-gray-100 rounded-md mt-2 p-3 cursor-pointer ${
                    selectedCat?.cate_id === _elt?.cate_id
                      ? 'border border-red-500'
                      : 'border border-transparent'
                  }`}
                  key={index}
                  onClick={() => handleSelectCategory(_elt)}
                >
                  <div className="flex justify-center">
                    <div
                      className="thumbnail w-full h-40 block bg-no-repeat bg-cover"
                      style={{
                        backgroundImage: `url(${
                          _elt.image_url ? _elt.image_url : defaultImage
                        })`,
                      }}
                    ></div>
                  </div>
                  <h3 className="font-bold text-center my-3 h-10 flex items-center justify-center">
                    {_elt?.cate_name}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="font-bold">Không có dữ liệu hiển thị</span>
          </div>
        )}
      </PerfectScrollbar>
    );
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  useEffect(() => {
    if (!isObjEmpty(categorySelect)) {
      dispatch(actionTogglePopupSelectCate(false));
    }
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingApp />
      ) : (
        <>
          <p className="bold italic mb-2">
            * Chọn chủ đề bạn muốn tham khảo ý tưởng
          </p>
          <div className="flex gap-2 p-1">
            <input
              className="w-full p-2 rounded-md border-gray-300 outline-none"
              placeholder="Tìm kiếm nhanh ..."
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Select
              className="selectCategories w-1/2 ml-auto"
              options={listOptions}
              defaultValue={defaultValue}
              onChange={(selected) => setCateType(selected.value)}
            />
          </div>
          {renderCategories()}
          <div className="actions">
            <button
              className="bg-blue-500 text-white rounded-md py-2 px-5 float-right mr-2 mt-3 hover:bg-blue-700 transition-all"
              onClick={() => handleChosenCategory(selectedCat)}
            >
              Chọn
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default IdeaCategories;
