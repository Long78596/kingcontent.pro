import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { actionUpdateVPCSKey } from '../../store/actions/createContent';
import Editor from './Editor';
// import PopupSelectCate from './p';
import Tools from './Tools';
import { Transition } from '@headlessui/react';
import PoupPlan from './poupPlan';
import { DEFAULT } from './utility';
import { setContentDetailToShow } from '../../store/actions/Contents/contentActions';
import PhotoEditor from './components/photoeditor';
const CreatePost = () => {
  const [isEditor, setIsEditor] = useState(false);
  const [images, setImages] = React.useState([]);
  const [isRightImage, setIsRightImage] = useState(false);
  const [imagesRightEditor, setImagesRightEditor] = useState([]);
  const dispatch = useDispatch();
  const [collapse, setCollapse] = useState(false);
  const [titleType, setTitleType] = useState(DEFAULT);
  useEffect(() => {
    dispatch(setContentDetailToShow(null));
    dispatch(actionUpdateVPCSKey());
  }, []);

  return (
    <>
      {!isEditor ? (
        <div className="flex mb-10 md:flex-col lg:flex-row gap-3">
          <div className={`${collapse ? 'w-full' : 'lg:w-5/12'}`}>
            <Editor
              collapse={collapse}
              setCollapse={setCollapse}
              setTitleType={setTitleType}
              setIsEditor={setIsEditor}
              setIsRightImage={setIsRightImage}
              setImagesRightEditor={setImagesRightEditor}
            />
          </div>
          <Transition
            show={!collapse}
            className={`${collapse ? 'hidden' : 'lg:w-7/12'}`}
          >
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div>
                <Tools
                  collapse={collapse}
                  setCollapse={setCollapse}
                  titleType={titleType}
                  setTitleType={setTitleType}
                  setIsEditor={setIsEditor}
                  images={images}
                  setImages={setImages}
                  setIsRightImage={setIsRightImage}
                  setImagesRightEditor={setImagesRightEditor}
                />
              </div>
            </Transition.Child>
          </Transition>

          {/* <PopupSelectCate /> */}
          <PoupPlan />
        </div>
      ) : (
        <PhotoEditor
          setIsEditor={setIsEditor}
          images={isRightImage ? imagesRightEditor : images}
          setImages={isRightImage ? setImagesRightEditor : setImages}
          isRightImage={isRightImage}
        />
      )}
    </>
  );
};

export default CreatePost;
