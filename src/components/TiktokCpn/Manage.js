import React, { useState } from 'react';
import LeftPart from './LeftPart/LeftPart';
import ModalCollection from './ModalCollection/ModalCollection';
import RightPart from './RightPart/RightPart';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Manage = () => {
  const [open, setOpen] = useState(true);

  const onCollapse = () => {
    setOpen(!open);
  };
  return (
    <div className="manage-tiktok mt-3 flex w-full gap-2 flex-wrap lg:flex-nowrap">
      <div className={`left-part relative ${open ? 'w-full lg:w-1/4' : ''}`}>
        <div className={`${open ? 'block' : 'hidden'}`}>
          <LeftPart />
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
        <RightPart leftOpen={open} />
      </div>
      <ModalCollection />
    </div>
  );
};

export default Manage;
