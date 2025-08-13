import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  KEY_LABELS,
  KEY_SCRIPTED_CREATION,
} from '../../../../reducers/createContent';
import { REDUX_NAME_CREATE_POST } from '../../../../utils/utilityFunc';
import {
  actionGetSuggChatGPT,
  updateProps,
} from '../../../../store/actions/createContent';
import styled from 'styled-components';
import PopoverTopCardItem from './popoverCardItem';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { OK } from '../../../../configs';
import { BiPlus } from 'react-icons/bi';
import trashIcon from '../../../../assets/images/icon/plan/bin.png';
import editIcon from '../../../../assets/images/icon/plan/draw.png';
import eyeIcon from '../../../../assets/images/icon/plan/eyeBg.png';
import { FiX } from 'react-icons/fi';
import { Checkbox } from 'rsuite';
import { useEffect } from 'react';
import { CreateContent } from '../../../../services/createContent';
import SingleSuggestionTag from './SingleSuggestionTag';
import NewUserTag from './NewUserTag';
import { confirmAlert } from 'react-confirm-alert';

const PopupStyled = styled.div`
  /*

All grid code is placed in a 'supports' rule (feature query) at the bottom of the CSS (Line 320). 
            
The 'supports' rule will only run if your browser supports CSS grid.

Flexbox is used as a fallback so that browsers which don't support grid will still recieve an identical layout.

*/

  /* Base styles */
  .title__card-item {
    max-height: 80px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 1rem !important;
  }
  /* Board info bar */
  .board-info-bar {
    flex-basis: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0.8rem 0;
    padding: 0 1rem;
    color: #f6f6f6;
  }

  .board-controls {
    display: flex;
  }

  .board-controls .btn {
    margin-right: 1rem;
  }

  .board-controls .btn:last-of-type {
    margin-right: 0;
  }

  .board-info-bar .btn {
    font-size: 1.4rem;
    font-weight: 400;
    transition: background-color 150ms;
    padding: 0 0.6rem;
    border-radius: 0.3rem;
    height: 3rem;
  }

  .board-info-bar .btn:hover {
    background-color: #006aa8;
  }

  .private-btn-icon,
  .menu-btn-icon {
    padding-right: 0.6rem;
    white-space: nowrap;
  }

  .board-title h2 {
    font-size: 1.8rem;
    font-weight: 700;
    white-space: nowrap;
  }

  /* Lists */

  .lists-container::-webkit-scrollbar {
    height: 5px;
  }

  .lists-container::-webkit-scrollbar-thumb {
    background-color: #3333;
    border: 15px solid #526d82;
    border-top-width: 0;
  }

  .lists-container {
    display: flex;
    align-items: start;
    overflow-x: auto;
    /* height: calc(100vh - 8.6rem); */
  }

  .list {
    flex: 0 0 27rem;
    display: flex;
    flex-direction: column;
    background-color: #e2e4e6;
    max-height: calc(100vh - 11.8rem);
    border-radius: 0.3rem;
    margin-right: 1rem;
  }

  .list:last-of-type {
    margin-right: 0;
  }

  .list-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #333;
    padding: 1rem;
  }

  .list-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-content: start;
    padding: 0 0.6rem 0.5rem;
    overflow-y: auto;
  }

  .list-items::-webkit-scrollbar {
    width: 2px;
  }

  .list-items::-webkit-scrollbar-thumb {
    background-color: #c4c9cc;
    border-right: 10px solid #e2e4e6;
  }

  .list-items li {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.3;
    background-color: #fff;
    padding: 0.65rem 0.6rem;
    color: #4d4d4d;
    border-bottom: 0.1rem solid #ccc;
    border-radius: 0.3rem;
    margin-bottom: 0.6rem;
    word-wrap: break-word;
    cursor: pointer;
  }

  .list-items li:last-of-type {
    margin-bottom: 0;
  }

  .list-items li:hover {
    background-color: #eee;
  }

  .add-card-btn {
    display: block;
    font-size: 1.4rem;
    font-weight: 400;
    color: #838c91;
    padding: 1rem;
    text-align: left;
    cursor: pointer;
  }

  .add-card-btn:hover {
    background-color: #cdd2d4;
    color: #4d4d4d;
    text-decoration: underline;
  }

  .add-list-btn {
    flex: 0 0 27rem;
    display: block;
    font-size: 1.4rem;
    font-weight: 400;
    background-color: #006aa7;
    color: #a5cae0;
    padding: 1rem;
    border-radius: 0.3rem;
    cursor: pointer;
    transition: background-color 150ms;
    text-align: left;
  }

  .add-list-btn:hover {
    background-color: #005485;
  }

  .add-card-btn::after,
  .add-list-btn::after {
    content: '...';
  }

  /*

The following rule will only run if your browser supports CSS grid.

Remove or comment-out the code block below to see how the browser will fall-back to flexbox styling. 

*/

  @supports (display: grid) {
    body {
      display: grid;
      grid-template-rows: 4rem 3rem auto;
      grid-row-gap: 0.8rem;
    }

    .masthead {
      display: grid;
      grid-template-columns: auto 1fr auto;
      grid-column-gap: 2rem;
    }

    .boards-menu {
      display: grid;
      grid-template-columns: 9rem 18rem;
      grid-column-gap: 0.8rem;
    }

    .user-settings {
      display: grid;
      grid-template-columns: repeat(4, auto);
      grid-column-gap: 0.8rem;
    }

    .board-controls {
      display: grid;
      grid-auto-flow: column;
      grid-column-gap: 1rem;
    }

    .lists-container {
      display: grid;
      grid-auto-columns: 24rem;
      grid-auto-flow: column;
      grid-column-gap: 1rem;
    }

    .list {
      display: grid;
      grid-template-rows: auto minmax(auto, 1fr) auto;
    }

    .list-items {
      display: grid;
      grid-row-gap: 0.6rem;
    }
  }
`;

