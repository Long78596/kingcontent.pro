import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button, Input } from 'reactstrap';

const NewUserTag = (props) => {
  const { tag, setTag, onSave } = props;

  const [name, setName] = useState('');

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    }
  }, [tag]);

  const onClose = () => {
    setTag(null);
  };

  const handleOnSave = () => {
    if (!name) {
      toast.info('Vui lòng nhập tên cột');
      return;
    }
    const currentTag = {
      ...tag,
      name: name,
    };
    onSave(currentTag);
    onClose();
  };

  const onInputChange = (e) => {
    // call handleOnSave when user press Enter
    if (e.key === 'Enter') {
      handleOnSave();
      return;
    }
    setName(e.target.value);
  };

  return (
    <div className="mb-2">
      {/* form changing content */}
      <div>
        <Input
          className="w-full px-2 py-3 border border-gray-300 rounded-md"
          rows={10}
          value={name}
          onChange={onInputChange}
          placeholder="Nhập tên cột"
        />
      </div>
      {/* button */}
      <div className="flex justify-end mt-4 px-3 gap-3">
        <Button
          color="blue"
          className="mr-2border-2 border-gray-200 bg-blue-800 hover:bg-blue-400 py-3 px-4 text-white rounded-md"
          onClick={handleOnSave}
        >
          {tag?.name ? 'Cập nhật' : 'Thêm'}
        </Button>
        <Button
          color="red"
          onClick={onClose}
          className="border-2 border-gray-200 bg-gray-100 hover:bg-blue-50 py-3 px-4 text-gray-500 rounded-md"
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default NewUserTag;
