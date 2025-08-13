import React, { useEffect, useState } from 'react';
import SelectCustom from './SelectCustom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpecialFanpages } from '../../../store/actions/homepage';
import {
  FreqCommentList,
  FreqLikeList,
  FreqShareList,
  initCommentSelect,
  initHashtagSelect,
  initLikeSelect,
  initListFanpages,
  initScheduleSelect,
  initShareSelect,
  initTimeStampSelect,
  ScheduleList,
  TimeStampList,
} from './constant';
import { SpecialService } from '../../../services/special';
import { OK } from '../../../configs';
import Select from 'react-select';
import KindOfContentSelect from '../../CategoriesContent/SearchAndFilter/KindOfContentSelect';

function ExtraFilters(props) {
  const {
    register,
    setValue,
    watch,
    showExtraFilters,
    isSpecial = false,
    isSchedule = false,
  } = props;

  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const [listFanpages, setListFanpages] = useState([]);
  const [hashtagList, setHashtagList] = useState([]);
  const { specialFanpages = [] } = useSelector((state) => state.homepage);
  const dispatch = useDispatch();

  const getAllHashtag = async () => {
    const res = await SpecialService.getAllTag();
    if (res.status === OK) {
      const hashtags = res?.data?.data?.map((elt) => {
        return {
          name: elt.name,
          value: elt.id,
        };
      });
      setHashtagList(hashtags);
    }
  };

  useEffect(() => {
    if (isSpecial) {
      getAllHashtag();
    }
  }, [isSpecial]);

  useEffect(() => {
    if (specialFanpages.length === 0 && !isFirstLoad) {
      dispatch(getSpecialFanpages(1, true));
      setIsFirstLoad(true);
    }
  }, [specialFanpages, isFirstLoad, dispatch]);

  useEffect(() => {
    if (specialFanpages.length > 0) {
      let newFanpages = specialFanpages.map((elt) => {
        const { name = '' } = elt?.special_hash_tag || {};
        return {
          label: name ? `${elt?.page_name || elt?.fanpage_id} - ${name}` : `${elt?.page_name || elt?.fanpage_id} (Chưa có nhãn)`,
          value: elt.fanpage_id,
        };
      });
      setListFanpages(newFanpages);
    } else {
      setListFanpages([]);
    }
  }, [specialFanpages]);

  const onChangeKindOfContentToSearch = (selectedOption) => {
    setValue('kindOfContent', selectedOption);
  };

  return (
    <div
      className={`relative extraFilters w-full transform transition-all duration-300 shadow-lg mb-5 ${
        showExtraFilters
          ? 'opacity-100 py-2 h-auto z-20'
          : 'overflow-hidden opacity-0 py-0 h-0'
      }`}
    >
      <div className="flex space-x-3">
        <div className={`flex-grow ${isSchedule ? 'w-1/5' : 'w-1/4'}`}>
          <SelectCustom
            initSelect={initLikeSelect}
            listSelect={FreqLikeList}
            isDisabled={false}
            name="likesOrder"
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>
        <div className={`flex-grow ${isSchedule ? 'w-1/5' : 'w-1/4'}`}>
          <SelectCustom
            initSelect={initCommentSelect}
            listSelect={FreqCommentList}
            isDisabled={false}
            name="commentsOrder"
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>
        <div className={`flex-grow ${isSchedule ? 'w-1/5' : 'w-1/4'}`}>
          <SelectCustom
            initSelect={initShareSelect}
            listSelect={FreqShareList}
            isDisabled={false}
            name="sharesOrder"
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>
        <div className={`flex-grow ${isSchedule ? 'w-1/5' : 'w-1/4'}`}>
          <SelectCustom
            initSelect={initTimeStampSelect}
            listSelect={TimeStampList}
            name="timeStampOrder"
            register={register}
            setValue={setValue}
            watch={watch}
          />
        </div>
        {isSchedule && (
          <div className="flex-grow w-1/5">
            <SelectCustom
              initSelect={initScheduleSelect}
              listSelect={ScheduleList}
              name="schedule"
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </div>
        )}
      </div>
      {isSpecial && (
        <div className="flex space-x-3 mt-2">
          <div className="flex-grow w-1/3">
            <Select
              options={listFanpages}
              placeholder="Chọn fanpage"
              name="feed_id"
              register={register}
              onChange={(selectedOption) => {
                setValue('feed_id', selectedOption?.value || '');
              }}
              watch={watch}
              isClearable
            />
          </div>
          {/* hashtag select */}
          <div className="flex-grow w-1/3">
            <SelectCustom
              initSelect={initHashtagSelect}
              listSelect={hashtagList}
              name="hashtag"
              register={register}
              setValue={setValue}
              watch={watch}
            />
          </div>
          <div className="flex-grow w-1/3">
            <KindOfContentSelect
              kindOfContentToSearch={onChangeKindOfContentToSearch}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ExtraFilters;
