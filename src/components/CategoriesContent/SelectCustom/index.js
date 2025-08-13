import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { FaCheck } from 'react-icons/fa';
import { HiSelector } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function SelectCustom(props) {
  const {
    listSelect,
    initSelect,
    handleSelected,
    isDisabled = false,
    handleRefreshFillter,
  } = props;
  const [selected, setSelected] = useState(initSelect);

  const handleChange = (select) => {
    setSelected(select);
    handleSelected(select);
  };
  const handleEmpty = () => {
    setSelected(initSelect);
    handleSelected(initSelect);
    handleRefreshFillter && handleRefreshFillter();
  };

  return (
    <Listbox
      value={selected}
      onChange={(selected) => handleChange(selected)}
      disabled={isDisabled}
    >
      <div className={`relative ${isDisabled ? 'opacity-40' : 'opacity-100'} `}>
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
          <Listbox.Button className="relative w-full px-1 bg-white rounded-md  pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <span className="flex items-center">
              {selected?.icon && (
                <FontAwesomeIcon
                  className="text-base text-blue-400 "
                  icon={selected.icon}
                />
              )}
              <span className="ml-2 block truncate">{selected.name}</span>
            </span>
            <span className="ml-3 absolute inset-y-0 right-0 flex items-center pr-0.5 ">
              <HiSelector
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          {selected !== initSelect && (
            <MdClose
              className="mx-2 h-6 w-6 text-red-400 cursor-pointer flex-grow"
              aria-hidden="true"
              onClick={handleEmpty}
            />
          )}
        </div>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-40 rounded-md py-1  text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            {listSelect.map((item, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  classNames(
                    active ? 'text-white bg-red-200' : 'text-gray-900',
                    'cursor-default select-none relative py-2 pl-3 pr-9'
                  )
                }
                value={item}
                onChange={() => console.log('hello')}
              >
                {({ selected, active }) => (
                  <>
                    <div className="flex items-center">
                      {item.icon && (
                        <FontAwesomeIcon
                          className=" text-sm mr-2 text-blue-400 "
                          icon={item.icon}
                        />
                      )}

                      <span
                        className={classNames(
                          selected ? 'font-semibold' : 'font-normal',
                          'block truncate'
                        )}
                      >
                        {item.name}
                      </span>
                    </div>

                    {selected ? (
                      <span
                        className={classNames(
                          active ? 'text-white' : 'text-indigo-400',
                          'absolute inset-y-0 right-0 flex items-center pr-4'
                        )}
                      >
                        <FaCheck className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default SelectCustom;
