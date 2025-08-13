import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Label } from 'reactstrap';
import { Button, Checkbox, DatePicker, Input, Radio, RadioGroup } from 'rsuite';
// import 'rsuite/dist/styles/rsuite-default.min.css';
import './styles.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import AutoComments from './AutoComments';
import { CalendarLocaleVn } from '../../../helpers/date';

const listTypeHasReels = ['tiktok', 'instagram', 'threads', 'douyin', 'user', 'video_editor', 'video_ai'];

const postPerDayOptions = [];
for (let index = 1; index <= 50; index++) {
  postPerDayOptions.push({
    label: index,
    value: index,
  });
}

const buildListHours = (max) => {
  const listHours = [];
  // each 0.5 hour (30 minutes)
  for (let index = 0.5; index <= max; index += 0.5) {
    const hours = Math.floor(index);
    const minutes = (index % 1) * 60;
    const label =
      minutes === 0
        ? `${hours} giờ`
        : `${hours > 0 ? hours + ' giờ ' : ''}${minutes} phút`;
    listHours.push({
      label: label,
      value: index * 60, // value in minutes
    });
  }
  // add 15 minutes at first
  listHours.unshift({
    label: '15 phút',
    value: 15,
  });
  return listHours;
};

const Settings = (props) => {
  const { localSettings, onChangedLocalSettings } = props;

  const [isShowBody, setIsShowBody] = useState(false);
  const [startDate, setStartDate] = useState();
  const [startTime, setStartTime] = useState();
  const [postPerDay, setPostPerDay] = useState(null);
  const [timeSpace, setTimeSpace] = useState(120);
  const [sourceType, setSourceType] = useState('');
  console.log('🚀 ~ Settings ~ sourceType:', sourceType)
  const [isReels, setIsReels] = useState(0);
  const [listSearchReplace, setListSearchReplace] = useState([]);
  const [search, setSearch] = useState('');
  const [replace, setReplace] = useState('');
  const [summaryMessage, setSummaryMessage] = useState('');
  const [canBeReels, setCanBeReels] = useState(false);

  // @ts-ignore
  const { autoWaitingList = null } = useSelector((state) => state.schedules);

  useEffect(() => {
    if(sourceType){
      let canBeReels = false;
      if(listTypeHasReels.includes(sourceType)){
        canBeReels = true;
      }
      // check all autoWaitingList?.contents has is_reels = 1
      if(sourceType === 'user' && autoWaitingList?.contents){
        const isReels = autoWaitingList?.contents?.every(content => content?.is_reels === 1 || content?.is_reels === true);
        if(isReels){
          canBeReels = true;
        }else{
          canBeReels = false;
        }
      }
      setCanBeReels(canBeReels);
    }else{
      setCanBeReels(false);
    }
  }, [sourceType, autoWaitingList.contents]);

  const onClickShowBody = () => {
    setIsShowBody((state) => !state);
  };

  const onChangeBeforeAfter = (type, value) => {
    switch (type) {
      case 'before':
        onChangedLocalSettings('before_content', value);
        break;

      case 'after':
        onChangedLocalSettings('after_content', value);
        break;
    }
  };

  const onDateChanged = (type, date) => {
    // change to update localSettings
    onChangedLocalSettings(type, moment(date).format('YYYY-MM-DD'));
  };

  const onTimeChanged = (date) => {
    onChangedLocalSettings('start_time', moment(date).format('HH:mm'));
  };

  const onChangePostPerDay = (value) => {
    onChangedLocalSettings('post_per_day', value);
  };

  const onChangeTimeSpace = (value) => {
    onChangedLocalSettings('time_space', value);
  };

  const onChangeVideoType = (value) => {
    onChangedLocalSettings('is_reels', value);
  };

  const onChangeRandom = (type, checked) => {
    switch (type) {
      case 'emoji':
        onChangedLocalSettings('is_random_emojies', checked);
        break;

      case 'character':
        onChangedLocalSettings('is_random_characters', checked);
        break;

      case 'text':
        onChangedLocalSettings('is_remove_contents', checked);
        break;

      case 'hashtag':
        onChangedLocalSettings('remove_all_hashtags', checked);
        break;

      case 'isAddSource':
        onChangedLocalSettings('is_add_source', checked);
        break;

      case 'isRandomCharactersComment':
        onChangedLocalSettings('is_random_characters_comment', checked);
        break;

      case 'isRandomEmojisComment':
        onChangedLocalSettings('is_random_emojies_comment', checked);
        break;

      case 'isAutoComment':
        onChangedLocalSettings('is_auto_comment', checked);
        break;
    }
  };

  const onChangeSearchReplace = (type, value) => {
    if (type === 'search') setSearch(value);
    else setReplace(value);
  };

  const onAddSearchReplace = () => {
    if (!search || !replace) {
      toast.error('Vui lòng nhập từ khoá tìm kiếm và thay thế');
    } else {
      // push to list
      listSearchReplace.push({
        search: search,
        replace: replace,
      });
      onChangedLocalSettings('search_replace', listSearchReplace);
      //reset
      setSearch('');
      setReplace('');
    }
  };

  const onRemoveSearchReplace = (index) => {
    // push to list
    const newList = listSearchReplace.reduce((acc, item, key) => {
      if (key !== index) acc.push(item);
      return acc;
    }, []);
    onChangedLocalSettings('search_replace', newList);
  };

  useEffect(() => {
    if (localSettings) {
      const {
        start_date = new Date(),
        start_time = new Date(),
        post_per_day = null,
        time_space = 120,
        source_type = '',
        is_reels = 0,
        search_replace = [],
      } = localSettings;

      const startDate = new Date(start_date);
      // @ts-ignore
      setStartDate(startDate);
      setStartTime(start_time);
      setPostPerDay(post_per_day);
      setTimeSpace(time_space);
      setSourceType(source_type);
      setIsReels(is_reels);
      setListSearchReplace(search_replace);
    } else {
      // @ts-ignore
      setStartDate(new Date());
      // @ts-ignore
      setStartTime(new Date());
      setPostPerDay(null);
      setTimeSpace(120);
      setSourceType('');
      setIsReels(0);
      setListSearchReplace([]);
    }
  }, [localSettings]);

  useEffect(() => {
    if (
      autoWaitingList?.contents?.length > 0 &&
      postPerDay &&
      startDate &&
      startTime
    ) {
      const totalContents = autoWaitingList?.contents?.length || 0;
      const totalDays = Math.ceil(totalContents / postPerDay);
      const endDate = moment(startDate).add(totalDays, 'days');
      const summaryMessage = `Hệ thống sẽ đăng liên tục ${totalContents} bài viết trong ${totalDays} ngày, bắt đầu từ ngày ${moment(
        startDate
      ).format('DD-MM-YYYY')} đến ngày ${endDate.format('DD-MM-YYYY')}`;
      setSummaryMessage(summaryMessage);
    } else {
      setSummaryMessage('');
    }
  }, [autoWaitingList, postPerDay, startDate, startTime]);

  return (
    <div className="settingsContainer overflow-hidden text-black  text-sm">
      <div
        className="title p-3 font-bold text-base uppercase mb-2 cursor-pointer border rounded-md flex items-center"
        onClick={() => onClickShowBody()}
      >
        <h5>Lên thời khoá biểu</h5>
        {isShowBody ? (
          <FaAngleUp className="ml-auto" />
        ) : (
          <FaAngleDown className="ml-auto" />
        )}
      </div>
      <div
        className={`body transition-all duration-300 ease-in-out space-y-5 ${
          isShowBody ? 'h-auto p-3 border' : 'h-0'
        }`}
      >
        <div className="summary my-2">
          <span>Số bài viết đã chọn: </span>
          <span className="font-bold">
            {autoWaitingList?.contents?.length || 0}
          </span>
        </div>
        {/* ROW day range */}
        <div className="settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">Chọn ngày:</h5>
          <div className="w-2/3 my-2 grid grid-cols-2">
            <div className="startDate flex items-center gap-2">
              <Label htmlFor="startDate" className="whitespace-nowrap">
                Ngày bắt đầu:
              </Label>
              <DatePicker
                format="DD-MM-YYYY"
                defaultValue={new Date()}
                locale={CalendarLocaleVn}
                isoWeek={true}
                className="w-1/2"
                value={startDate}
                onChange={(date) => onDateChanged('start_date', date)}
              />
            </div>
            <div className="flex gap-2 items-center flex-nowrap">
              <Label className="whitespace-nowrap">
                Thời gian bắt đầu đăng mỗi ngày:
              </Label>
              <DatePicker
                format="HH:mm"
                ranges={[]}
                style={{ width: 160 }}
                className="w-2/3"
                defaultValue={startTime}
                onChange={(date) => onTimeChanged(date)}
              />
            </div>
          </div>
        </div>

        {/* ROW post per day */}
        <div className="settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">Chọn số lượng bài viết mỗi ngày:</h5>
          <Select
            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4"
            onChange={(selected) => onChangePostPerDay(selected.value)}
            options={postPerDayOptions}
            placeholder="--- Chọn số lượng ---"
            defaultValue={postPerDay}
          />
        </div>

        {/* ROW temp summary */}
        {summaryMessage ? (
          <div className="settingRow my-2 flex gap-2 items-center">
            <h5 className="font-bold w-1/3">Thống kê tạm thời:</h5>
            <p className="text-black font-bold">{summaryMessage}</p>
          </div>
        ) : null}

        {/* ROW time space */}
        <div className="settingRow my-2">
          <div className="flex gap-2 flex-nowrap items-center">
            <h5 className="font-bold w-1/3">Thời gian đăng giãn cách:</h5>
            <Select
              className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/4"
              // @ts-ignore
              onChange={(selected) => onChangeTimeSpace(selected.value)}
              // @ts-ignore
              options={buildListHours(24)}
              placeholder="--- Chọn thời gian ---"
              defaultValue={timeSpace}
            />
            <p className="notice text-red-500 w-1/3 ml-auto">
              Khuyến cáo: Chỉ nên đăng 3-4 bài / ngày, mỗi bài cách nhau 3-4 giờ
              để có hiệu quả tốt nhất
            </p>
          </div>
        </div>

        {/* ROW is add Source from when publish */}
        <div className="rowIsAddSource settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">
            Chọn để tự động thêm Nguồn bài viết ở cuối
          </h5>
          <div className="w-2/3 grid items-center">
            <Checkbox
              name="isAddSource"
              value={1}
              defaultChecked={true}
              // @ts-ignore
              onChange={(value, checked) =>
                onChangeRandom('isAddSource', checked)
              }
            >
              Kích hoạt
            </Checkbox>
          </div>
        </div>

        {canBeReels && (
          <div className="rowIsReels settingRow my-2 flex gap-2 items-center">
            <h5 className="font-bold w-1/3">
              Hình thức đăng: (chỉ dành cho bài viết dạng video)
            </h5>
            <RadioGroup
              name="isReels"
              className="flex flex-nowrap gap-2 justify-between items-center w-1/3"
              onChange={(value) => onChangeVideoType(value)}
              value={isReels}
            >
              <Radio value={0} className="w-full whitespace-nowrap">
                Đăng thường
              </Radio>
              <Radio value={1} className="w-full whitespace-nowrap">
                Đăng Reels
              </Radio>
            </RadioGroup>
          </div>
        )}

        {/* ROW random character and emoji*/}
        <div className="settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">
            Thêm ngẫu nhiên vào cuối bài viết:
          </h5>
          <div className="w-1/3 grid grid-cols-2 items-center">
            <Checkbox
              name="randomCharacters"
              value={1}
              defaultChecked={true}
              // @ts-ignore
              onChange={(value, checked) =>
                onChangeRandom('character', checked)
              }
            >
              3-5 Ký tự
            </Checkbox>
            <Checkbox
              name="randomEmojies"
              defaultChecked={true}
              value={1}
              // @ts-ignore
              onChange={(value, checked) => onChangeRandom('emoji', checked)}
            >
              3-5 Biểu tượng
            </Checkbox>
          </div>
        </div>

        {/* ROW before content */}
        <div className="settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">
            Thêm nội dung vào đầu của toàn bộ bài viết:
          </h5>
          <div className="w-2/3 grid grid-cols-2 items-center">
            <Input
              componentClass="textarea"
              rows={3}
              placeholder="Nội dung đầu bài viết...."
              onChange={(value) => onChangeBeforeAfter('before', value)}
            />
          </div>
        </div>

        {/* ROW after content */}
        <div className="settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">
            Thêm nội dung vào cuối của toàn bộ bài viết:
          </h5>
          <div className="w-2/3 grid grid-cols-2 items-center">
            <Input
              componentClass="textarea"
              rows={3}
              placeholder="Nội dung cuối bài viết...."
              onChange={(value) => onChangeBeforeAfter('after', value)}
            />
          </div>
        </div>

        {/* ROW advance settings */}
        <div className="settingRow my-2 flex gap-2 items-center">
          <h5 className="font-bold w-1/3">Xoá nội dung gốc:</h5>
          <div className="w-2/3 grid grid-cols-2 items-center">
            <Checkbox
              name="removeOldContent"
              value={1}
              // @ts-ignore
              onChange={(value, checked) => onChangeRandom('text', checked)}
            >
              Chọn để xoá toàn bộ nội dung ở bài gốc
            </Checkbox>
            <Checkbox
              name="removeHashtag"
              value={1}
              // @ts-ignore
              onChange={(value, checked) => onChangeRandom('hashtag', checked)}
            >
              Chọn để xoá toàn bộ hashtag ở bài gốc
            </Checkbox>
          </div>
        </div>

        {/* ROW search and replace */}
        <div className="settingRow my-2 flex gap-2">
          <div className="w-1/3">
            <h5>
              <span className="font-bold">Tìm kiếm và thay thế:</span> (Thay thế
              từ có sẵn ở bài viết gốc thành từ mới của bạn)
            </h5>
            <p className="italic">
              Ví dụ: Bài viết gốc có SĐT là A, bạn có thể sửa tự động thành B
              trên hàng loạt bài viết gốc
            </p>
          </div>

          <div className="inputs w-1/3">
            <Input
              name="search"
              className="w-full mb-2"
              placeholder="Tìm kiếm ..."
              value={search}
              onChange={(value) => onChangeSearchReplace('search', value)}
            />
            <Input
              name="replace"
              className="w-full mb-2"
              placeholder="Thay thế ..."
              value={replace}
              onChange={(value) => onChangeSearchReplace('replace', value)}
            />
            <Button
              className="bg-blue-700 text-white rounded-lg p-2"
              onClick={onAddSearchReplace}
            >
              Thêm vào danh sách
            </Button>
          </div>
          {listSearchReplace && listSearchReplace.length > 0 && (
            <div className="results w-1/3 max-h-24 overflow-y-auto">
              <h6>Danh sách từ khoá tìm kiếm / thay thế:</h6>
              {listSearchReplace.map((item, idx) => {
                const { search = '', replace = '' } = item;
                return (
                  <div
                    key={idx}
                    className="flex gap-2 flex-nowrap items-center"
                  >
                    <span className="w-1/12">{`-`}</span>
                    <span className="w-5/12 line-through">{search}</span>
                    <span className="w-1/12">{`-->`}</span>
                    <span className="w-5/12 font-bold">{replace}</span>
                    <span className="w-1/12 cursor-pointer text-center">
                      <FiX
                        size={25}
                        color="red"
                        onClick={() => onRemoveSearchReplace(idx)}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* ROW auto comments */}
        <AutoComments
          onChangeRandom={onChangeRandom}
          localSettings={localSettings}
          onChangedLocalSettings={onChangedLocalSettings}
        />
      </div>
    </div>
  );
};

export default Settings;
