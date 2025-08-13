import { useDispatch, useSelector } from "react-redux";
import { actionPostThreadsComment } from "../../../../store/actions/threads";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const NewCommentForm = ({ threadId }) => {
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const { isPostingReply } = useSelector((state) => state.threads);
  
  const onSubmitComment = () => {
    dispatch(actionPostThreadsComment(threadId, newComment));
    setNewComment("");
  }
  
  return (
    <div className="flex flex-row border-b border-gray-200 cursor-pointer p-2 gap-3">
      <div className="flex flex-col w-full">
        <div className="flex justify-between mb-2">
          Thêm bình luận
        </div>

        <div>
          <textarea
            className="w-full h-24 p-2 border border-gray-200 rounded-md"
            placeholder="Nhập bình luận của bạn ..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end mt-2 gap-2">
          {isPostingReply && <div className=" flex gap-2 items-center"><span>Đang đăng...</span> <FaSpinner className="animate-spin"/></div>}
          <button
            className={`bg-primary text-white px-4 py-2 rounded-md ${
              isPostingReply ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => onSubmitComment()}
            disabled={isPostingReply}
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewCommentForm;