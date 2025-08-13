import { BsEye } from 'react-icons/bs';
import { formatDate } from '../../../helpers/date';
import { BiRefresh } from 'react-icons/bi';
import { TiDelete } from 'react-icons/ti';

const Fanpage = (props) => {
  const {
    fanpage,
    index,
    setIsShowPopup,
    setItemEdit,
    setVisible,
    visible,
    updateContent,
    deleteContent,
  } = props;
  const {
    id = 0,
    fanpage_id = '',
    page_name = '',
    user_link = '',
    user_pic = '',
    limit = 0,
    total = 0,
    created = null,
    label,
    special_hash_tag,
    is_queue = false,
  } = fanpage;
  return (
    <div
      className={`w-full flex py-3 px-2 hover:bg-gray-100 ${
        index > 0 ? 'border-t' : ''
      }`}
    >
      <div
        className="w-2/5 cursor-pointer"
        onClick={() => setIsShowPopup(fanpage)}
      >
        <img src={user_pic} className="w-20 h-20 float-left" />
        <div className="pl-3 align-middle h-20 table-cell">
          <span className="font-bold">{page_name}</span>
          <br />
          <span>Ngày thêm: {formatDate(created)}</span>
        </div>
      </div>
      <div className="w-2/5">
        <div className="w-1/3 float-left">
          <div className="align-middle h-20 table-cell text-center">
            Bài viết hiện có:
            <br />
            <strong>{total} bài</strong>
          </div>
        </div>
        <div className="w-1/3 float-left">
          <div className="align-middle h-20 table-cell">
            <span className="font-bold">Nhãn</span>:&nbsp;
            <span
              className="text-yellow-500 cursor-pointer"
              onClick={(e) => {
                setItemEdit({ id: id, spec_id: special_hash_tag?.id });
                setVisible(!visible);
              }}
            >
              {special_hash_tag ? special_hash_tag.name : 'Chưa chọn...'}
            </span>
          </div>
        </div>
        <div className="w-1/3 float-left">
          <div className="align-middle h-20 table-cell text-center">
            Làm mới sau:
            <br />
            10h nữa
          </div>
        </div>
      </div>
      <div className="w-1/5 pt-7">
        <div className="w-1/3 float-left">
          <a href={user_link} target="_blank">
            <BsEye className="w-5 h-5 mr-2 float-left" />
            <div className="">Xem</div>
          </a>
        </div>
        <div className="w-1/3 float-left">
          <div
            className={`cursor-pointer ${
              is_queue ? 'text-gray-500 cursor-not-allowed' : 'text-green-500'
            }`}
            onClick={() => updateContent(fanpage)}
          >
            <div className="float-right">Cập nhật</div>
            <BiRefresh
              className="w-5 h-5 mr-2 float-right"
              fill={is_queue ? 'grey' : 'green'}
            />
          </div>
        </div>
        <div className="w-1/3 float-left">
          <div
            className="cursor-pointer"
            onClick={() => deleteContent(fanpage)}
          >
            <div className="float-right">Xóa</div>
            <TiDelete className="w-5 h-5 mr-2 float-right" fill="red" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fanpage;
