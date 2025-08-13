import React, { useCallback, useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Label } from 'reactstrap';
import { Checkbox, DatePicker, Input } from 'rsuite';
import { setCurrentDateTime } from '../../../store/actions/Schedules';
import { CalendarLocaleVn } from '../../../helpers/date';
// import PreviewContent from '../PreviewContent';
import PreviewContent from '../PreviewContent/PreviewContent';

const CustomizeContent = (props) => {
  const {
    setReplaceContent,
    replaceContent,
    isReels,
    setIsReels,
    isAddSource,
    setIsAddSource,
    isRandomPresets,
    setIsRandomPresets,
    hasThreads,
  } = props;
  const [isShowBody, setIsShowBody] = useState(false);
  const [previewContent, setPreviewContent] = useState({});

  const listSourceTypeIgnoreSource = ['user', 'event_content', 'chatgpt', 'video_editor', 'video_ai'];

  const { selectedScheduleContent, selectedDateTime, currentEditingContent } =
    // @ts-ignore
    useSelector((state) => state.schedules);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentEditingContent) {
      const { source_content = null } = currentEditingContent;
      setPreviewContent({
        ...source_content,
        post_id: currentEditingContent?.content_id,
        feed_name: currentEditingContent?.feed_name,
        thumbnail: currentEditingContent?.thumbnail,
        schedule_content_id: currentEditingContent?.id,
        source_type: currentEditingContent?.source_type,
      });
    } else {
      setPreviewContent(selectedScheduleContent);
    }
  }, [currentEditingContent, selectedScheduleContent]);

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
    dispatch(setCurrentDateTime(date));
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
        className={`body transition-all duration-300 ease-in-out ${isShowBody ? 'h-auto' : 'h-0'
          }`}
      >
        <div className="flex gap-2">
          <div className="border rounded-md w-4/6 p-3">
            <div className="date flex gap-3 items-center">
              <Label htmlFor="startDate" className="whitespace-nowrap">
                Thời gian đăng bài:
              </Label>
              <DatePicker
                format="DD-MM-YYYY HH:mm"
                defaultValue={new Date()}
                locale={CalendarLocaleVn}
                isoWeek={true}
                className="w-1/2"
                value={selectedDateTime}
                onChange={(date) => onDateChanged(date)}
              />
            </div>
            <div className="my-2">
              <div className="flex justify-between mb-2">
                <label htmlFor="replaceContent" className=" font-bold">
                  Chỉnh sửa nội dung
                </label>
                {hasThreads ? (
                  <span className="font-bold">
                    (Ký tự:{' '}
                    {replaceContent?.length ||
                      // @ts-ignore
                      previewContent?.post_text?.length}
                    )
                  </span>
                ) : null}
              </div>
              <Input
                componentClass="textarea"
                rows={15}
                placeholder="Nội dung đầu bài viết...."
                id="replaceContent"
                value={
                  // @ts-ignore
                  replaceContent ? replaceContent : previewContent?.post_text
                }
                onChange={(value) => onChangeReplaceContent(value)}
              />
            </div>

            {!listSourceTypeIgnoreSource.includes(
              selectedScheduleContent?.source_type
            ) ? (
              <div>
                <Checkbox
                  name="isAddSource"
                  value={1}
                  checked={isAddSource}
                  onChange={() => onChangeIsAddSource()}
                >
                  Chọn để tự động thêm Nguồn bài viết ở cuối
                </Checkbox>
              </div>
            ) : null}

            {(
              selectedScheduleContent?.source_type === 'tiktok'
              || selectedScheduleContent?.source_type === 'douyin'
              || (selectedScheduleContent?.source_type === 'threads'
                && selectedScheduleContent?.media_type === 'video'
                && !selectedScheduleContent?.isNotReel
              )
              || (['instagram', 'user', 'video_editor'].includes(selectedScheduleContent?.source_type)
                && selectedScheduleContent?.is_reels
              )
              || selectedScheduleContent?.source_type === 'video_ai'
            ) ?
              <div>
                <Checkbox
                  name="isReels"
                  value={1}
                  checked={isReels}
                  onChange={() => onChangeIsReels()}
                  disabled={(selectedScheduleContent?.source_type === 'video_ai' && !selectedScheduleContent?.is_reels)}
                >
                  Đăng dạng reels
                </Checkbox>
                {(selectedScheduleContent?.source_type === 'video_ai' && !selectedScheduleContent?.is_reels) && (
                  <span className="text-xs text-gray-400 ml-2 italic">(Video này chỉ đăng được ở chế độ thường, video Reels phải đạt điều kiện kích thước 9:16 và tối đa 90s)</span>
                )}
              </div>
              : null}

            {selectedScheduleContent?.source_type === 'user' && false ? (
              <Checkbox
                name="isRandomPresets"
                value={1}
                checked={isRandomPresets}
                onChange={() => setIsRandomPresets(!isRandomPresets)}
              >
                Chọn để tự động thêm màu nền (Chỉ áp dụng cho bài viết không có
                ảnh / video)
              </Checkbox>
            ) : null}
          </div>

          <PreviewContent
            content={previewContent}
            replaceContent={replaceContent}
            isAddSource={isAddSource}
          />
        </div>
      </div>
    </div>
  );
};
export default CustomizeContent;
