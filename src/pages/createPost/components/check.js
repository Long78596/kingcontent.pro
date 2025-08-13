import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionToggleReplaceContent,
  toggleIsCheckVPCS,
} from '../../../store/actions/createContent';
import PopupSelectKeyReplace from './popupSelectKeyReplace';
const Check = () => {
  const { keyworksCheck, contentAvailabel, keyWordsHasInContent, textContent } =
    useSelector((state) => {
      return state.createPost;
    });
  const [isOpenPopupSelectKey, setIsOpenPopupSelectKey] = useState(false);
  const [keySelect, setKeySelect] = useState('');
  const [listKeyRepl, setListKeyRepl] = useState([]);
  const dispatch = useDispatch();
  const replaceKeyVPCS = () => {
    // eslint-disable-next-line no-restricted-globals
    const confirmRepl = confirm('Bạn chắc chắn muốn thay thế toàn bộ ?');
    if (confirmRepl) {
      let text = contentAvailabel;
      for (let i = 0; i < keyworksCheck.length; i++) {
        keyworksCheck.forEach((element) => {
          const original = element.original || '';
          const keyRepl = element.replacement.split(',');
          const random = Math.floor(Math.random() * keyRepl.length);
          if (!text.includes(original)) return;
          const obj = keyRepl.reduce(
            (a, v) => ({ ...a, [original]: keyRepl[random] }),
            {}
          );
          var RE = new RegExp(Object.keys(obj).join('|'), 'gi');
          text = text.replaceAll(RE, function (matched) {
            return obj[matched] || matched;
          });
        });
      }
      dispatch(actionToggleReplaceContent(text));
    }
  };
  const replaceKeySelectVPCS = (_key) => {
    // eslint-disable-next-line no-restricted-globals
    const confirmRepl = confirm('Bạn chắc chắn muốn thay thế từ này ?');
    if (confirmRepl) {
      let text = textContent;
      text = text.replaceAll(keySelect, _key);
      setIsOpenPopupSelectKey(false);
      dispatch(actionToggleReplaceContent(text));
    }
  };
  const toggleOpenPopupRepl = (key) => {
    setIsOpenPopupSelectKey(!isOpenPopupSelectKey);
    if (key === '') {
      setKeySelect('');
      setListKeyRepl([]);
    } else {
      setKeySelect(key);
      const list = keyworksCheck
        .find((_elt) => _elt.original === key)
        .replacement.split(',');
      setListKeyRepl(list);
    }
  };
  useEffect(() => {
    dispatch(toggleIsCheckVPCS(true));
  }, [keyworksCheck]);
  return (
    <>
      {keyWordsHasInContent.length === 0 ? (
        <div className="flex justify-center">
          <span className="font-bold">
            Mọi chuyện có vẻ ổn, chúng tôi hiện chưa tìm thấy từ khóa nào đáng
            ngờ VPCS của Facebook
          </span>
        </div>
      ) : (
        <div className="p-3 list-disc relative" style={{ minHeight: '200px' }}>
          <span>
            Những từ này có thể vi phạm chính sách của facebook khi chạy quảng
            cáo :
          </span>
          <ul className="max-h-98 overflow-y-scroll ">
            {keyWordsHasInContent.map((_elt, index) => (
              <li
                key={index}
                className="
              font-bold tooltip cursor-pointer hover:text-red-500"
                onClick={() => toggleOpenPopupRepl(_elt)}
              >
                - {_elt}
              </li>
            ))}
          </ul>
          <PopupSelectKeyReplace
            isOpenPopupSelectKey={isOpenPopupSelectKey}
            toggleOpenPopupRepl={toggleOpenPopupRepl}
            listKeyRepl={listKeyRepl}
            keySelect={keySelect}
            replaceKeySelectVPCS={replaceKeySelectVPCS}
          />

          {!contentAvailabel || /^\s*$/.test(contentAvailabel) ? null : (
            <button
              className="text-center w-full bg-blue-500 mt-2 p-2 text-white hover:bg-blue-700 transition-all"
              onClick={() => replaceKeyVPCS()}
            >
              Thay thế tự động
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Check;
