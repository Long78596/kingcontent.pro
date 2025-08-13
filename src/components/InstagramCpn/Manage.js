import React, { useState } from 'react';
import LeftPart from './LeftPart/LeftPart';
import ModalCollection from './ModalCollection/ModalCollection';
import RightPart from './RightPart/RightPart';
import ContentDetail from './ContentDetail/ContentDetail';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useSelector } from 'react-redux';

const Manage = (props) => {
  const {
    isSchedule = false,
    isAuto = false,
    handleAddToWaitingList = () => {},
  } = props;
  const [open, setOpen] = useState(!isSchedule);

  const onCollapse = () => {
    setOpen(!open);
  };
  const { currentContent = null } = useSelector((state) => state.instagram);
  return (
    <div className="manage-instagram mt-3 flex w-full gap-2 flex-wrap lg:flex-nowrap">
      <div className={`left-part relative ${open ? 'w-full lg:w-1/4' : ''}`}>
        <div className={`${open ? 'block' : 'hidden'}`}>
          <LeftPart isSchedule={isSchedule} />
        </div>
        <div
          className="absolute -right-4 top-2 cursor-pointer border rounded-full bg-primary text-white"
          onClick={onCollapse}
        >
          {open ? (
            <FiChevronLeft className="text-base" />
          ) : (
            <FiChevronRight className="text-base" />
          )}
        </div>
      </div>
      <div className={`right-part w-full ${open ? 'lg:w-3/4' : ''}`}>
        <RightPart
          isSchedule={isSchedule}
          isAuto={isAuto}
          handleAddToWaitingList={handleAddToWaitingList}
          open={open}
        />
      </div>
      <ModalCollection />
      {currentContent && <ContentDetail />}
    </div>
  );
};

export default Manage;
