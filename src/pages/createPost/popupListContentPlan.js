import { Dialog, Transition } from '@headlessui/react';
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  FiInfo,
  FiPlayCircle,
  FiPlusCircle,
  FiRefreshCcw,
  FiSave,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import '../../assets/css/styles.css';
import trashIcon from '../../assets/images/icon/plan/bin.png';
import editIcon from '../../assets/images/icon/plan/draw.png';
import eyeIcon from '../../assets/images/icon/plan/eyeBg.png';
import compareIcon from '../../assets/images/icon/plan/compareIcon.png';
import Select from '../../components/select';
import noImage from '../../assets/images/pictures.png';
import {
  actionAddImage,
  actionGetLabels,
  actionGetPlan,
  actionGetSuggChatGPT,
  actionSelectLabel,
  actionTogglePopupSelectCate,
  actionUpdateStep1,
  actionUpdateStep2,
  actionUpdateSyncRequestPedding,
  backEditorScreen,
  deletePostTextWithAdminSuggestion,
  resetCreateContent,
  toggleEditorText,
  updateProps,
} from '../../store/actions/createContent';
import PopoverTopCardItem from './components/planCpn/popoverCardItem';
import {
  UPLOAD_TYPE_IMAGE,
  UPLOAD_TYPE_VIDEO,
  _input_style,
  getObject_create_post,
} from './utility';
import PopupSelectTag from './components/planCpn/popupSelectTag';
import {
  KEY_HASH_VIDEO_OR_IMAGE,
  KEY_ITEM_EDIT,
  KEY_LABELS,
  KEY_NOTE,
  KEY_PLANS,
  KEY_PLAN_DATA,
  KEY_PLAN_SELECT,
} from '../../reducers/createContent';
import { CreateContent } from '../../services/createContent';
import PopupDetailContentPlan from './components/planCpn/popupDetail';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { confirmAlert } from 'react-confirm-alert';
import { BsFillPinAngleFill } from 'react-icons/bs';
import ReactPlayer from 'react-player';
import ContentDetail from '../../components/CategoriesContent/ContentDetail/ContentDetail';
import { setContentCompare, setContentDetailToShow } from '../../store/actions/Contents/contentActions';
import { BiPlus } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { isArrayEmpty, OK } from '../../configs';
import { RiArrowGoBackLine } from 'react-icons/ri';
import { actionPushContentToCreateContentScreen } from '../../store/actions/homepage';
import { is } from 'immutable';
import { breakWord } from '../../helpers';
import { Tooltip } from 'primereact/tooltip';
import PopupCompareContent from './components/PopupCompareContent';
import LoadingApp from '../../components/LoadingApp';
import { tiktokService } from '../../services/tiktok';
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
    height: calc(90vh - 8.6rem);
    overflow-y: hidden;
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

  .react-player > video {
    object-fit: cover;
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
      grid-auto-columns: 21rem;
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
const PopupListContentPlan = ({ isOpen = true }) => {
  const {
    [KEY_PLAN_SELECT]: plan,
    [KEY_PLAN_DATA]: contentInPlan,
    [KEY_LABELS]: labels,
    textContent,
    imageSelect,
    syncRequestPedding,
    isCreateToHomepage,
    step_2,
  } = useSelector((state) => state.createPost);
  const contentDetailToShow = useSelector(
    (state) => state.contents.contentDetailToShow
  );
  const contentCompare = useSelector(
    (state) => state.contents.contentCompare
  );

  const { user } = useSelector((state) => state.userReducer);
  const [isShowPopupEditTag, setIsShowPopupEditTag] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const dragItem = useRef();
  const [listLoadingChat, setListLoadingChat] = useState(new Set());
  const [savePlanLoadingChatGPT, setSavePlanLoadingChatGPT] = useState('');
  const dragOverItem = useRef();
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [itemSelect, setItemSelect] = useState('');
  const [originalPlan, setOriginalPlan] = useState([]);
  const [hasAIContent, setHasAIContent] = useState(false);
  const [isOpenSelectTag, setIsOpenSelectTag] = useState(false);
  const [itemViewDetail, setItemViewDetail] = useState({});
  const [hasAutoSuggestion, setHasAutoSuggestion] = useState(false);
  const videoLinkMP4Regex = /\.(mp4|mov|avi|mkv|wmv|flv)$/i;
  const facebookVideoRegex = /video\.fdad3-6\.fna\.fbcdn\.net/i;
  const filterList = [
    {
      id: 1,
      name: 'Theo thời gian (Cũ , mới)',
      unavailable: false,
      type: 'NEW',
    },
    { id: 2, name: 'Nhiều content nhất', unavailable: false, type: 'OLD' },
  ];
  const [selected, setSelected] = useState(filterList[0]);

  // check if plan has auto suggestion
  useEffect(() => {
    if (contentInPlan) {
      const { labels = [] } = contentInPlan;
      if (labels.length > 0) {
        const hasAutoSuggestion = labels.some(
          (label) =>
            label.contents.length === 1 &&
            label.contents[0].post_text === 'ADMIN_SUGGESTION'
        );
        setHasAutoSuggestion(hasAutoSuggestion);
      }
    }
  }, [contentInPlan]);

  const handleOnchangeSelect = (item) => {
    setSelected(item);
    if (item.type === 'NEW') {
      const copyListItems = [...originalPlan.labels];
      const filter = copyListItems.sort((o1, o2) => {
        return new Date(o1.created) - new Date(o2.created);
      });
      dispatch(
        updateProps([
          {
            prop: KEY_PLAN_DATA,
            value: { ...contentInPlan, labels: filter },
          },
        ])
      );
    } else {
      const copyListItems = [...originalPlan.labels];
      const filter = copyListItems.sort((o1, o2) => {
        return o2.contents.length - o1.contents.length;
      });
      dispatch(
        updateProps([
          {
            prop: KEY_PLAN_DATA,
            value: { ...contentInPlan, labels: filter },
          },
        ])
      );
    }
  };
  const dispatch = useDispatch();
  const onDragStart = (evt, parentIdex, subIndex, contentId) => {
    setItemSelect(contentId);
    let element = evt.currentTarget;
    element.classList.add('dragged');
    element.classList.add('bg-card-drag');
    evt.dataTransfer.setData('text/plain', evt.currentTarget.id);
    evt.dataTransfer.effectAllowed = 'move';
    dragItem.current = { parentIdex, subIndex, contentId };
  };
  const onDragEnd = (evt, parentIdex, labelId) => {
    dragOverItem.current = { parentIdex, labelId };
    evt.currentTarget.classList.remove('dragged');
    evt.currentTarget.classList.remove('bg-card-drag');
  };
  const onDragEnter = (evt, parentIdex) => {
    evt.preventDefault();
    let element = evt.currentTarget;
    element.classList.add('dragged-over');
    evt.dataTransfer.dropEffect = 'move';
    dragOverItem.current = { parentIdex };
  };
  const onDragLeave = (evt, parentIdex) => {
    dragOverItem.current = { parentIdex };
  };
  const onDragOver = (evt, parentIdex) => {
    let element = evt.currentTarget;
    element.classList.remove('dragged');
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'move';
    dragOverItem.current = { parentIdex };
  };
  const onDrop = async (evt, labelId) => {
    evt.preventDefault();
    evt.currentTarget.classList.remove('dragged-over');
    const copyListItems = [...contentInPlan.labels];
    const dragItemContent =
      copyListItems[dragItem.current.parentIdex]['contents'][
      dragItem.current.subIndex
      ];
    copyListItems[dragItem.current.parentIdex]['contents'].splice(
      dragItem.current.subIndex,
      1
    );
    copyListItems[dragOverItem.current.parentIdex]['contents'].unshift(
      dragItemContent
    );
    dragItem.current = null;
    dragOverItem.current = null;

    const filterItem = copyListItems.map((_elt) => {
      const newArr = _elt.contents.map((_sub) => {
        return { ..._sub, isSearch: undefined };
      });
      return { ..._elt, contents: newArr };
    });
    dispatch(
      updateProps([
        {
          prop: KEY_PLAN_DATA,
          value: { ...contentInPlan, labels: filterItem },
        },
      ])
    );
    const resUpdate = await CreateContent.updateLabelIdInContent(
      itemSelect,
      labelId
    );
    if (resUpdate.status === OK) {
      setInputValue('');
      setItemSelect(null);
      toast.success('Thao tác thành công !');
    }
  };

  const checkHasOtherAIContents = (contentId) => {
    // reduce all contents in plan to array
    const AIContents = contentInPlan.labels.reduce((acc, label) => {
      const contents = label.contents.filter(
        (content) => content?.saved === true
      );
      return [...acc, ...contents];
    }, []);
    // check if has other AI contents
    const hasAIContents = AIContents.some(
      (content) => content.id !== contentId
    );
    return hasAIContents;
  };

  const handleEditContent = (content, labelId, saved) => {
    const {
      id,
      post_text,
      note,
      medias,
      media_type,
      media_url = '',
      wishlist = 0,
      is_reels = 0
    } = content;

    if (hasAIContent && checkHasOtherAIContents(id)) {
      confirmAlert({
        title: 'Cảnh báo !',
        message: (
          <span className="warning-content">
            Vui lòng nhấn vào biểu tượng SAVE để lưu lại kết quả gợi ý trước khi
            thoát khỏi màn hình này để tạo content mới
          </span>
        ),
        buttons: [
          {
            label: 'Xem lại',
            onClick: () => { },
          },
          {
            label: 'Tiếp tục',
            onClick: () => {
              let mediass = medias;
              if (media_type === 'video' && media_url) {
                mediass.push({
                  type: 'video',
                  url: media_url,
                });
              }
              dispatch(actionUpdateStep2(false));
              dispatch(actionTogglePopupSelectCate(true));
              dispatch(
                actionPushContentToCreateContentScreen(
                  post_text,
                  medias.length > 0 ? medias : mediass,
                  media_type,
                  wishlist === 1 || is_reels === 1 ? true : false,
                  true
                )
              );
              dispatch(actionSelectLabel(labelId));
              dispatch(
                updateProps([
                  {
                    prop: KEY_ITEM_EDIT,
                    value: saved ? null : content,
                  },
                  {
                    prop: 'imageSelect',
                    value: mediass,
                  },
                  {
                    prop: KEY_HASH_VIDEO_OR_IMAGE,
                    value: media_type,
                  },
                  {
                    prop: KEY_NOTE,
                    value: note,
                  },
                ])
              );
            },
          },
        ],
      });
      return;
    } else {
      let mediass = medias;
      if (media_type === 'video' && media_url) {
        mediass = [
          {
            type: 'video',
            url: media_url,
          },
        ];
      }
      dispatch(actionUpdateStep2(false));
      dispatch(actionTogglePopupSelectCate(true));
      dispatch(
        actionPushContentToCreateContentScreen(
          post_text,
          medias.length > 0 ? medias : mediass,
          media_type,
          wishlist === 1 || is_reels === 1 ? true : false,
          true
        )
      );
      dispatch(actionSelectLabel(labelId));
      dispatch(
        updateProps([
          {
            prop: KEY_ITEM_EDIT,
            value: saved ? null : content,
          },
          {
            prop: 'imageSelect',
            value: mediass,
          },
          {
            prop: KEY_HASH_VIDEO_OR_IMAGE,
            value: media_type,
          },
          {
            prop: KEY_NOTE,
            value: note,
          },
        ])
      );
    }
  };
  const handleBack = () => {
    if (hasAIContent) {
      confirmAlert({
        title: 'CẢNH BÁO',
        message: (
          <span>
            <span className="font-bold text-red-500">
              Vui lòng nhấn nút LƯU
            </span>{' '}
            bên dưới từng content để giữ lại kết quả gợi ý!
          </span>
        ),
        buttons: [
          {
            label: 'THOÁT',
            className: 'whitespace-nowrap w-auto',
            onClick: async () => {
              dispatch(actionUpdateStep1(true));
              dispatch(actionUpdateStep2(false));
            },
          },
          {
            label: 'KIỂM TRA LẠI',
            className: 'whitespace-nowrap w-auto',
            onClick: () => { },
          },
        ],
      });
    } else {
      dispatch(actionUpdateStep1(true));
      dispatch(actionUpdateStep2(false));
    }
  };

  const handleSavePost = async (post, labelId, planId, id) => {
    confirmAlert({
      title: 'Cảnh báo !',
      message: (
        <span className="warning-content">
          Bạn có chắc chắn muốn lưu nội dùng này !
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            const res = await CreateContent.createPost(
              getObject_create_post(
                undefined,
                post.post_text,
                [],
                '',
                user._id,
                labelId,
                planId,
                ''
              )
            );
            if (res.status === OK) {
              const newData = { ...contentInPlan };
              const labelsFind = newData.labels.findIndex(
                (_elt) => _elt.id === labelId
              );
              const index = newData.labels[labelsFind].contents.findIndex(
                (item) => item.id === id
              );
              newData.labels[labelsFind].contents[index] = res.data.data;
              dispatch(
                updateProps([
                  {
                    prop: KEY_PLAN_DATA,
                    value: newData,
                  },
                ])
              );
              toast.success('Lưu bài viết thành công');
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => { },
        },
      ],
    });
  };

  const handleDeleteContent = async (parentIdex, id, saved) => {
    confirmAlert({
      title: 'Cảnh báo !',
      message: (
        <span className="warning-content">
          Bạn có chắc chắn muốn xoá nội dùng này !
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            if (saved) {
              const copyListItems = [...contentInPlan.labels];
              const newArray = copyListItems[parentIdex].contents.filter(
                (elt) => elt.id !== id
              );
              copyListItems[parentIdex].contents = newArray;
              dispatch(
                updateProps([
                  {
                    prop: KEY_PLAN_DATA,
                    value: { ...contentInPlan, labels: copyListItems },
                  },
                ])
              );
              toast.success('Xoá nội dung thành công !');
            } else {
              const res = await CreateContent.deleteContent(id);
              if (res.status === OK) {
                const copyListItems = [...contentInPlan.labels];
                const newArray = copyListItems[parentIdex].contents.filter(
                  (elt) => elt.id !== id
                );
                copyListItems[parentIdex].contents = newArray;
                dispatch(
                  updateProps([
                    {
                      prop: KEY_PLAN_DATA,
                      value: { ...contentInPlan, labels: copyListItems },
                    },
                  ])
                );
                toast.success('Xoá nội dung thành công !');
              }
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => { },
        },
      ],
    });
  };

  const createContent = () => {
    dispatch(resetCreateContent());
    dispatch(actionUpdateStep1(false));
    dispatch(actionUpdateStep2(false));
    dispatch(actionTogglePopupSelectCate(true));
    dispatch(updateProps([{ prop: KEY_PLAN_SELECT, value: plan }]));
  };

  const handleQuestionChatGPT = (command, label_id, pla) => {
    const _newSync = [...syncRequestPedding];
    _newSync.push({
      planId: plan?.id,
      label_id: label_id,
      title: command,
      status: 'REJECT',
    });
    dispatch(actionUpdateSyncRequestPedding(_newSync));
    dispatch(actionGetSuggChatGPT(label_id));
    setHasAIContent(true);
  };

  const handleSearchContent = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value !== '' && value) {
      const copyListItems = [...originalPlan.labels];
      const filterItem = copyListItems.map((_elt) => {
        const newArr = _elt.contents.filter((_sub) => {
          if (
            _sub?.post_text.toLowerCase().includes(value) ||
            _elt?.name.toLowerCase().includes(value)
          ) {
            return _sub;
          }
        });
        return { ..._elt, contents: newArr };
      });
      dispatch(
        updateProps([
          {
            prop: KEY_PLAN_DATA,
            value: { ...contentInPlan, labels: filterItem },
          },
        ])
      );
    } else {
      dispatch(
        updateProps([
          {
            prop: KEY_PLAN_DATA,
            value: originalPlan,
          },
        ])
      );
    }
  };

  const handleViewDetail = (item) => {
    const {
      medias = [],
      post_text = '',
      media_url = '',
      media_type = 'image',
      image = [],
      is_active_preset = false,
      preset = null,
      random_preset = null,
    } = item;

    if (!item.media_type && item.medias.length === 0) {
      dispatch(
        setContentDetailToShow({
          post_text: item.post_text,
          medias: [''],
          isCreatedContent: true,
          media_url,
          media_type,
          is_active_preset,
          preset,
          random_preset,
        })
      );
    }
    if (!item.media_type && item.image.length !== 0) {
      dispatch(
        setContentDetailToShow({
          post_text: post_text,
          medias: medias || image,
          isCreatedContent: true,
          media_url,
          media_type,
        })
      );
    }
    if (item?.media_type === UPLOAD_TYPE_IMAGE) {
      const newImages = medias.map((_elt) => {
        if (_elt.url) {
          return _elt.url;
        } else {
          return _elt;
        }
      });
      dispatch(
        setContentDetailToShow({
          post_text: item.post_text,
          images: newImages,
          isCreatedContent: true,
          media_url,
          media_type,
        })
      );
    } else if (item?.media_type === UPLOAD_TYPE_VIDEO) {
      dispatch(
        setContentDetailToShow({
          post_text: item.post_text,
          medias,
          isCreatedContent: true,
          media_url,
          media_type,
        })
      );
    }
  };

  const handleCompareContent = async (content) => {
    dispatch(
      setContentCompare(content)
    );
    if (content.source_type == "tiktok_to_text" && content.media_url == null) {
      var res = await tiktokService.getVideoMediaURL(content.original_link.split('/').slice(-1));
      if (res.status == OK) {
        content.media_url = res.data.data;
        dispatch(
          setContentCompare(null)
        );
        dispatch(
          setContentCompare(content)
        );
      }
    }

  };

  const createNewContentByLabelId = (id) => {
    if (hasAIContent) {
      confirmAlert({
        title: 'Cảnh báo !',
        message: (
          <span className="warning-content">
            Vui lòng nhấn vào biểu tượng SAVE để lưu lại kết quả gợi ý trước khi
            thoát khỏi màn hình này để tạo content mới
          </span>
        ),
        buttons: [
          {
            label: 'Xem lại',
            onClick: () => { },
          },
          {
            label: 'Tiếp tục',
            onClick: () => {
              setHasAIContent(false);
              createContent();
              dispatch(actionSelectLabel(id));
            },
          },
        ],
      });
      return;
    }
    createContent();
    dispatch(actionSelectLabel(id));
  };

  const handelPinItem = () => { };

  const handelEditTag = (item) => {
    setItemViewDetail(item);
    setIsShowPopupEditTag(true);
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(actionGetPlan(plan?.id, setOriginalPlan));
    }
  }, [isOpen, plan?.id]);


  // Nếu có một cột content có "is_generating == true" thì mỗi 5s fetch data mới 1 lần
  // Đây là cột có content đang đợi tạo mới với AI
  var intervalAutoRefresh = null;
  useEffect(() => {
    if (contentInPlan?.labels.some((item) => item.is_generating)) {
      intervalAutoRefresh = setInterval(() => {
        dispatch(actionGetPlan(plan?.id, setOriginalPlan));
      }, 5000);
    }
    else if (intervalAutoRefresh != null) {
      clearInterval(intervalAutoRefresh);
      intervalAutoRefresh = null;
    }
    return () => clearInterval(intervalAutoRefresh);
  }, [contentInPlan]);

  if (contentDetailToShow) {
    return <ContentDetail />;
  }
  else if (contentCompare) {
    return <PopupCompareContent />;
  }

  const renderContentsInPlan = (labels = []) => {
    return (
      <section className="lists-container">
        {labels.map((label, parentIndex) => {
          const {
            name,
            color,
            contents,
            id: labelId,
            is_pin_to_top,
            keyword,
            note,
            is_generating,
          } = label;
          return (
            <div
              key={parentIndex}
              className={` rounded-lg mb-5 bg-gray-100 shadow-lg w-full`}
              style={{ height: '100%%' }}
              onDragLeave={(e) => onDragLeave(e, parentIndex, labelId)}
              onDragEnter={(e) => onDragEnter(e, parentIndex, labelId)}
              onDragOver={(e) => onDragOver(e, parentIndex, labelId)}
              onDrop={(e) => onDrop(e, labelId)}
            >
              <div
                className={`flex relative rounded-t-2xl justify-center px-2 items-center text-gray-200 p2-4`}
                style={{
                  background: `linear-gradient(90deg, rgba(0, 0, 0, .4) 90%, RGBA(0, 0, 0, .4) 90%, rgba(0, 0, 0, .4) 90%, rgba(0, 0, 0, .4) 100%),
                  ${color}`,
                }}
              >
                {is_pin_to_top === 1 && (
                  <div className="absolute left-5">
                    <BsFillPinAngleFill size={25} />
                  </div>
                )}

                <h4
                  className={`font-bold uppercase text-center text-base select-none	cursor-not-allowed p-2 rounded-md ${color === '#ffffff' ? 'text-black' : 'text-white'
                    }`}
                  title={name}
                  style={{
                    width: '300px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    resize: 'horizontal',
                  }}
                >
                  {name}
                </h4>
                <div className="absolute right-0">
                  <PopoverTopCardItem
                    id={parentIndex}
                    contents={contents}
                    labelId={labelId}
                    name={name}
                    color={color}
                    originalPlan={contentInPlan}
                    handelEditTag={handelEditTag}
                    is_pin_to_top={is_pin_to_top}
                    setOriginalPlan={setOriginalPlan}
                    keyword={keyword}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-2">
                {contents.length === 1 &&
                  contents[0].post_text === 'ADMIN_SUGGESTION' && (
                    <div
                      className="flex justify-center mt-2"
                      style={{ height: '280px' }}
                    >
                      <div className="flex justify-center items-center">
                        {syncRequestPedding.some(
                          (_elt) => _elt.label_id === labelId
                        ) ? (
                          <div>
                            <div className="flex justify-center">
                              <button className="font-bold text-base text-center bg-gray-600 p-5 hover:bg-gray-900 shadow-md rounded-lg duration-200 transition-all">
                                <FiRefreshCcw
                                  size={25}
                                  color="#fff"
                                  className="animate-spin"
                                />
                              </button>
                            </div>
                            <div>
                              <p className="mt-2 font-bold px-5 text-center">
                                Vui lòng chờ chút để máy tính gợi ý kết quả cho
                                bạn
                              </p>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="font-bold text-base text-center bg-gray-600 p-5 hover:bg-gray-900 shadow-md rounded-lg duration-200 transition-all"
                            onClick={() =>
                              handleQuestionChatGPT(
                                `${keyword} ${contents[0].note}`,
                                labelId
                              )
                            }
                          >
                            <BiPlus size={25} color="#fff" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
              </div>
              <div
                className="w-full pb-5 h-full overflow-auto"
                style={{
                  maxHeight: 'calc(100vh - 290px)',
                }}
              >
                <div className="px-4 p-2  flex flex-col">
                  {is_generating ? <LoadingApp /> : <></>}
                  {contents.map(
                    (
                      {
                        id,
                        post_text,
                        medias,
                        created,
                        keyword,
                        note,
                        saved,
                        media_type,
                        media_url,
                        preset_id,
                        is_active_preset = false,
                        preset = null,
                        random_preset = null,
                        is_ai_generated = false,
                        original_content = null,
                        original_link,
                        source_type,
                        is_reels = 0,
                      },
                      index
                    ) => {
                      const isNoImage = medias.length === 0 || !medias[0];
                      return (
                        <div
                          draggable="true"
                          id={`${id}`}
                          title="Di chuyển thẻ bằng cách kéo thả chuột !"
                          className={`border-2 mb-2 p-4 rounded-md shadow-sm cursor-move bg-white ${post_text === 'ADMIN_SUGGESTION' ? 'hidden' : ''
                            }`}
                          onDragStart={(e) =>
                            onDragStart(e, parentIndex, index, id)
                          }
                          onDragEnd={(e) => onDragEnd(e, parentIndex, index)}
                          key={index}
                        >
                          <div className="flex gap-3 relative">
                            <div className="w-1/3 relative">
                              {media_type === 'video' ? (
                                <>
                                  <ReactPlayer
                                    className="react-player rounded-md w-full h-full overflow-hidden"
                                    height={'100'}
                                    url={media_url || ''}
                                    playing={false}
                                    width={'100'}
                                  />
                                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-2">
                                    <div className="w-10 h-10 bg-gray-400 rounded-full opacity-50">
                                      <FiPlayCircle className="w-full h-full text-white" />
                                    </div>
                                  </div>
                                </>
                              ) : isNoImage && (preset || random_preset) ? (
                                <div
                                  className="bg-cover bg-no-repeat bg-center h-24 rounded-lg text-transparent"
                                  style={{
                                    backgroundImage: `url(${preset?.url || random_preset?.url
                                      })`,
                                  }}
                                >
                                  &nbsp;
                                </div>
                              ) : (
                                <img
                                  src={medias[0] ? medias[0] : noImage}
                                  className="rounded-md"
                                  alt=""
                                />
                              )}
                            </div>
                            <div className="w-9/12">
                              <p
                                className="title__card-item pt-2"
                                dangerouslySetInnerHTML={{
                                  __html: breakWord(post_text),
                                }}
                              ></p>
                              <span className="text-gray-600 font-bold">
                                {moment(created).format('YYYY-MM-DD H:mm')}
                              </span>
                            </div>
                            {/* show info icon for Note */}
                            {note && (
                              <div className="absolute -top-2 -right-2 bg-primary rounded-full">
                                {/* show tooltip */}
                                <Tooltip
                                  target={`.note-${id}`}
                                  className="z-9999 max-w-350 whitespace-pre-wrap"
                                />
                                <FiInfo
                                  size={20}
                                  className={`text-white cursor-pointer note-${id}`}
                                  data-pr-tooltip={note}
                                  data-pr-position="left"
                                />
                              </div>
                            )}
                          </div>
                          <div className="w-full h-2 border-gray-100 border-b-2 border-dashed"></div>
                          {/* tool */}
                          <div className="flex justify-end gap-2 mt-2">
                            {saved && (
                              <button
                                title="Lưu bài viết"
                                className="p-1 rounded-full text-center"
                                style={{
                                  backgroundColor: '#bac8d3',
                                  width: '30px',
                                  height: '30px',
                                }}
                                onClick={() =>
                                  handleSavePost(
                                    { post_text, medias },
                                    labelId,
                                    plan?.id,
                                    id
                                  )
                                }
                              >
                                <FiSave size={25} color="#fff" />
                              </button>
                            )}
                            {is_ai_generated ?
                              (
                                <button title="So sánh nội dung gốc">
                                  <img
                                    src={compareIcon}
                                    alt=""
                                    width={30}
                                    height={30}
                                    onClick={() => handleCompareContent({
                                      post_text,
                                      original_content,
                                      original_link,
                                      source_type,
                                      media_url,
                                      media_type
                                    })}
                                  />
                                </button>
                              ) : (<></>)
                            }
                            <button title="Xem thông tin">
                              <img
                                src={eyeIcon}
                                alt=""
                                width={30}
                                height={30}
                                onClick={() =>
                                  handleViewDetail({
                                    post_text,
                                    image: medias,
                                    created,
                                    media_type,
                                    medias,
                                    media_url,
                                    is_active_preset,
                                    preset,
                                    random_preset,
                                  })
                                }
                              />
                            </button>
                            <button
                              title="Sửa nội dung"
                              onClick={() =>
                                handleEditContent(
                                  {
                                    id,
                                    post_text,
                                    note,
                                    medias,
                                    media_type,
                                    media_url,
                                    preset_id,
                                    is_active_preset,
                                    is_reels
                                  },
                                  labelId,
                                  saved
                                )
                              }
                            >
                              <img
                                src={editIcon}
                                alt=""
                                width={30}
                                height={30}
                              />
                            </button>
                            <button
                              className="Xoá nội dung"
                              onClick={() =>
                                handleDeleteContent(parentIndex, id, saved)
                              }
                            >
                              <img
                                src={trashIcon}
                                alt=""
                                width={30}
                                height={30}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
                <div className="px-6 p-2">
                  {contents.length > 1 && keyword && contents[0].note && contents[0].post_text === 'ADMIN_SUGGESTION' && (
                    <>
                      <button
                        disabled={syncRequestPedding.some(
                          (_elt) => _elt.label_id === labelId
                        )}
                        className="bg-indigo-500 text-white p-3 mb-2 hover:bg-gray-400 w-full rounded-md shadow-md"
                        onClick={() =>
                          handleQuestionChatGPT(
                            `${keyword} ${contents[0].note}`,
                            labelId
                          )
                        }
                      >
                        {syncRequestPedding.some(
                          (_elt) => _elt.label_id === labelId
                        )
                          ? 'Đang lấy gợi ý ...'
                          : 'Tạo content với AI'}
                      </button>
                    </>
                  )}
                  {(contents.length != 1 || contents[0].post_text !== 'ADMIN_SUGGESTION') && (
                    <button
                      className="bg-blue-500 text-white p-3 hover:bg-gray-400 w-full rounded-md shadow-md"
                      onClick={() => createNewContentByLabelId(labelId)}
                    >
                      Tạo content thủ công
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    );
  };

  return (
    <Fragment>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-9999 w-screen mt-1"
          onClose={() => { }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="w-full h-full bg-gray-100 p-2 mb-5 items-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold uppercase text-base">
                        {plan?.name || ''}
                      </span>
                      <div className="flex gap-5">
                        {plan &&
                          !/^\s*$/.test(textContent) &&
                          !isCreateToHomepage.status && (
                            <span
                              onClick={() => dispatch(backEditorScreen())}
                              className="bg-white border-2 font-bold border-blue-500 rounded-full shadow-md cursor-pointer p-2 hover:bg-blue-500 hover:text-white"
                              title="Tiếp tục soạn thảo"
                            >
                              {/* <AiOutlineEdit color='green' size={25} /> */}
                              Tiếp tục soạn thảo
                            </span>
                          )}
                        <button
                          onClick={() => handleBack()}
                          className="bg-white rounded-full shadow-md p-3"
                          title={`Thoát`}
                        >
                          <RiArrowGoBackLine color="red" size={25} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between gap-2">
                      <button
                        onClick={() => createContent()}
                        className="bg-blue-500 rounded-md shadow-md h-12 text-white flex w-1/5 items-center gap-2 p-2"
                      >
                        <FiPlusCircle size={25} color="#fff" />
                        <span>Tạo content mới</span>
                      </button>
                      <div
                        className="flex items-center relative"
                        style={{ width: '60%' }}
                      >
                        <input
                          type="text"
                          placeholder="Tìm theo nội dung content, hashtag#"
                          value={inputValue}
                          onChange={(e) => handleSearchContent(e)}
                          className={`${_input_style}`}
                        />
                        <FiSearch
                          className="absolute right-2"
                          size={25}
                          color="#000"
                        />
                      </div>
                      <Select
                        data={filterList}
                        onChangeFunc={handleOnchangeSelect}
                        selected={selected}
                        style={{ width: '20%' }}
                      />
                    </div>
                  </div>

                  <PopupStyled>
                    {contentInPlan?.labels.length === 0 && (
                      <div className="flex justify-center">
                        <span className="font-bold text-base text-center uppercase">
                          Không có nội dung nào ở đây
                        </span>
                      </div>
                    )}
                    {renderContentsInPlan(contentInPlan?.labels)}
                  </PopupStyled>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* <PopupSelectTag isOpen={isOpenSelectTag} setOpen={setIsOpenSelectTag} /> */}
      <PopupDetailContentPlan
        isOpen={isOpenDetail}
        setIsOpenDetail={setIsOpenDetail}
        item={itemViewDetail}
      />
      {/* <PopupSelectTag
        isOpen={isShowPopupEditTag}
        isEditInList={true}
        setOpen={setIsShowPopupEditTag}
        itemEdit={itemViewDetail}
      /> */}
    </Fragment>
  );
};

export default PopupListContentPlan;