const PopupSuggTagChatgpt = (props) => {
  const {
    setTagsSelect,
    tagsSelect,
    currentTag,
    setCurrentTag,
    userTags,
    onDeleteUserTag,
    onAddUserTag,
    onSaveUserTag,
  } = props;

  const dispatch = useDispatch();
  const { [KEY_LABELS]: labels } = useSelector((state) => state.createPost);
  const [labelsData, setLabelsData] = useState([]);
  const [currentCreatedLabel, setCurrentCreatedLabel] = useState(null);
  const { [KEY_SCRIPTED_CREATION]: scriptedCreation } = useSelector(
    (state) => state[REDUX_NAME_CREATE_POST]
  );

  const closePopup = () => {
    dispatch(
      updateProps([
        {
          prop: KEY_SCRIPTED_CREATION,
          value: false,
        },
      ])
    );
  };

  const handleSelectTag = (value, event) => {
    const updatedTagsSelect = new Set(tagsSelect);
    if (event) {
      updatedTagsSelect.add(value);
    } else {
      updatedTagsSelect.delete(value);
    }
    setTagsSelect(updatedTagsSelect);
  };

  const getSuggestion = async () => {
    const res = await CreateContent.getSuggestionLabels();
    if (res.status === OK) {
      return res?.data?.data || [];
    }
    return [];
  };

  const reloadSuggestion = () => {
    getSuggestion().then((data) => {
      setLabelsData(data);
    });
  };

  useEffect(() => {
    reloadSuggestion();
  }, []);

  const handleDeleteLabel = async (label) => {
    const res = await CreateContent.deleteLabel(label.id);
    if (res.status === OK) {
      reloadSuggestion();
    }
  };

  const onDeleteLabel = async (label) => {
    confirmAlert({
      title: 'Xác nhận',
      message: `Bạn có chắc chắn muốn xoá cột "${label.name}" ?`,
      buttons: [
        {
          label: 'Có',
          onClick: () => {
            handleDeleteLabel(label);
          },
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  const onSaveCreatedLabel = async (label) => {
    const res = await CreateContent.updateLabel(label.id, {
      name: label.name,
    });
    if (res.status === OK) {
      reloadSuggestion();
    }
  };

  return (
    <div>
      <PerfectScrollbar style={{ height: '350px' }}>
        {labelsData.map((_elt, index) => (
          <Fragment key={index}>
            <SingleSuggestionTag
              tag={_elt}
              index={index}
              listTags={tagsSelect}
              handleSelectTag={handleSelectTag}
              deleteTag={onDeleteLabel}
              setTag={setCurrentCreatedLabel}
            />
          </Fragment>
        ))}
        {/* user tag */}
        {userTags.map((_elt, index) => (
          <Fragment key={index}>
            <SingleSuggestionTag
              tag={_elt}
              index={index}
              listTags={tagsSelect}
              handleSelectTag={handleSelectTag}
              isUserTag={true}
              setTag={setCurrentTag}
              deleteTag={onDeleteUserTag}
            />
          </Fragment>
        ))}
      </PerfectScrollbar>
      {currentCreatedLabel || currentTag ? (
        <NewUserTag
          tag={currentCreatedLabel ? currentCreatedLabel : currentTag}
          setTag={currentCreatedLabel ? setCurrentCreatedLabel : setCurrentTag}
          onSave={currentCreatedLabel ? onSaveCreatedLabel : onSaveUserTag}
        />
      ) : (
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={onAddUserTag}
          >
            <BiPlus />
            <span>Thêm kịch bản</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PopupSuggTagChatgpt;
