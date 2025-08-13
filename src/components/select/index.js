import { Listbox, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { HiArrowsUpDown } from 'react-icons/hi2';

// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
const Select = ({ data, onChangeFunc, selected, width = 'w-72' }) => {
  return (
    <div className={width}>
      <Listbox value={selected} onChange={onChangeFunc}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg h-12 border-2 border-blue-300 bg-white py-3 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{selected.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HiArrowsUpDown size={25} />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-96 w-full overflow-auto rounded-md bg-white py-1  text-sm  z-9999 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none pl-2 py-2 pr-4 ${
                      person.name === selected.name
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-900'
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate text-left ${
                          selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {person.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
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
    </div>
  );
};

export default Select;
