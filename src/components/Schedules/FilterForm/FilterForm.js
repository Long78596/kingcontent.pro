import React, { Component, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { IoIosOptions } from 'react-icons/io';
import TopSearch from './TopSearch';
import ExtraFilters from './ExtraFilters';

const FilterForm = (props) => {
  const { onSearch, isSpecial = false, isSchedule = false } = props;
  const [showExtraFilters, setShowExtraFilters] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = (data) => onSearch(data);

  const onShowExtraFilters = () => {
    setShowExtraFilters((value) => !value);
  };

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <TopSearch
        register={register}
        watch={watch}
        onShowExtraFilters={onShowExtraFilters}
        setValue={setValue}
      />
      <ExtraFilters
        register={register}
        watch={watch}
        setValue={setValue}
        showExtraFilters={showExtraFilters}
        isSpecial={isSpecial}
        isSchedule={isSchedule}
      />
    </form>
  );
};

export default FilterForm;
