import * as categoriesTypes from '../../types/categories';
import client from '../../../Client';

export const getParentCategories = () => async (dispatch) => {
  try {
    await client
      .get(`/categories/parents`)
      .then((result) => {
        dispatch({
          type: categoriesTypes.GET_PARENT_CATEGORIES,
          payload: result.data.data,
        });
      })
      .catch((err) => console.log('Err get parent categories: ' + err));
  } catch (error) {
    console.log('Error get parent categories: ' + error);
  }
};

export const getChildCategories =
  (query = {}, setIsCateSelect) =>
  async (dispatch) => {
    try {
      await client
        .get(`/categories/children`)
        .then((result) => {
          if (setIsCateSelect) {
            const defaultCatId = 205;
            // const defaultCatId = result.data.data[0]?.cate_id
            setIsCateSelect(defaultCatId);
          }
          dispatch({
            type: categoriesTypes.GET_CHILD_CATEGORIES,
            payload: result.data.data,
          });
        })
        .catch((err) => console.log('Err get child categories: ' + err));
    } catch (error) {
      console.log('Error get child categories: ' + error);
    }
  };

export const getChildCategoriesSearch =
  (query = {}) =>
  async (dispatch) => {
    try {
      await client
        .get(`/categories/children`)
        .then((result) => {
          const data = result.data.data.map((_elt) => {
            return {
              value: _elt.cate_id,
              label: _elt.cate_name,
            };
          });
          const defaultData = [
            {
              value: 'DEFAULT',
              label: 'Tất cả',
            },
          ].concat(data);
          dispatch({
            type: categoriesTypes.GET_CHILD_CATEGORIES,
            payload: defaultData,
          });
        })
        .catch((err) => console.log('Err get child categories: ' + err));
    } catch (error) {
      console.log('Error get child categories: ' + error);
    }
  };

export const getTakeCareFbCategories = () => async (dispatch) => {
  const cateId = '257';
  try {
    await client
      .get(`/categories/${cateId}/children`)
      .then((result) => {
        let data = [];
        const resData = result.data.data || [];
        resData.map((item, idx) => {
          const { childs = [] } = item;
          if (childs.length === 0) {
            data.push(item);
          } else {
            childs.map((childItem, childIdx) => {
              data.push(childItem);
              return true;
            });
          }
          return true;
        });
        dispatch({
          type: categoriesTypes.GET_TAKE_CARE_FB_CATEGORIES,
          payload: data,
        });
      })
      .catch((err) => console.log('Err get take care FB categories: ' + err));
  } catch (error) {
    console.log('Error get take care FB categories: ' + error);
  }
};
