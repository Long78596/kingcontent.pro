import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FiEdit } from 'react-icons/fi';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineEditOff } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SpecialService } from '../../services/special';
import styled from 'styled-components';
import client from '../../Client';
import { OK } from '../../configs';

const OverlayPanelStyled = styled(OverlayPanel)`
  button.p-overlaypanel-close.p-link {
    background-color: #2563eb;
    color: #fff;
  }
`;
const PopoverTag = ({
  op,
  params,
  setParams,
  isEdit = null,
  item,
  reRenderList,
  setVisible,
}) => {
  const [pre, setPre] = useState(0);
  const [hashtagList, setHashtagList] = useState([]);
  const [idEdit, setIdEdit] = useState(null);
  const [nameTag, setNameTag] = useState('');
  const inpRef = useRef(null);
  const reActiceAPi = () => {
    setPre((pre) => ++pre);
  };
  const getAllHashtag = async () => {
    const res = await SpecialService.getAllTag();
    if (res.status === OK) {
      setHashtagList(res.data.data);
    }
  };
  const addHasgtag = async () => {
    if (!nameTag) {
      toast.error('Vui lòng nhập tên thẻ !');
      return;
    }
    if (idEdit) {
      const data = {
        name: nameTag,
      };
      const res = await SpecialService.editTag(idEdit, data);
      if (res.status === OK) {
        toast.success('Cập nhật thẻ thành công !');
        setNameTag('');
        reActiceAPi();
      }
    } else {
      const data = {
        name: nameTag,
      };
      const res = await SpecialService.creatTag(data);
      if (res.status === OK) {
        toast.success('Tạo thẻ thành công !');
        setNameTag(null);
        reActiceAPi();
      }
    }
  };
  const editTag = (tag) => {
    setNameTag(tag.name);
    setIdEdit(tag.id);
    inpRef.current.focus();
  };
  const deleteTag = async (id) => {
    confirmAlert({
      title: 'Thông báo',
      message: 'Bạn có chắc chắn muốn xoá thẻ ?',
      buttons: [
        {
          label: 'Huỷ',
          onClick: () => {},
        },
        {
          label: 'Xoá',
          onClick: async () => {
            const res = await SpecialService.deleteTag(id);
            if (res.status === OK) {
              toast.success('Xoá thẻ thành công !');
              reActiceAPi();
            }
          },
        },
      ],
    });
  };
  const clearEdit = () => {
    setNameTag('');
    setIdEdit(null);
  };
  const updateRowOnTag = async (tag) => {
    if (tag.id === item.spec_id) return;
    const data = {
      label_id: tag.id,
    };
    const res = await client.put(`/saved-fanpages/${item.id}`, data);
    if (res.status === OK) {
      setVisible(false);
      toast.success('Cập nhật thành công !');
      reRenderList && reRenderList();
    }
  };
  const actionTemplate = (tag) => {
    return (
      <div className="flex items-center gap-3 justify-center">
        {isEdit ? (
          <FaRegCheckCircle
            size={20}
            className={
              tag.id === Number(item.spec_id)
                ? 'text-green-500'
                : 'text-gray-500'
            }
            onClick={(e) => {
              updateRowOnTag(tag);
            }}
          />
        ) : (
          <FaRegCheckCircle
            size={20}
            className={
              tag.id === params?.label ? 'text-green-500' : 'text-gray-500'
            }
            onClick={() => {
              setParams({ ...params, label: tag.id, name: tag.name });
              op.current.hide();
            }}
          />
        )}

        <FiEdit
          size={20}
          className="text-blue-500"
          onClick={() => editTag(tag)}
        />
        <FaTrash
          size={20}
          className="text-red-500"
          onClick={() => deleteTag(tag.id)}
        />
      </div>
    );
  };

  useEffect(() => {
    getAllHashtag();
  }, [pre]);
  return isEdit ? (
    <div>
      <div>
        {idEdit && (
          <span className="mb-2 font-bold">Bạn đang sửa thẻ : {nameTag}</span>
        )}
        <div className="flex items-center gap-2">
          <input
            className="border outline-none rounded-md p-2 w-full"
            placeholder="Nhập tên nhãn..."
            value={nameTag || ''}
            ref={inpRef}
            onChange={(e) => setNameTag(e.target.value)}
          />
          <button
            onClick={addHasgtag}
            className=" w-12 h-11 p-1.5 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer text-center flex justify-center items-center"
          >
            {idEdit ? <FiEdit color="#fff" /> : <IoMdAdd color="#fff" />}
          </button>
          {idEdit && (
            <button
              onClick={clearEdit}
              className=" w-12 h-10 p-1.5 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer text-center flex justify-center items-center"
            >
              <MdOutlineEditOff color="#fff" />
            </button>
          )}
        </div>
        <div className="mt-2">
          <DataTable
            value={hashtagList}
            selectionMode="single"
            paginator
            rows={5}
          >
            <Column field="name" header="Tên thẻ" style={{ width: '70%' }} />
            <Column
              field="Hành động"
              header="Hành động"
              body={actionTemplate}
            />
          </DataTable>
        </div>
      </div>
    </div>
  ) : (
    <OverlayPanelStyled ref={op} showCloseIcon closeOnEscape dismissable={true}>
      <div style={{ width: '400px' }}>
        {idEdit && (
          <span className="mb-2 font-bold">Bạn đang sửa thẻ : {nameTag}</span>
        )}
        <div className="flex items-center gap-2">
          <input
            className="border outline-none rounded-md p-2 w-full"
            placeholder="Nhập tên nhãn..."
            value={nameTag}
            ref={inpRef}
            onChange={(e) => setNameTag(e.target.value)}
          />
          <button
            onClick={addHasgtag}
            className=" w-12 h-11 p-1.5 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer text-center flex justify-center items-center"
          >
            {idEdit ? <FiEdit color="#fff" /> : <IoMdAdd color="#fff" />}
          </button>
          {idEdit && (
            <button
              onClick={clearEdit}
              className=" w-12 h-10 p-1.5 rounded-md border bg-blue-600 hover:bg-blue-400 transition-all duration-200 ease-linear cursor-pointer text-center flex justify-center items-center"
            >
              <MdOutlineEditOff color="#fff" />
            </button>
          )}
        </div>
        <div className="mt-2">
          <DataTable
            value={hashtagList}
            selectionMode="single"
            paginator
            rows={5}
          >
            <Column field="name" header="Tên thẻ" style={{ width: '70%' }} />
            <Column
              field="Hành động"
              header="Hành động"
              body={actionTemplate}
            />
          </DataTable>
        </div>
      </div>
    </OverlayPanelStyled>
  );
};

export default PopoverTag;
