import { Link } from '@mui/material';
import { numberWithCommas } from '../../../../../utils/utilityFunc';
import { FaMinusCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { deleteChosenCategories } from '../../../../../store/actions/homepage';
import { confirmAlert } from 'react-confirm-alert';

const SingleCate = (props) => {
  const { category = {}, idx } = props;
  const {
    cate_id = 0,
    cate_name = '',
    image_url = '',
    cate_url = '',
    posts_count = 0,
  } = category;
  const dispatch = useDispatch();

  const onClickCate = () => {
    window.open(`/danh-muc/${cate_url}/${cate_id}`, '_blank');
  };

  const removeCate = (cate_id) => {
    confirmAlert({
      title: 'Xác nhận',
      message: 'Bạn có chắc chắn muốn xóa chủ đề này không ?',
      buttons: [
        {
          label: 'Có',
          onClick: () => dispatch(deleteChosenCategories(cate_id)),
        },
        {
          label: 'Không',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <div
      target="_blank"
      className="singleCate flex items-center hover:bg-gray-200 rounded-md cursor-pointer p-3 border-b border-gray-300 border-dotted"
      key={idx}
    >
      <div className="thumbnail" onClick={onClickCate}>
        <img src={image_url} alt={cate_name} className="w-12 h-12 rounded-lg" />
      </div>
      <div className="detail p-2" onClick={onClickCate}>
        <h5 className="font-bold mb-2">{cate_name}</h5>
        <div className="text-left text-gray-500 origin-center group-hover:text-gray-600 transition-all">
          <span>{numberWithCommas(posts_count)} mẫu quảng cáo</span>
        </div>
      </div>
      {/* icon to remove cate */}
      <div className="removeCate ml-auto mr-2">
        <button
          onClick={() => removeCate(cate_id)}
          className="text-red-500 text-base"
        >
          <FaMinusCircle />
        </button>
      </div>
    </div>
  );
};

export default SingleCate;
