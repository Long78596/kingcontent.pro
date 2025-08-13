import React, { useState } from 'react';
import { ImCalendar } from 'react-icons/im';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateRangePicker from '@mui/lab/DateRangePicker';
import { MdClose } from 'react-icons/md';
import moment from 'moment';

function DatePickerToSearch(props) {
  const { fromDateSearch, toDateSearch } = props;
  const [value, setValue] = useState([null, null]);

  const handleChange = (newValue) => {
    if (newValue[0]) {
      const fromDate = moment(newValue[0]).format('YYYY/MM/DD');
      fromDateSearch(fromDate);
    } else {
      fromDateSearch('');
    }
    if (newValue[1]) {
      const toDate = moment(newValue[1]).format('YYYY/MM/DD');
      toDateSearch(toDate);
    } else {
      toDateSearch('');
    }
    setValue(newValue);
  };

  const handleEmpty = () => {
    setValue([null, null]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        calendars={1}
        value={value}
        inputFormat="dd/MM/yyyy"
        onChange={handleChange}
        renderInput={(startProps, endProps) => (
          <div className="py-1 px-2 mx-2 my-0.5 flex items-center justify-between border border-gray-300 rounded-md w-full flex-grow">
            <ImCalendar className="h-5 w-5 text-blue-500" />
            <label className="ml-2 mr-1 ">From:</label>
            <input
              ref={startProps.inputRef}
              {...startProps.inputProps}
              className="border outline-none border-gray-300 rounded-md p-1 mx-1 w-28 "
            />
            <label className="ml-2 mr-1 ">to:</label>
            <input
              ref={endProps.inputRef}
              {...endProps.inputProps}
              className="border outline-none border-gray-300 rounded-md p-1 mx-1 w-28 "
            />
            <MdClose
              className="ml-1 h-6 w-6 text-red-400 cursor-pointer flex-grow"
              aria-hidden="true"
              onClick={handleEmpty}
            />
          </div>
        )}
      />
    </LocalizationProvider>
  );
}

export default DatePickerToSearch;
