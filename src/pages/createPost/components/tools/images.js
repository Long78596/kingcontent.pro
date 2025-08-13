import React, { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { IoIosSearch } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { AddElement } from '../../../../store/actions/createContent';
import { uniqueId } from 'lodash';

const Images = ({ onUploadImage, fabric, editor }) => {
  const [images, setImages] = useState([]);
  const [textValue, setTextValue] = useState('');
  const dispatch = useDispatch();
  const handleLoadImage = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = () => {
      const base64data = reader.result;
      fabric.Image.fromURL(base64data, function (oImg) {
        const id = uniqueId();
        oImg.set({
          customId: id,
          imageData: base64data,
        });

        editor.canvas.add(oImg);
        editor.canvas.sendToBack(oImg);
        dispatch(AddElement(oImg));
        editor.canvas.renderAll();
      });
    };
    reader.readAsDataURL(blob);
  };
  const imagePixel = async (q = 'marketing') => {
    try {
      const apiKey = '16505041-ce72a3142ebb32b4249c3ef1a';
      const response = await fetch(
        `https://pixabay.com/api/?key=${apiKey}&q=${q}&image_type=photo&per_page=150&lang=vi`
      );
      const data = await response.json();

      if (data.hits) {
        setImages(data.hits);
      }
    } catch (error) {
      console.error('Error fetching images from Pixabay:', error);
    }
  };
  const handleSearchImage = () => {
    imagePixel(textValue);
  };
  useEffect(() => {
    imagePixel();
  }, []);

  return (
    <div>
      <div className="flex w-full items-center justify-center bg-grey-lighter mb-5">
        <label className="w-full flex flex-row justify-center items-center py-4  bg-gray-700 text-white rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-indigo-500">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="ml-1  text-sm leading-normal">Tải ảnh lên</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => onUploadImage(e, 11)}
            accept="json/*"
          />
        </label>
      </div>
      {/* =============SEARCH ============== */}
      <div className="flex items-center gap-2 mb-5">
        <input
          type="text"
          placeholder="Tìm kiếm hình ảnh..."
          onChange={(e) => setTextValue(e.target.value)}
          className="w-full rounded-md text-black"
        />
        <button onClick={handleSearchImage}>
          <IoIosSearch
            size={15}
            className="bg-blue-500 rounded-md hover:bg-red-500 h-full w-10 duration-200 transition-all ease-out"
            color="#fff"
          />
        </button>
      </div>
      <PerfectScrollbar
        className="w-full grid-cols-2 grid gap-2"
        style={{ height: '60vh' }}
      >
        {images.map((data, index) => (
          <div
            key={index}
            className="mb-2 text-center cursor-pointer hover:bg-gray-900 rounded-md duration-200 ease-in-out"
            onClick={() => handleLoadImage(data.webformatURL)}
          >
            <div className="flex justify-center relative">
              <img src={data.webformatURL} alt="" crossOrigin="anonymous" />
            </div>
          </div>
        ))}
      </PerfectScrollbar>
    </div>
  );
};

export default Images;
