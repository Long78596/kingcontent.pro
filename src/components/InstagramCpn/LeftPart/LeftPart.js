import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  actionGetCollectionPosts,
  actionGetCollections,
  actionGetUserSaved,
  actionSetCollectionModalOpen,
  actionSetCollectionType,
  actionSetCurrentCollection,
  actionUpdateCollection,
} from '../../../store/actions/instagram';
import SingleUser from '../SingleUser';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SingleCollection from '../SingleCollection';

const LeftPart = (props) => {
  const { isSchedule = false } = props;

  const [isShowUsers, setIsShowUsers] = useState(true);
  const [isShowCollections, setIsShowCollections] = useState(false);
  const { savedUsers = null, collections = null } = useSelector((state) => {
    return state.instagram;
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!savedUsers) {
      dispatch(actionGetUserSaved());
    }
  }, [savedUsers]);

  useEffect(() => {
    if (!collections) {
      dispatch(actionGetCollections());
      dispatch(actionGetCollectionPosts());
    }
  }, [collections]);

  const handleShowUsers = () => {
    setIsShowUsers(true);
    setIsShowCollections(false);
  };

  const handleShowCollections = () => {
    setIsShowUsers(false);
    setIsShowCollections(true);
  };

  const onClickAddCollection = () => {
    dispatch(actionSetCurrentCollection(null));
    dispatch(actionSetCollectionModalOpen(true));
    dispatch(actionSetCollectionType('add'));
  };

  return (
    <div className="left-part border border-gray-300 rounded-md bg-white p-2">
      <div className="tab flex gap-2">
        <div
          className={`flex-1 cursor-pointer text-center border border-gray-300 rounded-tl-md rounded-tr-md p-3 ${
            isShowUsers ? 'bg-primary text-white' : ''
          }`}
          onClick={handleShowUsers}
        >
          Đang theo dõi
        </div>
        <div
          className={`flex-1 p-3 cursor-pointer text-center border border-gray-300 rounded-tl-md rounded-tr-md ${
            isShowCollections ? 'bg-primary text-white' : ''
          }`}
          onClick={handleShowCollections}
        >
          Bộ sưu tập
        </div>
      </div>
      <div className="list mt-3 border border-gray-200 rounded-md py-3">
        {isShowUsers ? (
          savedUsers?.length > 0 ? (
            <PerfectScrollbar className="list_users max-h-screen">
              {savedUsers?.map((user, userIdx) => (
                <Fragment key={user.id}>
                  <SingleUser user={user} isSchedule={isSchedule} />
                </Fragment>
              ))}
            </PerfectScrollbar>
          ) : (
            <h3 className="font-bold px-2">Bạn chưa theo dõi người dùng nào</h3>
          )
        ) : (
          <></>
        )}

        {isShowCollections ? (
          <div className="collectionsContainer">
            {!isSchedule ? (
              <div className="flex justify-end mb-3 mr-2">
                <button
                  className="bg-primary text-white px-3 py-2 rounded-md"
                  onClick={() => onClickAddCollection()}
                >
                  Thêm mới
                </button>
              </div>
            ) : null}
            {collections?.length > 0 ? (
              <PerfectScrollbar className="list_instagram_collection max-h-screen">
                {collections?.map((collection) => (
                  <Fragment key={collection.id}>
                    <SingleCollection collection={collection} />
                  </Fragment>
                ))}
              </PerfectScrollbar>
            ) : (
              <h3 className="font-bold px-2">Bạn chưa tạo BST Instagram nào</h3>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LeftPart;
