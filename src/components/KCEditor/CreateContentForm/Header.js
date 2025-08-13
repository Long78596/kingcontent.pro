import { PencilAltIcon, XIcon } from '@heroicons/react/outline';
import React from 'react';
import { connect } from 'react-redux';
import { changeStateCreateContentForm } from '../../../store/actions/editor/createContentActions';

function Header(props) {
  const { changeStateCreateContentForm } = props;

  return (
    <div className="w-full h-14 flex items-center justify-between py-0 px-5 bg-createContent-blueClr text-white outline-none ">
      <PencilAltIcon className="h-8 w-8" />
      <h2 className="text-base uppercase font-semibold ">Tạo bài viết </h2>
      <XIcon
        className="bg-createContent-lightBlueClr rounded-full h-8 w-8 p-1 text-createContent-grayClr transition-all cursor-pointer hover:text-createContent-blackClr "
        onClick={() => changeStateCreateContentForm(false)}
      />
    </div>
  );
}

export default connect(null, { changeStateCreateContentForm })(Header);
