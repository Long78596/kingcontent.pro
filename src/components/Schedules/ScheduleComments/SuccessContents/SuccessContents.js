import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SingleSuccessContent from './SingleSuccessContent';
import { commentSetCurrentSchedule, setScheduleCommentsWaitingList } from '../../../../store/actions/Schedules';
import LoadingApp from '../../../LoadingApp';
import SearchBox from './SearchBox';
import { FaAngleLeft } from 'react-icons/fa';

const SuccessContents = (props) => {
  const { setIsShowCommented = () => {}, setListComments = () => {} } = props;
  const {
    scheduleCommentsWaitingList,
    commentsScheduleContents = null,
    commentsIsLoadingContents = false,
  // @ts-ignore
  } = useSelector((state) => state.schedules);
  const dispatch = useDispatch();

  const [successContents, setSuccessContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);

  useEffect(() => {
    if (commentsScheduleContents) {
      // const contents = commentsScheduleContents.filter( (item) => item.status === 1 || item.status === 5);
      setSuccessContents(commentsScheduleContents);
    } else {
      setSuccessContents([]);
    }
  }, [commentsScheduleContents]);

  useEffect(() => {
    if(successContents.length > 0){
      setFilteredContents(successContents);
    }else{
      setFilteredContents([]);
    }
  }, [successContents]);

  const onClickSelectAll = () => {
    if (filteredContents.length > 0) {
      let listChosen = [];
      filteredContents.map((item) => listChosen.push(item.id));
      dispatch(
        setScheduleCommentsWaitingList({
          ...scheduleCommentsWaitingList,
          content_ids: listChosen,
        })
      );
    }
  };

  const onClickSelectNone = () => {
    dispatch(
      setScheduleCommentsWaitingList({
        ...scheduleCommentsWaitingList,
        content_ids: [],
      })
    );
  };

  const onChooseContent = (value) => {
    if (value) {
      const { content_ids = [] } = scheduleCommentsWaitingList;
      const isExist = content_ids.find((item) => item === value);
      if (isExist) {
        const newList = content_ids.filter((item) => item !== value);
        dispatch(
          setScheduleCommentsWaitingList({
            ...scheduleCommentsWaitingList,
            content_ids: newList,
          })
        );
      } else {
        dispatch(
          setScheduleCommentsWaitingList({
            ...scheduleCommentsWaitingList,
            content_ids: [...content_ids, value],
          })
        );
      }
    }
  };

  const handleClickGoBack = () => {
    dispatch(setScheduleCommentsWaitingList({ content_ids: [] }));
    dispatch(commentSetCurrentSchedule(null));
  };

  return (
    <>
      {commentsIsLoadingContents && <LoadingApp />}
      {!commentsIsLoadingContents && successContents.length > 0 && (
        <div className="success-contents pr-2">
          <div className="actions my-2 flex gap-3">
            <button
              className="border-2 rounded-md p-2 flex gap-1"
              onClick={(e) => {
                handleClickGoBack();
              }}
              title="Quay lại"
            >
              <FaAngleLeft fontSize={20} />
              <span>Quay lại</span>
            </button>
            <button
              className="bg-blue-400 px-3 py-2 rounded-md text-white hover:bg-blue-600"
              onClick={onClickSelectAll}
            >
              Chọn toàn bộ
            </button>
            <button
              className="bg-gray-500 px-3 py-2 rounded-md text-white hover:bg-gray-700"
              onClick={onClickSelectNone}
            >
              Bỏ chọn
            </button>
          </div>
          <SearchBox contents={successContents} setFilteredContents={setFilteredContents} />
          <PerfectScrollbar className="max-h-manage-schedules p-2 pr-3 border rounded-md">
            {filteredContents.length > 0 &&
              filteredContents.map((item, idx) => {
                return (
                  <div key={item?.id || idx}>
                    <SingleSuccessContent
                      content={item}
                      onChooseContent={onChooseContent}
                      setIsShowCommented={setIsShowCommented}
                      setListComments={setListComments}
                    />
                  </div>
                );
              })}
          </PerfectScrollbar>
        </div>
      )}
    </>
  );
};

export default SuccessContents;
