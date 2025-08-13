import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actionGetThreadComments, actionPostThreadsComment } from "../../../../store/actions/threads";
import { DATE_TIME_FORMAT, formatDate } from "../../../../helpers/date";
import LoadingApp from "../../../LoadingApp";
import { FiX } from "react-icons/fi";
import SingleComment from "./SingleComment";
import NewCommentForm from "./NewCommentForm";

const { Transition, Dialog } = require("@headlessui/react");

const ListComments = (props) => {
  const {setIsShowComments, setCurrentPost, currentPost} = props;

  const { replies, isLoadingReplies } = useSelector((state) => state.threads);
  const dispatch = useDispatch();

  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (currentPost) {
      dispatch(actionGetThreadComments(currentPost.id));
    }
  }, [currentPost]);

  useEffect(() => {
    if (replies) {
      setComments(replies?.data || []);
    }else{
      setComments([]);
    }
  }, [replies]);

  const onClose = () => {
    setIsShowComments(false);
    setCurrentPost(null);
  }

  const onLoadMore = () => {
    if (replies?.has_next) {
      dispatch(actionGetThreadComments(currentPost.id, replies?.next_cursor));
    }
  }

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative max-w-md mt-1  z-9999 "
        onClose={onClose}
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

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel
                className="w-full transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all relative"
                style={{ maxWidth: '35%' }}
              >
                <div className="mt-2">
                  <div>Xem bình luận của bài viết</div>
                  {isLoadingReplies ? <LoadingApp /> : (
                    <>
                      {comments?.length === 0 ? (
                        <div className="flex items-center justify-center h-28">Không có bình luận nào</div>
                      ) : (
                        <Fragment>
                          <div className="listComments py-2">
                            {comments?.map((comment) => (
                              <Fragment key={comment.id}>
                                <SingleComment comment={comment} />
                              </Fragment>
                            ))}
                          </div>
                          {replies?.has_next && (
                            <div className="flex justify-center">
                              <button
                                onClick={onLoadMore}
                                className="bg-primary text-white px-4 py-2 rounded-md w-1/2"
                              >
                                Xem thêm
                              </button>
                            </div>
                          )}
                        </Fragment>
                      )}
                    </>
                  )}
                  <NewCommentForm threadId={currentPost.id} />
                  <div className="absolute top-2 right-3">
                    <button
                      onClick={onClose}
                      className="border border-gray-200 px-3 py-2 rounded-md"
                    >
                      <FiX className="text-red-500" />
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ListComments;