import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import styled from 'styled-components';
import DialogImage from '../../../components/ContentSugesstion/DialogImage';
import {
  actionAddImage,
  actionGetDesignCategories,
  actionGetDesigns,
  updateProps,
} from '../../../store/actions/createContent';
import {
  KEY_EDITOR_IMAGE,
  KEY_HASH_VIDEO_OR_IMAGE,
  KEY_INDEX_IMAGE_SELECT,
} from '../../../reducers/createContent';

const Designs = (props) => {
  const { setIsRightImage, setImagesRightEditor, setIsEditor } = props;
  const {
    designs,
    categoriesDesignAvailable,
    imageSelect,
    designCurrentPage = 1,
    designTotalPages = 1,
  } = useSelector((state) => state.createPost);
  const [open, setOpen] = useState(false);
  const [catId, setCatId] = useState(0);

  const { isLoading } = useSelector((state) => state.isLoadingApp);
  const [imgSelect, setImgSelect] = useState('');
  const dispatch = useDispatch();
  const setToggleDialog = () => {
    setOpen(!open);
  };
  const handleSelectImage = (image, type) => {
    if (type === 'view') {
      setImgSelect(image);
      setOpen(true);
    } else {
      dispatch(
        updateProps([
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: 'designs',
          },
        ])
      );
      dispatch(actionAddImage({ ...image, type: 'designs' }));
    }
  };

  const handleEditImage = (full_url) => {
    dispatch(
      updateProps([
        {
          prop: KEY_EDITOR_IMAGE,
          value: full_url,
        },
        {
          prop: KEY_INDEX_IMAGE_SELECT,
          value: null,
        },
      ])
    );
    setImagesRightEditor(imageSelect);
    setIsRightImage(true);
    setIsEditor(true);
  };

  useEffect(() => {
    if (catId) {
      dispatch(actionGetDesigns(1, catId));
    }
  }, [catId]);

  const renderImage = () => {
    return (
      <div className="designsContainer">
        <div className="grid grid-cols-3 mt-3 gap-2">
          {designs && designs.length > 0 ? (
            designs.map((_elt, index) => {
              const { full_url, id } = _elt;
              return (
                <div
                  key={index}
                  className="relative h-48 border border-gray-300 rounded-lg hover:border-blue-500 transition-all bg-cover bg-center bg-no-repeat group"
                  style={{
                    backgroundImage: `url("${full_url}")`,
                  }}
                >
                  <div className="absolute top-0 h-0 flex-col w-full overflow-hidden justify-center group-hover:h-full group-hover:flex">
                    <button
                      className="bg-blue-500 mb-1 text-white rounded-md hover:bg-red-600 transition-all p-2"
                      onClick={() => handleSelectImage(full_url, 'view')}
                    >
                      Xem
                    </button>
                    <button
                      className="bg-blue-500 mb-1 text-white rounded-md hover:bg-red-600 transition-all p-2"
                      onClick={() => handleEditImage(full_url)}
                    >
                      Viết gì vào đây
                    </button>
                    <button
                      className={`${
                        imageSelect.some((elt) => elt.id === _elt.id)
                          ? 'bg-gray-500'
                          : 'bg-blue-500 hover:bg-red-600'
                      }  mb-1 text-white rounded-md  transition-all p-2`}
                      onClick={() => handleSelectImage(_elt, 'select')}
                      disabled={imageSelect.some((elt) => elt.id === _elt.id)}
                    >
                      {imageSelect.some((elt) => elt.id === _elt.id)
                        ? 'Đã chọn'
                        : 'Chọn'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <h4 className="font-bold text-center">
              Không tìm thấy mẫu ảnh gợi ý
            </h4>
          )}
        </div>
        {/* add button to get more designs */}
        <div className="flex justify-center mt-4">
          {designCurrentPage < designTotalPages && (
            <button
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition-all w-full"
              onClick={() =>
                dispatch(actionGetDesigns(designCurrentPage + 1, catId))
              }
            >
              Tải thêm
            </button>
          )}
        </div>
      </div>
    );
  };
  useEffect(() => {
    dispatch(actionGetDesigns(1));
    dispatch(actionGetDesignCategories());
  }, []);
  return (
    <div className="mb-2 p-2">
      <div>
        <Select
          options={categoriesDesignAvailable}
          placeholder="Chủ đề"
          onChange={(el) => setCatId(el.value)}
        />
      </div>
      <div className="designsContainer p-2 overflow-y-scroll overflow-x-hidden max-h-screen">
        {designs.length === 0 && !isLoading ? (
          <div className="flex justify-center">
            <span className="font-bold">Không có dữ liệu hiển thị</span>
          </div>
        ) : (
          renderImage()
        )}
      </div>
      <DialogImage
        open={open}
        setOpen={setToggleDialog}
        imageLink={imgSelect}
      />
    </div>
  );
};

export default Designs;
