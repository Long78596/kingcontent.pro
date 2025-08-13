import React from 'react';
import {
  _dashed_border,
  _input_style,
  _text_title,
} from './createPost/utility';
import { useState } from 'react';
import { CreateContent } from '../services/createContent';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiEdit, FiTrash } from 'react-icons/fi';
import { isObjEmpty } from '../utils/utilityFunc';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { confirmAlert } from 'react-confirm-alert';
import { OK } from '../configs';

const CreateLabelAdmin = () => {
  const [labels, setLabels] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [colorSelect, setColorSelect] = useState(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [itemEdit, setItemEdit] = useState(null);
  const [deps, setDeps] = useState(0);
  const history = useHistory();
  const reActiveApi = () => {
    setDeps((pre) => pre++);
  };
  const dependencies = [labels.length, history.location.pathname, deps];

  const getAllLabels = async () => {
    const res = await CreateContent.getSuggestionLabels();
    if (res.status === OK) {
      setLabels(res.data.data);
    }
  };
  const handelCreate = async () => {
    if (!inputValue || !colorSelect || !keywordInput) {
      toast.warning('Vui lòng nhập đầy đủ thông tin !');
      return;
    }
    if (!isObjEmpty(itemEdit)) {
      const res = await CreateContent.updateLabel(itemEdit.id, {
        name: inputValue,
        color: colorSelect,
        keyword: keywordInput,
      });
      if (res.status === OK) {
        resetInput(true);
        getAllLabels();
        toast.success('Cập nhật thành công !');
      }
    } else {
      const res = await CreateContent.createLabel({
        name: inputValue,
        color: colorSelect,
        keyword: keywordInput,
      });
      if (res.status === OK) {
        resetInput();
        getAllLabels();
        toast.success('Tạo mới thành công !');
      }
    }
  };
  const handeldelete = async (id) => {
    confirmAlert({
      title: 'Thông báo',
      message: 'Bạn có chắc chắn muốn xoá phân loại này ?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            const res = await CreateContent.deleteLabel(id);
            if (res.status === OK) {
              getAllLabels();
              toast.success('Xoá thành công !');
            }
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };
  const resetInput = (isEdit) => {
    setInputValue('');
    setColorSelect(null);
    setKeywordInput('');
    if (isEdit) {
      setItemEdit(null);
    }
  };
  const handelEditItem = (item) => {
    setItemEdit(item);
    setInputValue(item.name);
    setColorSelect(item.color);
    setKeywordInput(item.keyword);
  };

  useEffect(() => {
    getAllLabels();
  }, [...dependencies, JSON.stringify(labels)]);

  return (
    <div className="bg-white h-screen p-4 rounded-3xl">
      <div className="flex justify-between items-center mb-2">
        <h1 className="font-bold  uppercase text-base">Quản lý phân loại</h1>
      </div>
      <div className={_dashed_border}></div>

      <div className="flex mt-2">
        <div className="w-1/3">
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
            <span className={_text_title}>Lệnh Chat GPT</span>
            <textarea
              name="keyword"
              id=""
              className={`rounded-lg shadow-md border-gray-300 focus:border-blue-300 w-full h-20 mb-2`}
              cols="30"
              rows="10"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
            ></textarea>
            {!isObjEmpty(itemEdit) && (
              <button
                onClick={() => {
                  setItemEdit(null);
                  setInputValue('');
                  setColorSelect(null);
                  setKeywordInput('');
                }}
                className="p-3 rounded-md bg-red-500 mb-2 text-white w-full hover:bg-gray-500"
                type="submit"
              >
                Huỷ chỉnh sửa
              </button>
            )}

            <button
              onClick={handelCreate}
              className="p-3 rounded-md bg-blue-500 text-white w-full hover:bg-gray-500"
              type="submit"
            >
              {!isObjEmpty(itemEdit) ? 'Cập nhật' : 'Tạo mới'}
            </button>
          </div>
        </div>

        <div className="w-2/3">
          <table className="w-full">
            <thead>
              <tr>
                <th className="font-bold">Tên phân loại</th>
                <th className="font-bold">Màu sắc</th>
                <th className="font-bold">Lệnh chat GPT</th>
                <th className="font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {labels.map((_elt, index) => (
                <tr key={_elt.id}>
                  <td className="text-center py-5" width={'30%'}>
                    {_elt.name}
                  </td>
                  <td className="text-center py-5" width={'10%'}>
                    <div
                      className="h-10 w-full border-2 border-black"
                      style={{ backgroundColor: _elt.color }}
                    ></div>
                  </td>
                  <td className="text-center py-5" width={'50%'}>
                    {_elt.keyword}
                  </td>
                  <td className="text-center py-5 " width={'10%'}>
                    <div className="flex gap-2">
                      <FiEdit
                        size={20}
                        color="green"
                        className="cursor-pointer"
                        onClick={() => handelEditItem(_elt)}
                      />
                      <FiTrash
                        size={20}
                        color="red"
                        className="cursor-pointer"
                        onClick={() => handeldelete(_elt.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateLabelAdmin;
