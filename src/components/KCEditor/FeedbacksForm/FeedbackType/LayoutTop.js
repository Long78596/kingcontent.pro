import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect, useSelector } from 'react-redux';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

const LayoutTop = (props) => {
  const { type, setIsShowSettingsForm } = props;
  const { feedbackSettings } = useSelector((state) => state.editor);

  const { branchName, clock, battery, customerName, activity, avatar } =
    feedbackSettings;
  const clsWidth = battery < 100 ? `w-${battery}%` : 'w-full';

  const [batBgClass, setBatBgClass] = useState('full');

  useEffect(() => {
    if (battery >= 80) {
      setBatBgClass('full');
    } else {
      if (battery > 20) {
        setBatBgClass('normal');
      } else {
        setBatBgClass('bad');
      }
    }
  }, [battery]);

  return (
    <div
      className={`app_top bg-${type}-top h-${type}-top ${
        type == 'zalo' ? 'text-white' : 'text-black'
      } cursor-pointer`}
      onClick={() => setIsShowSettingsForm(true)}
    >
      <div className="flex items-center justify-center relative h-6">
        <div className="app_mno flex flex-1 text-left pl-9 items-center">
          <span>{branchName}</span>
          <FontAwesomeIcon className="ml-2" icon={faWifi} />
        </div>
        <span className="app_clock flex-1 text-center">{clock}</span>
        <span className="app_bat flex-1 pr-11 text-right">{battery}%</span>
        <span className="battery absolute">
          <i
            className={`bg-editor-battery-${batBgClass} ${clsWidth} absolute h-full h-battery rounded-sm`}
          ></i>
        </span>
      </div>
      <div className="flex items-center h-16">
        <img
          className={`friend_avatar w-12 h-12 rounded-full ${
            type == 'zalo' ? 'ml-11' : 'ml-9'
          }`}
          src={avatar}
        />
        <div className="ml-3 w-auto">
          <span className="app_name font-bold block w-full">
            {customerName}
          </span>
          <span className="app_activity block w-full">{activity}</span>
        </div>
      </div>
    </div>
  );
};

export default LayoutTop;
