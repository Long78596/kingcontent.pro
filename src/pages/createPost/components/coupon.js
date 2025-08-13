import React, { useEffect, useState } from 'react';
import { DEFAULT, SEVEN_SALE_SINGLE_CLOSING } from '../utility';
import { Tab } from '@headlessui/react';
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionGetGoogleSubjects,
  actionResetState,
} from '../../../store/actions/createContent';
import TabLeft from '../../../components/ContentSugesstion/TabLeft';
import TabRight from '../../../components/ContentSugesstion/TabRight';
import { API_EDIT_SUGGEST_KEYWORD_GG } from '../../../configs';
import { actionLoadingApp } from '../../../store/actions/loading';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
const Coupon = () => {
  const [statusSelect, setStatusSelect] = useState(DEFAULT);
  const { subjects } = useSelector((state) => state.createPost);
  const dispatch = useDispatch();
  const getDateByKeyWord = (key) => {
    setStatusSelect(key.title);
    dispatch(actionGetGoogleSubjects(key.title));
  };
  const reset = () => {
    setStatusSelect(DEFAULT);
    dispatch(actionResetState());
  };
  let [categories] = useState({
    'Gợi ý một câu': [],
    'Gợi ý một bài viết': [],
  });
  return (
    <>
      {statusSelect === DEFAULT ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-4 p-5">
            {SEVEN_SALE_SINGLE_CLOSING.map((_elt, index) => (
              <div key={index}>
                <div
                  className="border-2 border-gray-200 bg-gray-100 rounded-lg p-4 h-26 hover:bg-blue-50 cursor-pointer flex justify-center transition-all"
                  onClick={() => {
                    getDateByKeyWord(_elt);
                    setStatusSelect(_elt);
                    dispatch(actionLoadingApp(true));
                  }}
                >
                  <img src={_elt.icon} className="w-16" />
                </div>
                <p className="text-center"> {_elt.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center items-center relative mb-2 mt-2">
            <button
              onClick={() => reset()}
              className="bg-blue-500 hover:bg-red-500 text-white ml-2 p-2 rounded-md flex gap-1 items-center absolute left-0 transition-all duration-150"
            >
              {' '}
              <BiArrowBack size={20} />
            </button>
            <div>
              <span className="font-bold text-base">{statusSelect.title}</span>
            </div>
            <div></div>
            <div></div>
          </div>

          <div className="w-full p-2">
            <Tab.Group>
              <Tab.List className="flex space-x-1 rounded-xl bg-gray-300 p-1">
                {Object.keys(categories).map((category) => (
                  <Tab
                    key={category}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 leading-5 text-blue-700 font-bold',
                        'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                        selected
                          ? 'bg-white shadow'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-black'
                      )
                    }
                  >
                    {category}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel>
                  <TabLeft
                    typeSug={statusSelect}
                    api={API_EDIT_SUGGEST_KEYWORD_GG}
                    query={'title'}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <TabRight
                    typeSug={statusSelect}
                    api={API_EDIT_SUGGEST_KEYWORD_GG}
                    query={'title'}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </>
      )}
    </>
  );
};

export default Coupon;
