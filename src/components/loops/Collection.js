import React from 'react';

const Collection = (collection) => {
  const baseURL = process.env.API_URL;
  const collectionThumbnail = collection.image ? collection.image.url : '';

  return (
    <div className="bg-white shadow-zenius rounded-zenius overflow-hidden p-3">
      <div className="rounded-zenius overflow-hidden mb-3">
        <img
          className="object-cover h-40 w-full"
          src={baseURL + collectionThumbnail}
        />
      </div>
      <div className="text-center font-bold">
        <h4>{collection.name}</h4>
      </div>
    </div>
  );
};

export default Collection;
