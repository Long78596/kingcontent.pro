import React from 'react';
import { Label } from 'reactstrap';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import {
  orderOptions,
  orderTypeOptions,
  filterStatusOptions,
  sourceTypeOptions,
} from './constants';

const SearchBox = (props) => {
  const {
    contents,
    filteredContents,
    setFilteredContents,
    listSelected,
    setListSelected,
  } = props;
  const [order, setOrder] = useState(orderOptions[0]);
  const [orderType, setOrderType] = useState(orderTypeOptions[0]);
  const [listDestinations, setListDestinations] = useState([]);
  const [filterStatus, setFilterStatus] = useState(filterStatusOptions[0]);
  const [filterDestination, setFilterDestination] = useState('');
  const [sourceType, setSourceType] = useState('');

  useEffect(() => {
    if (contents) {
      let filtered = contents;
      const orderValue = order.value;
      const filterStatusValue = filterStatus.value;
      const filterDestinationValue = filterDestination.value;
      const orderTypeValue = orderType.value;
      const sourceTypeValue = sourceType.value;

      // filter by source type
      if (sourceTypeValue) {
        filtered = filtered.filter((item) => {
          if (sourceTypeValue === 'other') {
            // return source type not in array
            return !sourceTypeOptions
              .filter((i) => i.value !== 'other')
              .map((i) => i.value)
              .includes(item.source_type);
          } else {
            return item.source_type === sourceTypeValue;
          }
        });
      }

      // sort by date
      if (orderValue === 'date') {
        filtered = filtered.sort((a, b) => {
          if (orderTypeValue === 'asc') {
            return new Date(a.created) - new Date(b.created);
          } else {
            return new Date(b.created) - new Date(a.created);
          }
        });
      }

      // sort by date_publish
      if (orderValue === 'date_publish') {
        filtered = filtered.sort((a, b) => {
          if (orderTypeValue === 'asc') {
            return new Date(a.date_publish) - new Date(b.date_publish);
          } else {
            return new Date(b.date_publish) - new Date(a.date_publish);
          }
        });
      }

      // filter by status
      switch (filterStatusValue) {
        case 1:
          filtered = filtered.filter(
            (item) => item.status === 1 || item.status === 5
          );
          break;

        case 2:
          filtered = filtered.filter((item) => item.status === 2);
          break;

        case 3:
          filtered = filtered.filter((item) => item.status === 3);
          break;

        default:
          break;
      }
      // filter by destination
      if (filterDestinationValue) {
        filtered = filtered.filter(
          (item) => item.destination_id === filterDestinationValue
        );
      }
      if (filtered) {
        setFilteredContents([...filtered]);
        // remove selected item if not exist in filtered list
        if (listSelected) {
          const newList = listSelected.filter((item) => {
            return filtered.findIndex((i) => i.id === item.id) !== -1;
          });
          setListSelected(newList);
        }
      }
    }
  }, [contents, order, orderType, filterStatus, filterDestination, sourceType]);

  useEffect(() => {
    if (contents) {
      // only get unique destination
      let countByDestinationId = [];
      const destinations = contents.reduce((acc, item) => {
        if (acc.findIndex((i) => i.value === item.destination_id) === -1) {
          countByDestinationId[item.destination_id] = 1;
          acc.push({
            label: `${item.destination_name} (${
              countByDestinationId[item.destination_id]
            })`,
            value: item.destination_id,
          });
        } else {
          countByDestinationId[item.destination_id]++;
          const index = acc.findIndex((i) => i.value === item.destination_id);
          acc[index].label = `${item.destination_name} (${
            countByDestinationId[item.destination_id]
          })`;
        }
        return acc;
      }, []);
      // push default value
      destinations.unshift({
        label: 'Tất cả',
        value: '',
      });
      setListDestinations(destinations);
      setFilterDestination(destinations[0]);
    }
  }, [contents]);

  return (
    <div className="SearchBoxContainer flex items-center relative ml-auto gap-2 justify-end flex-nowrap">
      {/* select source type */}
      <div className="flex flex-nowrap items-center gap-2">
        <Label>Nguồn</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={sourceTypeOptions}
          onChange={(e) => setSourceType(e)}
          defaultValue={sourceType}
          placeholder="Tất cả"
        />
      </div>
      <div className="flex flex-nowrap items-center gap-2">
        <Label>Sắp xếp</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={orderOptions}
          onChange={(e) => setOrder(e)}
          defaultValue={order}
        />
      </div>
      <div className="flex flex-nowrap items-center gap-2">
        <Label>Thứ tự</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={orderTypeOptions}
          onChange={(e) => setOrderType(e)}
          defaultValue={orderType}
        />
      </div>
      <div className="flex flex-nowrap items-center gap-2">
        <Label>Trạng thái</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={filterStatusOptions}
          onChange={(e) => setFilterStatus(e)}
          defaultValue={filterStatus}
          placeholder="Tất cả"
        />
      </div>
      <div className="flex flex-nowrap items-center gap-2">
        <Label>Nơi đăng</Label>
        <Select
          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block"
          options={listDestinations}
          onChange={(e) => setFilterDestination(e)}
          defaultValue={listDestinations[0]}
          placeholder="Tất cả"
        />
      </div>
    </div>
  );
};

export default SearchBox;
