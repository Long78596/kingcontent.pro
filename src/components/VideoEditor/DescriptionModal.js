import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { actionUpdateCurrentVideo } from "../../store/actions/videoEditor";
import { Button } from 'rsuite';
import { FiLoader, FiSave } from "react-icons/fi";

const DescriptionModal = ({ video, onClose }) => {
  const [description, setDescription] = useState(video?.description || "");
  // @ts-ignore
  const { isUpdating } = useSelector((state) => state.videoEditor);
  const dispatch = useDispatch();

  const handleSave = () => {
    if(!description) {
      toast.info("Vui lòng nhập mô tả trước khi lưu", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    dispatch(actionUpdateCurrentVideo({
      id: video.id,
      description
    }, true));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa mô tả</h2>
        <textarea
          className="w-full border p-2 rounded-md"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <Button
            color="blue"
            className={`mr-2 flex gap-1 items-center text-nowrap flex-nowrap ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isUpdating}
            onClick={() => handleSave()}
          >
            {isUpdating ? <FiLoader className="animate-spin" size={20} /> : <FiSave size={20} />}
            <span>{isUpdating ? 'Đang lưu...' : 'Lưu'}</span>
          </Button>
          <Button
            color="red"
            onClick={onClose}
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
