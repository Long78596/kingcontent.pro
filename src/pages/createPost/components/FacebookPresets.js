import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getFacebookPresets,
  setIsActivePreset,
  setSelectFacebookPreset,
} from '../../../store/actions/editor/createContentActions';
import LoadingApp from '../../../components/LoadingApp';
import { Checkbox } from 'rsuite';

const checkLink = async (url) => {
  return fetch(url, {
    method: 'HEAD',
    mode: 'no-cors',
  })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

const SingleFacebookPreset = ({ item }) => {
  const { url = '' } = item;
  const [isSelected, setIsSelected] = useState(false);
  const dispatch = useDispatch();
  const { selectedFacebookPreset = null, isActivePreset = false } = useSelector(
    (state) => state.createPost
  );

  useEffect(() => {
    if (selectedFacebookPreset === item.name) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
  }, [selectedFacebookPreset, item.name]);

  const onClickPreset = () => {
    if (!isActivePreset) return;
    dispatch(setSelectFacebookPreset(item.name));
  };

  return (
    <div
      className={`border border-gray-200 p-1 rounded-md flex justify-center cursor-pointer ${
        isSelected ? 'border-blue-800' : ''
      }`}
      onClick={onClickPreset}
    >
      <img src={url} alt="" />
    </div>
  );
};

const FacebookPresets = (props) => {
  const {
    facebookPresets = [],
    isLoadingFacebookPresets = false,
    facebookPresetsCurrentPage = 1,
    facebookPresetsTotalPages = 1,
    isActivePreset = false,
  } = useSelector((state) => state.createPost);
  const dispatch = useDispatch();

  useEffect(() => {
    if (facebookPresets.length === 0) {
      dispatch(getFacebookPresets());
    }
  }, [dispatch, facebookPresets]);

  const onChangeIsActivePreset = (value) => {
    dispatch(setIsActivePreset(value));
  };

  return (
    <div>
      {isLoadingFacebookPresets && facebookPresetsCurrentPage === 1 ? (
        <LoadingApp />
      ) : (
        <div>
          <div>
            <Checkbox
              className="flex items-center"
              name="isActivePreset"
              value={1}
              checked={isActivePreset}
              onChange={() => onChangeIsActivePreset(!isActivePreset)}
            >
              Bật/tắt chế độ đăng màu nền
            </Checkbox>
          </div>
          {isActivePreset && (
            <p className="font-bold italic text-sm">
              * Nếu bạn muốn chọn ngẫu nhiên ảnh nền, vui lòng không chọn biểu
              tượng nào
            </p>
          )}
          <div className="max-h-screen overflow-y-auto p-2 relative">
            {!isActivePreset && (
              <div className="cursor-not-allowed text-center absolute z-20 bg-white opacity-75 w-full h-full flex items-center justify-center">
                <p className="text-xl font-bold text-gray-500">
                  Vui lòng bật chế độ đăng màu nền để chọn mẫu
                </p>
              </div>
            )}
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-2">
              {facebookPresets.map((item) => (
                <SingleFacebookPreset key={item.name} item={item} />
              ))}
            </div>
            <div className="w-full flex justify-center mt-2">
              {isLoadingFacebookPresets && facebookPresetsCurrentPage > 1 && (
                <LoadingApp />
              )}
              {facebookPresetsCurrentPage < facebookPresetsTotalPages && (
                <button
                  className="bg-blue-500 text-white p-2 rounded-md w-1/2"
                  onClick={() =>
                    dispatch(getFacebookPresets(facebookPresetsCurrentPage + 1))
                  }
                >
                  Xem thêm
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookPresets;
