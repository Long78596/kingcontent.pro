import { useEffect, useState } from 'react';
const Medias = (props) => {
  const { medias } = props;
  const [avatar, setAvatar] = useState('');
  const [moreMedias, setMoreMedias] = useState(0);

  useEffect(() => {
    if (medias && medias.length > 0) {
      const defaultAvatar = medias[0] ?? [];
      setAvatar(defaultAvatar.url || '');
      setMoreMedias(medias.length - 1);
    }
  }, [medias]);
  return (
    <div className="content-avatar relative mb-2">
      <img src={avatar} alt="" />
      {moreMedias > 0 && (
        <span className="more-medias absolute rounded-full bg-black bg-opacity-50 text-white text-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 text-base">
          + {moreMedias}
        </span>
      )}
    </div>
  );
};

export default Medias;
