import { uniqueId } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FaGripLines, FaHistory, FaIcons, FaLayerGroup, FaLongArrowAltUp, FaSitemap, FaSquareFull } from "react-icons/fa";
import { FiArrowDownRight } from "react-icons/fi";
import { IoText, IoTriangleSharp } from 'react-icons/io5';
import { MdClear, MdHexagon, MdLayersClear, MdRectangle } from 'react-icons/md';
import { RiCheckboxBlankCircleFill } from "react-icons/ri";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { isArrayEmpty } from '../../../../configs';
import { KEY_ELEMENTS_IMAGES } from '../../../../reducers/createContent';
import { AddElement, DeleteElement, ResetCanvasLayer, UpdateCanvasLayer } from '../../../../store/actions/createContent';
import { REDUX_NAME_CREATE_POST } from '../../../../utils/utilityFunc';
import { _dashed_border, hasEmoji } from '../../utility';
import { IoMdCloseCircle } from 'react-icons/io';
const Elements = ({ editor, removeObject, backgroundColor,
  canvasWidth,
  canvasHeight,
  canvasFromJson,
  setCanvasHeight,
  setCanvasWidth , setLayerStatus }) => {
  const { [KEY_ELEMENTS_IMAGES]: elements } = useSelector(
    (state) => state[REDUX_NAME_CREATE_POST]
  );
  const [history, setHistory] = useState([])
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(null)
  const [historyStatus, setHistoryStatus] = useState(false)
  const dispatch = useDispatch()
  const deleteElement = (customId) => {
    const item = editor.canvas.getObjects().find((_item) => _item.customId === customId)
    onSelectObject(customId)
    removeObject()
    dispatch(DeleteElement(item.customId));
    // editor.canvas.renderAll();
  };
  const onSelectObject = (customId) => {
    const item = editor.canvas.getObjects().find((_item) => _item.customId === customId)
    editor.canvas.setActiveObject(item);
    editor.canvas.renderAll();
  };
  const bringForward = (customId) => {
    const item = editor.canvas.getObjects().find((_item) => _item.customId === customId)
    if (elements.length > 1) {
      const _layers = [...elements]
      const itemIndex = _layers.findIndex((_item) => _item.customId === customId)
      const afterIndex = itemIndex - 1
      const temp = _layers[itemIndex];
      _layers[itemIndex] = _layers[afterIndex];
      _layers[afterIndex] = temp;
      dispatch(
        UpdateCanvasLayer(_layers)
      )
    }
    editor.canvas.bringForward(item);
  }
  const activeObjects = editor?.canvas?.getActiveObjects()[0]?.customId || undefined;
  const activeHistory = (his, idx) => {
    setHistoryStatus(true)
    setActiveHistoryIndex(idx)
    // // reset ELEMENTS 
    dispatch(ResetCanvasLayer())
    const _his = his
    setCanvasHeight(_his.height);
    setCanvasWidth(_his.width);
    editor.canvas.setWidth(_his.width);
    editor.canvas.setHeight(_his.height);
    const _data = { ..._his.data }
    _data['objects'] = _his.data.objects.map(_elt => {
      const id = uniqueId()
      const item = {
        ..._elt,
        customId: id
      }
      dispatch(AddElement(item))
      return item
    })
    canvasFromJson(_data);
    editor.canvas.renderAll();
    setTimeout(() => {
      setHistoryStatus(false)
    }, 100);

  }
  useEffect(() => {
    if (editor && editor.canvas.getObjects().length > 0 && !historyStatus) {
      editor.canvas.backgroundColor = `${backgroundColor}`;
      const data = {
        data: editor.canvas.toJSON(),
        width: canvasWidth,
        height: canvasHeight,
      }
      const _his = [...history]
      _his.push(data)
      setHistory(_his)
    }
  }, [editor])
  return (
    <div className="relative bg-gray-700 text-white overflow-hidden  w-96 py-2 px-2">
      <div className='flex justify-end'>
      <IoMdCloseCircle size={35} className='hover:text-red-500 cursor-pointer' onClick={() => setLayerStatus(false)} />
      </div>
      <div className='text-white flex items-center gap-3'><FaHistory size={25} color='#ffffff' /><span>Lịch sử</span></div>

      <PerfectScrollbar
        className="flex flex-col mt-2"
        style={{ height: '35vh' }}
      >
        {history.length === 0 ? <div className='flex items-center flex-col'>
          {/* <TbHistoryOff size={100} color='#fff' /> */}
          <span>Chưa có lịch sử thiết kê</span>
        </div> : history.map((_elt, index) => (
          <p
            key={index}
            className={`px-2 hover:bg-gray-800 duration-200 rounded-md cursor-pointer flex items-center justify-between ${activeHistoryIndex === index && 'bg-gray-800'
              }`}

          >
            <div className="flex items-center gap-2 p-3" onClick={() => activeHistory(_elt, index)}>

              <FaSitemap size={25} />
              <span>Lịch sử __{index + 1}__</span>
            </div>
          </p>
        ))}
      </PerfectScrollbar>
      <div className={_dashed_border}></div>
      <div className='text-white flex items-center gap-3 mt-2'><FaLayerGroup size={25} color='#ffffff' /><h2>Thành phần</h2></div>
      {
        isArrayEmpty(elements) ? <div className='flex items-center flex-col'>
          {/* <MdLayersClear size={100} color='#fff' /> */}
          <span>Chưa có thành phần thiết kế</span>
        </div> : <PerfectScrollbar
          className="flex flex-col mt-2"
          style={{ height: '35vh' }}
        >
          {elements.map((_elt, index) => (
            <p
              key={index}
              className={`px-2 hover:bg-gray-800 duration-200 rounded-md cursor-pointer flex items-center justify-between ${activeObjects === _elt.customId && 'bg-gray-800'
                }`}

            >
              <div className='py-5 ' onClick={() => onSelectObject(_elt.customId)}>
                {_elt.type === 'i-text' ? (
                  <div className='flex items-center gap-2'>
                    <div className='flex'>
                      {
                        index !== 0 && <FaLongArrowAltUp size={20} onClick={() => bringForward(_elt.customId)} className='hover:bg-red-600 duration-200 ease-linear rounded-md p-1' />
                      }

                    </div>
                    <div className="flex items-center gap-2" onClick={() => onSelectObject(_elt.customId)}>
                      {
                        hasEmoji(_elt.text) ? <FaIcons size={20} /> : <IoText size={20} />
                      }
                      <span> {_elt.text}</span>
                    </div>
                  </div>

                ): _elt.type === 'rect' || _elt.type === 'line' || _elt.type === 'polyline' || _elt.type === 'polygon' || _elt.type === 'circle' || _elt.type === 'triangle' ?
                    <div className='flex items-center gap-2'>
                      <div className='flex'>
                        {
                          index !== 0 && <FaLongArrowAltUp size={20} onClick={() => bringForward(_elt.customId)} className='hover:bg-red-600 duration-200 ease-linear rounded-md p-1' />
                        }

                      </div>
                      <div className="flex items-center gap-2" onClick={() => onSelectObject(_elt.customId)}>
                        {
                          _elt.iType === 'circle' || _elt.type === 'circle' ? <RiCheckboxBlankCircleFill size={20} color={_elt.fill} /> : _elt.iType === 'rectangle' || (_elt.width > _elt.height && !_elt.points && !_elt.lineCoords) ? <MdRectangle size={20} color={_elt.fill} /> : _elt.iType === 'square' || (_elt.width === _elt.height && !_elt.points && !_elt.lineCoords) ? <FaSquareFull size={20} color={_elt.fill} /> : _elt.iType === 'arrow' || (_elt.points && _elt?.points.length === 9) ? <FiArrowDownRight size={20} color={_elt.fill} /> :  _elt.type === 'triangle' ? <IoTriangleSharp size={20} color={_elt.fill} /> : (_elt.points && _elt?.points.length === 6) ? <MdHexagon size={20} color={_elt.fill} /> : <FaGripLines size={20} color={_elt.fill} />
                        }
                        <span>Khối</span>
                      </div>
                    </div> : (
                      <div className='flex items-center gap-2'>
                        <div className='flex'>
                          {
                            index !== 0 && <FaLongArrowAltUp size={20} onClick={() => bringForward(_elt.customId)} className='hover:bg-red-600 duration-200 ease-linear rounded-md p-1' />
                          }
                          {/* <FaLongArrowAltDown size={20} onClic={() => sendBackwards(_elt.customId)} className='hover:bg-red-600 duration-200 ease-linear rounded-md p-1' /> */}
                        </div>
                        <div className="flex items-center gap-2" onClick={() => onSelectObject(_elt.customId)}>
                          {/* <IoImage size={20} /> */}
                          <img src={_elt.imageData ? _elt.imageData : _elt.src} alt="" height={30} width={30} />
                          <span>Hình ảnh</span>
                        </div>
                      </div>

                    )}
              </div>

              <MdClear
                className="hover:bg-red-600 rounded-sm"
                size={20}
                onClick={() => deleteElement(_elt.customId)}
              />
            </p>
          ))}
        </PerfectScrollbar>
      }


    </div>
  );
};

export default Elements;
