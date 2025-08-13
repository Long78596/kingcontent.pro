import React, { useCallback, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Label } from 'reactstrap';
import { Checkbox, DatePicker, Input } from 'rsuite';
// import 'rsuite/dist/styles/rsuite-default.min.css';
import { CalendarLocaleVn } from '../../../../helpers/date';
import { useSelector } from 'react-redux';

const CustomizeContent = (props) => {
  const {
    setReplaceContent,
    replaceContent,
    isReels,
    setIsReels,
    isAddSource,
    setIsAddSource,
    selectedDateTime,
    setSelectedDateTime,
    isRandomPresets,
    setIsRandomPresets,
  } = props;
  const { isReels: canBeReel = false } = useSelector(
    (state) => state.createPost
  );
  const [isShowBody, setIsShowBody] = useState(false);

  const onClickShowBody = useCallback(() => {
    setIsShowBody((state) => !state);
  }, []);

  const onChangeReplaceContent = useCallback((newContent) => {
    setReplaceContent(newContent);
  }, []);

  const onChangeIsReels = useCallback(() => {
    setIsReels(!isReels);
  }, [isReels]);

  const onChangeIsAddSource = useCallback(() => {
    setIsAddSource(!isAddSource);
  }, [isAddSource]);

  const onDateChanged = useCallback((date) => {
    setSelectedDateTime(date);
  }, []);

  return (
    <div className="customizeContentContainer overflow-hidden">
      <div
        className="title p-3 font-bold text-base uppercase mb-2 cursor-pointer border rounded-md flex items-center"
        onClick={() => onClickShowBody()}
      >
        <h4>Chỉnh sửa bài viết trước khi đăng</h4>
        {isShowBody ? (
          <FaAngleUp className="ml-auto" />
        ) : (
          <FaAngleDown className="ml-auto" />
        )}
      </div>
      <div
        className={`body transition-all duration-300 ease-in-out ${
          isShowBody ? 'h-auto' : 'h-0'
        }`}
      >
        <div className="flex gap-2">
          <div className="border rounded-md w-full p-3">
            <div className="date flex gap-3 items-center">
              <Label htmlFor="startDate" className="whitespace-nowrap">
                Thời gian đăng bài:
              </Label>
              <DatePicker
                format="DD-MM-YYYY HH:mm"
                defaultValue={new Date()}
                locale={CalendarLocaleVn}
                isoWeek={true}
                className="w-1/4"
                value={selectedDateTime}
                onChange={(date) => onDateChanged(date)}
              />
            </div>
            <div className="flex gap-4 items-center">
              {/* <Checkbox
                name="isRandomPresets"
                value={1}
                checked={isRandomPresets}
                onChange={() => setIsRandomPresets(!isRandomPresets)}
              >
                Chọn để tự động thêm màu nền (Chỉ áp dụng cho bài viết không có
                ảnh / video)
              </Checkbox> */}
              {canBeReel && (
                <Checkbox
                  name="isReels"
                  value={1}
                  checked={isReels}
                  onChange={() => onChangeIsReels()}
                >
                  Đăng dạng reels
                </Checkbox>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomizeContent;
