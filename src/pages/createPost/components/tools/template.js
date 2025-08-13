import React from 'react';
import { toast } from 'react-toastify';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
// import customData from '.';
import { isArrayEmpty } from '../../../../configs';
import { uniqueId } from 'lodash';
import {
  AddElement,
  updateProps,
} from '../../../../store/actions/createContent';
import { useDispatch } from 'react-redux';
import { KEY_ELEMENTS_IMAGES } from '../../../../reducers/createContent';

const Template = ({
  canvasFromJson,
  setCanvasHeight,
  setCanvasWidth,
  editor,
}) => {
  const templates = [];
  const dispatch = useDispatch();
  const handleChange = (e) => {
    if (e.target.files[0]) {
      dispatch(
        updateProps([
          {
            prop: KEY_ELEMENTS_IMAGES,
            value: [],
          },
        ])
      );
      const fileReader = new FileReader();
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (e) => {
        const data = JSON.parse(e.target.result);
        setCanvasHeight(data.height);
        setCanvasWidth(data.width);
        editor.canvas.setWidth(data.width);
        editor.canvas.setHeight(data.height);
        const _data = { ...data.data };
        _data['objects'] = data.data.objects.map((_elt) => {
          const id = uniqueId();
          const item = {
            ..._elt,
            customId: id,
          };
          dispatch(AddElement(item));
          return item;
        });
        canvasFromJson(JSON.stringify(_data));
        toast.success('Tải mẫu lên thành công !');
      };
    }
  };
  const handleSelectTemplate = (data) => {
    dispatch(
      updateProps([
        {
          prop: KEY_ELEMENTS_IMAGES,
          value: [],
        },
      ])
    );
    const _data = { ...data };
    _data['objects'] = data.objects.map((_elt) => {
      const id = uniqueId();
      const item = {
        ..._elt,
        customId: id,
      };
      dispatch(AddElement(item));
      return item;
    });
    canvasFromJson(JSON.stringify(_data));
  };
  return (
    <div className="text-black">
      <div className="flex w-full items-center justify-center bg-grey-lighter">
        <label className="w-64 flex flex-row justify-center items-center px-2 py-4 bg-gray-700 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-indigo-500">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="ml-1  text-sm leading-normal">Tải mẫu lên</span>
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            accept="application/JSON"
          />
        </label>
      </div>
      {/* <div className="grid grid-cols-2 gap-2 mt-2">
        {customData.map((_elt, index) => (
          <div className="flex flex-col mb-3" key={index}>
            <Image src={_elt.thunail} alt="Image" width="250" preview />
            <button
              className="bg-blue-500 hover:bg-red-500 rounded-md p-3 mt-2 text-white font-bold"
              onClick={() => handleSelectTemplate(_elt.data)}
            >
              Chọn mẫu
            </button>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Template;
