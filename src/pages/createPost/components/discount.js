import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import ContentSugestion from '../../../components/ContentSugesstion';
import { API_EDIT_SUGGEST_KEYWORD } from '../../../configs';
import {
  actionGetPostByKeyword
} from '../../../store/actions/createContent';
import { DISCOUNT } from '../utility';

const Discount = () => {
  const [startDocument, setStartDocument] = useState(5);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actionGetPostByKeyword(API_EDIT_SUGGEST_KEYWORD , 'label' ,DISCOUNT, startDocument));
  }, []);
  return (
    <ContentSugestion typeSug={DISCOUNT} api={API_EDIT_SUGGEST_KEYWORD} query={'label'} typePost="postSug"/>
  );
}

export default Discount