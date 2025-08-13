import { DATE_TIME_FORMAT, formatDate } from "../../../../helpers/date";

const SingleComment = ({comment}) => {
  
  return (
    <div className="flex flex-row border-b border-gray-200 cursor-pointer p-2 gap-3">
      <div className="w-28 flex justify-center items-center relative">
        <img
          src="https://via.placeholder.com/50"
          alt=""
          className="w-24 h-24 object-cover rounded-md"
        />
      </div>
      
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <div className="font-bold">{comment?.username}</div>
          <div>{formatDate(comment?.timestamp, DATE_TIME_FORMAT)}</div>
        </div>
        <div>{comment?.text}</div>
      </div>
    </div>
  )
}

export default SingleComment;