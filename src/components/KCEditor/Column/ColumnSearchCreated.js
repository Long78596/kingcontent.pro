import { SearchIcon, PlusIcon } from '@heroicons/react/outline';
import { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { changeStateCreateContentForm, changeStateFormularPopup } from '../../../store/actions/editor/createContentActions'
import { changeStateCategoriesPopup, changeStateFeedbacksForm, setContentType } from '../../../store/actions/editor/editorActions'

const ColumnSearchCreated = (props) => {
  const { onSearchCreatedContents, type, changeStateCreateContentForm, changeStateFormularPopup, changeStateCategoriesPopup, changeStateFeedbacksForm, setContentType } = props;
  const [value, setValue] = useState('');

  const handleSearch = useCallback(
    (currVal = null) => {
      if (currVal !== null) onSearchCreatedContents(currVal);
      else onSearchCreatedContents(value.toLowerCase());
    },
    [onSearchCreatedContents, value]
  );

  const handleChange = (evt) => {
    setValue(evt.target.value);
    handleSearch(evt.target.value.toLowerCase());
  };

  const handleClickNew = (type='manual') => {
    switch (type) {
      case 'feedback':
        changeStateFeedbacksForm(true)
        break;
      
      case 'trend':
      case 'special':
        changeStateCreateContentForm(true)
        break
    
      default:
        changeStateCategoriesPopup(true)
        break;
    }
    setContentType(type)
  } 

  return (
    <div className="p-1">
      <div className="flex items-center">
        <div className="bg-white searchForm flex border w-full">
          <input
            className="italic text-gray-700 leading-tight focus:outline-none border-0 w-full"
            id={`search-${type}`}
            type="text"
            value={value}
            placeholder="Tìm kiếm"
            onChange={handleChange}
          />
          <div className="p-0">
            <button
              className="p-2 flex items-center justify-center hover:text-blue-700 transition-all duration-350"
              onClick={handleSearch}
            >
              <SearchIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="newItem text-center items-center justify-center p-1 ml-auto text-white">
          <span className="rounded-full bg-secondary text-black block p-1 cursor-pointer hover:bg-primary hover:text-white transition-all duration-350">
          {
            {
              'manual': <PlusIcon className={`w-6 h-6 ${type}`} onClick={()=>handleClickNew('manual')}/>,
              'formular': <PlusIcon className={`w-6 h-6 ${type}`} onClick={()=>handleClickNew('formular')}/>,
              'feedback': <PlusIcon className={`w-6 h-6 ${type}`} onClick={()=>handleClickNew('feedback')}/>,
              'special': <PlusIcon className={`w-6 h-6 ${type}`} onClick={()=>handleClickNew('special')}/>,
              'trend': <PlusIcon className={`w-6 h-6 ${type}`} onClick={()=>handleClickNew('trend')}/>,
            }[type]
          }
            
          </span>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
    changeStateCreateContentForm,
    changeStateFormularPopup,
    changeStateCategoriesPopup,
    changeStateFeedbacksForm,
    setContentType
  })(ColumnSearchCreated);
