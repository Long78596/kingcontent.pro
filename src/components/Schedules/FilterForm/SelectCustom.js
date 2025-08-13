import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { HiSelector } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SelectCustom = (props) => {
  const {
    listSelect,
    initSelect,
    handleSelected,
    isDisabled = false,
    setValue,
    register,
    name,
    watch,
    className = '',
  } = props;

  const handleChange = useCallback(
    (value) => {
      setValue(name, value);
    },
    [name]
  );
  const handleEmpty = useCallback(() => {
    setValue(name, initSelect.value);
  }, [name, initSelect]);

  return (
    <div className="relative">
      <select
        className={`bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
        {...register(name)}
      >
        <option value={initSelect.value}>{initSelect.name}</option>
        {listSelect.map((item, index) => (
          <option key={index} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      {watch(name) !== '' ? (
        <button
          className="w-10 h-10 right-10 text-red-600 flex justify-center items-center rounded-lg hover:bg-gray-200 absolute"
          type="button"
          onClick={handleEmpty}
          style={{ top: '1px' }}
        >
          <FaTimes size={20} />
        </button>
      ) : null}
    </div>
  );
};

export default SelectCustom;
