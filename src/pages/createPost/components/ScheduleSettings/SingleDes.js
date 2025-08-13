import { useCallback, useEffect, useState } from 'react';
import { FaCheckSquare } from 'react-icons/fa';
import tiktokIcon from '../../../../assets/images/icon/tiktok.png';
import threadsIcon from '../../../../assets/images/icon/threads-grey-icon.png';
import { convertInstagramLink } from '../../../../helpers';

const SingleDes = (props) => {
  const { destination, onClickDestination, selectedDestinations, type } = props;
  const [isSelected, setIsSelected] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [id, setId] = useState('');

  useEffect(() => {
    if (
      selectedDestinations &&
      destination &&
      selectedDestinations.length > 0
    ) {
      const search = selectedDestinations.filter(
        (item) =>
          item.id === destination?.id ||
          (item.id === destination?.username && type === 'tiktok')
      );
      setIsSelected(search.length > 0);
    } else {
      setIsSelected(false);
    }
  }, [selectedDestinations, destination]);

  useEffect(() => {
    if (destination) {
      setName(destination?.name);
      setId(destination?.id);
      switch (type) {
        case 'threads':
          const { threads_profile_picture_url = '' } = destination;
          setAvatar(
            convertInstagramLink(threads_profile_picture_url) || threadsIcon
          );
          break;

        case 'tiktok':
          setAvatar(destination?.avatar_url || tiktokIcon);
          setName(destination?.display_name);
          setId(destination?.username);
          break;

        default:
          setAvatar(destination?.picture?.url);
          break;
      }
    }
  }, [destination, type]);

  return (
    <div
      className={`destinationItem flex gap-2 items-center border rounded-md shadow-sm p-2 cursor-pointer drop-shadow-md mb-2 h-20 ${
        isSelected ? 'border-greenSuccess' : ''
      }`}
      onClick={() => onClickDestination(id, type)}
    >
      <div className="desThumbnail">
        <img src={avatar} alt={name} className="w-14 rounded-md" />
      </div>
      <div className="destinationName">
        {name} ({id})
      </div>
      <div className="selectedItem ml-auto w-12 text-center text-green text-base text-greenSuccess">
        {isSelected && <FaCheckSquare className="inline-block" />}
      </div>
    </div>
  );
};

export default SingleDes;
