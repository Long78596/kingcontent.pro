import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { BsEye } from 'react-icons/bs';
import { TiDelete } from 'react-icons/ti';
import HashtagsSearch from '../../ContentLiked/HashtagsSearch';
import { formatDate } from '../../../helpers/date';
import client from '../../../Client';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import { isObjEmpty } from '../../../utils/utilityFunc';
import CreatableSelect from 'react-select/creatable';
import PopupSelectTag from './popupSelectTag';
import PopoverTag from '../popoverTag';
import { Dialog } from 'primereact/dialog';
import Fanpage from './Fanpage';
import { userServices } from '../../../services/users';
import { OK } from '../../../configs';

const FanpageRows = (props) => {
  const {
    fanpages = [],
    setIsShowPopup,
    getFanpages,
    setFanpages,
    labels,
    handleChageHashTag,
  } = props;

  const ref = useRef(null);
  const [isShowHashtag, setIsShowHashtag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [itemEdit, setItemEdit] = useState(null);
  const oppp = useRef(null);
  const [visible, setVisible] = useState(false);
  const handleClickOutside = (event) => {
    setIsShowHashtag(false);
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);
  const reRenderList = () => {
    getFanpages && getFanpages().then(setFanpages).catch(console.error);
  };
  const updateContent = async (fanpage) => {
    const { is_queue = false, fanpage_id } = fanpage;
    if (!is_queue) {
      toast.info('Đang thêm trang vào hàng đợi....');
      const postData = {
        feed_id: fanpage_id,
      };
      const res = await userServices.putFanpageToQueue(postData);
      if (res.status === OK) {
        toast.dismiss();
        toast.success(
          'Vui lòng đợi trong ít phút để hệ thống tiến hành cập nhật'
        );
        setFanpages(res?.data?.data || []);
      }
    }
  };

  const deleteContent = async (fanpage) => {
    confirmAlert({
      title: 'Cảnh báo !',
      message: (
        <span className="warning-content">
          Bạn có chắc chắn muốn xoá trang này không?
        </span>
      ),
      buttons: [
        {
          label: 'Xác nhận',
          onClick: async () => {
            const res = await client.delete(`/fanpages/${fanpage.fanpage_id}`);
            if (res.status === OK) {
              toast.success('Xoá trang thành công !');
              getFanpages &&
                getFanpages().then(setFanpages).catch(console.error);
            }
          },
        },
        {
          label: 'Huỷ',
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      {fanpages &&
        fanpages.length > 0 &&
        fanpages.map((fanpage, key) => {
          return (
            <Fragment key={key}>
              <Fanpage
                fanpage={fanpage}
                index={key}
                setIsShowPopup={setIsShowPopup}
                setItemEdit={setItemEdit}
                setVisible={setVisible}
                visible={visible}
                updateContent={updateContent}
                deleteContent={deleteContent}
              />
            </Fragment>
          );
        })}
      <PopupSelectTag
        isOpen={isOpen}
        options={labels}
        handleChageHashTag={handleChageHashTag}
        setOpen={setIsOpen}
        item={itemEdit}
        reRenderList={reRenderList}
      />
      <Dialog
        header="Chỉnh sửa nhãn"
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => setVisible(false)}
      >
        <PopoverTag
          editOp={ref}
          isEdit={true}
          item={itemEdit}
          reRenderList={reRenderList}
          setVisible={setVisible}
        />
      </Dialog>
    </>
  );
};

export default FanpageRows;
