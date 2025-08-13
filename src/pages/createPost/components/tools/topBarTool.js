import {
  faBold,
  faItalic,
  faUnderline,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { CLIP_PATH, TEXT_TOOL } from '../../utility';
import { Dropdown } from 'primereact/dropdown';
import { isArrayEmpty } from '../../../../configs';
import { FaAlignJustify, FaAlignLeft, FaAlignRight } from 'react-icons/fa';
import { BsAlignCenter, BsAlignEnd, BsAlignMiddle } from 'react-icons/bs';
import { BsAlignStart } from 'react-icons/bs';
import { InputText } from 'primereact/inputtext';

import { InputNumber } from 'primereact/inputnumber';
import styled from 'styled-components';
const InputSize = styled(InputNumber)`
  input {
    width: 100px !important;
    border-radius: 15px;
  }
  button {
    background-color: #fff;
  }
`;
const TopBarTool = ({ editor, type, allFonts }) => {
  const [fontfml, setFontfml] = useState(null);
  const [alignIcon, setAlignIcon] = useState(null);
  const [color, setColor] = useState('#FFFFFF');
  const [valueFont, setValueFont] = useState('');
  const item = editor?.canvas.getActiveObject();
  const [value, setValue] = useState(50);

  const addBold = (i) => {
    const o = editor.canvas.getActiveObject();
    o.set('fontWeight', 'bold');
    editor.canvas.renderAll();
  };
  const addItalics = (i) => {
    const o = editor.canvas.getActiveObject();
    o.set('fontStyle', 'italic');
    editor.canvas.renderAll();
  };
  const changeColor = (e) => {
    const o = editor.canvas.getActiveObject();
    if (o) {
      o.set('fill', color);
      // editor?.setStrokeColor(color);
      setColor(e.target.value);
      editor.canvas.renderAll();
    }
  };
  // const changeFont = () =>{ }
  const changeFontSize = async (type, inputValue) => {
    const o = editor.canvas.getActiveObject();
    if ((!type && !inputValue) || inputValue === '' || inputValue === 0) {
      setValue(null);
      return;
    }
    if (inputValue && !type) {
      setValue(inputValue);
      o.set({
        fontSize: inputValue,
      });
      editor.canvas.renderAll();
      return;
    }
    let _size = value;
    if (type === 'plus') {
      _size = ++_size;
    } else _size = --_size;
    o.set({
      fontSize: _size,
    });
    setValue(_size);
    editor.canvas.renderAll();
  };
  const alignText = (type) => {
    const o = editor.canvas.getActiveObject();
    switch (type) {
      case 'VH':
        editor.canvas.centerObjectH(o);
        editor.canvas.centerObjectV(o);
        o.setCoords();
        setAlignIcon('L');
        break;
      case 'L':
        o.set({
          left: 0,
        });
        o.setCoords();
        setAlignIcon('R');
        break;
      case 'R':
        // Align the active object to the right
        const canvasWidth = editor.canvas.width;
        const objectWidth = o.width || 0; // If width is not defined, use 0
        const rightPosition = canvasWidth - objectWidth;
        o.set({
          left: rightPosition, // Set the left position to align to the right
        });
        // Set the position of the object after alignment
        o.setCoords();
        setAlignIcon('VH');
        break;
      default:
        break;
    }
    editor.canvas.renderAll();
  };

  useEffect(() => {
    if (
      editor &&
      editor.canvas.getActiveObject() &&
      !isArrayEmpty(editor.canvas.getObjects())
    ) {
      const itemSelect = editor.canvas.getActiveObject();
      if (
        itemSelect.type === 'rect' ||
        itemSelect.type === 'line' ||
        itemSelect.type === 'polyline' ||
        itemSelect.type === 'circle' ||
        itemSelect.type === 'i-text'
      ) {
        setColor(itemSelect.fill);
      }
      if (itemSelect.type === 'i-text') {
        // Get the font size of the text object
        const fontSize = itemSelect.fontSize;
        setValue(fontSize);
        setFontfml(item.fontFamily);
      }
    }
  }, [item]);

  return (
    <div>
      {type === TEXT_TOOL &&
      editor.canvas.getActiveObject() &&
      editor.canvas.getActiveObject().type === 'i-text' ? (
        <div className="flex gap-x-3 items-center">
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-28 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={fontfml}
            disabled
          />
          <div className="relative flex items-center max-w-[8rem]">
            <button
              type="button"
              id="decrement-button"
              data-input-counter-decrement="quantity-input"
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none rounded-l-md"
              onClick={() => changeFontSize('minus')}
            >
              <svg
                className="w-3 h-3 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 2"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M1 1h16"
                />
              </svg>
            </button>
            <input
              type="number"
              id="quantity-input"
              min={1}
              max={100}
              className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 focus:ring-blue-500 focus:border-blue-500 block w-12 py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              defaultValue={value}
              value={value}
              onChange={(e) => changeFontSize(null, e.target.value)}
            />

            <button
              type="button"
              id="increment-button"
              data-input-counter-increment="quantity-input"
              className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none rounded-r-md"
              onClick={() => changeFontSize('plus')}
            >
              <svg
                className="w-3 h-3 text-gray-900 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </button>
          </div>

          <div onClick={() => addItalics(2)} color="#2d1be4" tooltip="Italic">
            <FontAwesomeIcon
              style={{ fontSize: '20px', color: '#000000' }}
              icon={faItalic}
            />
          </div>
          <div
            onClick={() => addBold(3)}
            className="item"
            color="#2d1be4"
            tooltip="Bold"
          >
            <FontAwesomeIcon
              style={{ fontSize: '20px', color: '#000000' }}
              icon={faBold}
            />
          </div>

          <input
            value={color}
            className="color rounded-sm"
            onChange={(e) => changeColor(e)}
            onClick={(e) => changeColor(e)}
            type="color"
          />
          {/* <InputSize inputId="minmax-buttons" value={value} className='w-20' onValueChange={(e) => changeFontSize(e.value)} mode="decimal" showButtons min={0} max={100} /> */}
          {editor.canvas.getActiveObject() && (
            <div>
              {alignIcon === 'L' ? (
                <FaAlignLeft
                  onClick={() => alignText('L')}
                  size={30}
                  color="#000"
                />
              ) : alignIcon === 'R' ? (
                <FaAlignRight
                  onClick={() => alignText('R')}
                  size={30}
                  color="#000"
                />
              ) : (
                <FaAlignJustify
                  onClick={() => alignText('VH')}
                  size={30}
                  color="#000"
                />
              )}
            </div>
          )}
        </div>
      ) : type === CLIP_PATH && editor.canvas.getObjects().length > 0 ? (
        <div className="flex gap-x-3 items-center">
          <input
            value={color}
            className="color"
            onChange={(e) => changeColor(e)}
            onClick={(e) => changeColor(e)}
            type="color"
          />
          {editor.canvas.getActiveObject() && (
            <div>
              {alignIcon === 'L' ? (
                <FaAlignLeft
                  onClick={() => alignText('L')}
                  size={30}
                  color="#000"
                />
              ) : alignIcon === 'R' ? (
                <FaAlignRight
                  onClick={() => alignText('R')}
                  size={30}
                  color="#000"
                />
              ) : (
                <FaAlignJustify
                  onClick={() => alignText('VH')}
                  size={30}
                  color="#000"
                />
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TopBarTool;
