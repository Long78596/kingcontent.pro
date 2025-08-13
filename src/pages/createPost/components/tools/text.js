import { fabric } from 'fabric';
import FontFaceObserver from 'fontfaceobserver';
import { uniqueId } from 'lodash';
import React, { useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch } from 'react-redux';
import { AddElement } from '../../../../store/actions/createContent';

const Text = ({ editor, allFonts, googleFonts, setGoogleFonts }) => {

  const [textValue, setTextValue] = useState('')
  const dispatch = useDispatch()
  async function loadAndUse(font1) {
    var myfont = new FontFaceObserver(font1);
    myfont
      .load()
      .then(function () {
        editor.canvas.getActiveObject().fontFamily = font1;
        editor.canvas.renderAll();
      })
      .catch(function (e) {
      });
  }
  const onAddText = (font) => {
    if (editor.canvas.getActiveObject()) {
      loadAndUse(font)
      return
    }
    const id = uniqueId()
    const textbox = new fabric.IText('Nhập văn bản', {
      fontFamily: font,
      fill: '#000000',
      customId: id,
    });
    editor.canvas.add(textbox);
    editor.canvas.discardActiveObject();
    editor.canvas.renderAll()
    dispatch(AddElement(textbox))

  };
  const handleSearchFont = () => {
    const filtered = allFonts.filter((font) => font.toLowerCase().includes(textValue.toLowerCase()));
    setGoogleFonts(filtered)
  }
  return (
    <div>
     
      {/* =============SEARCH ============== */}
      <div className='flex items-center gap-2 mb-5'>
        <input type="text" placeholder='Tìm kiếm font...' onChange={(e) => setTextValue(e.target.value)} className='w-full rounded-md text-black' />
        <button onClick={handleSearchFont}>
          <IoIosSearch size={15} className='bg-blue-500 rounded-md hover:bg-red-500 h-full w-10 duration-200 transition-all ease-out' color='#fff' />
        </button>
      </div>
      <PerfectScrollbar
        className="w-full grid-cols-2 grid gap-2"
        style={{ maxHeight: '65vh' }}
      >
        {googleFonts.map((data, index) => (
          <div
            key={index}
            className="mb-2 cursor-pointer hover:bg-gray-900 rounded-md duration-200 ease-in-out h-20 flex items-center justify-center"
            onClick={() => onAddText(data)}
          >
            <div className="flex justify-center items-center">
              <span className="p-5 text" style={{ fontFamily: data }}>
                {data}
              </span>
            </div>
          </div>
        ))}
      </PerfectScrollbar>
    </div>
  );
};

export default Text;
