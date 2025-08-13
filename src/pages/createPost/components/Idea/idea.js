import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IdeaCategories from './IdeaCategories';
import IdeaContents from './IdeaContents';

const Idea = () => {
  const [showCats, setShowCats] = useState(true);
  const [showContents, setShowContents] = useState(false);

  const { categorySelect } = useSelector((state) => state.createPost);

  useEffect(() => {
    if(categorySelect) {
      setShowCats(false);
      setShowContents(true);
    }else{
      setShowCats(true);
      setShowContents(false);
    }
  }, [categorySelect])
  
  return (
    <>
      {showCats && <IdeaCategories />}
      {showContents && <IdeaContents 
        setShowCats={setShowCats}
        setShowContents={setShowContents}
      />}
    </>
  );
};

export default Idea;
