import React from 'react';
import { useForm } from 'react-hook-form';
import TopSearch from './TopSearch';

const SearchForm = (props) => {
  const { onSearch, hashtag=0, contents = [], isCreated = false } = props;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => onSearch(data, true);

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <TopSearch
        register={register}
        watch={watch}
        setValue={setValue}
        onSearch={onSearch}
        contents={contents}
        hashtag={hashtag}
        isCreated={isCreated}
      />
    </form>
  );
};

export default SearchForm;
