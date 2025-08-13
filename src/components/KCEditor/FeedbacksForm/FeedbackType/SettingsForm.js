import { useCallback, useEffect, useRef, useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignal,
  faClock,
  faBatteryHalf,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { changeFeedbackSettings } from '../../../../store/actions/editor/editorActions';

const SettingsForm = (props) => {
  const { setIsShowSettingsForm, feedbackSettings, changeFeedbackSettings } =
    props;

  const inputFileRef = useRef(null);

  const [branchNameVal, setBranchName] = useState('');
  const [clockVal, setClock] = useState('');
  const [batteryVal, setBattery] = useState(0);
  const [customerNameVal, setCustomerName] = useState('');
  const [activityVal, setActivity] = useState('');
  const [avatarVal, setAvatar] = useState('');

  useEffect(() => {
    if (feedbackSettings) {
      const { branchName, clock, battery, customerName, activity, avatar } =
        feedbackSettings;

      setBranchName(branchName);
      setClock(clock);
      setBattery(battery);
      setCustomerName(customerName);
      setActivity(activity);
      setAvatar(avatar);
    }
  }, []);

  const changeBranchName = (value) => {
    setBranchName(value);
  };

  const changeClock = (value) => {
    setClock(value);
  };

  const changeBattery = (value) => {
    setBattery(value);
  };

  const changeCustomerName = (value) => {
    setCustomerName(value);
  };

  const changeActivity = (value) => {
    setActivity(value);
  };

  const handleOnSave = useCallback(() => {
    const newSettings = {
      branchName: branchNameVal,
      clock: clockVal,
      battery: batteryVal,
      customerName: customerNameVal,
      activity: activityVal,
      avatar: avatarVal,
    };
    changeFeedbackSettings(newSettings);
    setIsShowSettingsForm(false);
  }, [
    branchNameVal,
    clockVal,
    batteryVal,
    customerNameVal,
    activityVal,
    avatarVal,
  ]);

  const onFileChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertBase64(file);
    setAvatar(base64);
  };

  const handleUploadClick = useCallback(() => {
    inputFileRef.current.click();
  });

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  return (
    <div className="settingsForm z-9999 absolute top-0 left-0 right-0 h-screen bg-createContent-modalOverLayClr pt-28">
      <div className="mx-auto my-0 w-5/6 max-h-80 bg-white rounded-md shadow-md p-4">
        <div className="text-right py-2 h-8 relative">
          <XIcon
            className="w-6 h-6 cursor-pointer absolute right-2 top-2"
            onClick={() => setIsShowSettingsForm(false)}
          />
        </div>

        <h5 className="w-full uppercase mb-3">Thanh trạng thái</h5>
        <div className="barStatus grid grid-cols-3 gap-3">
          <div className="flex items-center rounded-lg border border-gray-300">
            <FontAwesomeIcon className="text-base w-10 mx-2" icon={faSignal} />
            <input
              type="text"
              className="w-full border-0 bg-transparent text-center"
              value={branchNameVal}
              onChange={(e) => changeBranchName(e.target.value)}
            />
          </div>
          <div className="flex items-center rounded-lg border border-gray-300">
            <FontAwesomeIcon className="text-base w-10 mx-2" icon={faClock} />
            <input
              type="text"
              className="w-full border-0 bg-transparent text-center"
              value={clockVal}
              onChange={(e) => changeClock(e.target.value)}
            />
          </div>
          <div className="flex items-center rounded-lg border border-gray-300">
            <FontAwesomeIcon
              className="text-base w-10 mx-2"
              icon={faBatteryHalf}
            />
            <input
              type="number"
              className="w-full border-0 bg-transparent text-center"
              value={batteryVal}
              onChange={(e) => changeBattery(e.target.value)}
            />
          </div>
        </div>

        <h5 className="w-full uppercase my-3">Cuộc trò chuyện</h5>
        <div className="customer flex">
          <form className="some-container hidden">
            <input
              type="file"
              ref={inputFileRef}
              accept="image/*"
              onChange={(e) => {
                onFileChange(e);
              }}
            />
          </form>
          <img
            src={avatarVal}
            className="w-24 h-24 rounded-full cursor-pointer object-cover"
            onClick={(e) => handleUploadClick()}
          />
          <div className="pl-4">
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 text-center mb-3"
              value={customerNameVal}
              onChange={(e) => changeCustomerName(e.target.value)}
            />
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 text-center"
              value={activityVal}
              onChange={(e) => changeActivity(e.target.value)}
            />
          </div>
        </div>

        <button
          className="mt-5 p-3 bg-createContent-blueClr text-white border rounded w-5/6 cursor-pointer flex items-center justify-center m-auto"
          onClick={() => {
            handleOnSave();
          }}
        >
          <FontAwesomeIcon className="text-base w-10 mx-2" icon={faSave} />
          <span>Lưu lại</span>
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    feedbackSettings: state.editor.feedbackSettings,
  };
};

export default connect(mapStateToProps, { changeFeedbackSettings })(
  SettingsForm
);
