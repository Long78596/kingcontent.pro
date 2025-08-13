import * as types from '../../store/types/index';

const specialReducerInitialState = {
  contents: [],
  currentPage: 1,
  totalPages: 1,
  selectedIndexs: [],
};

const specialReducer = (state = specialReducerInitialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case types.CREATE_CONTENT_GET_SPECIAL_CONTENTS:
      const { contents, totalPages, page } = payload;
      if (page === 1) {
        return { ...state, contents, totalPages, currentPage: page, selectedIndexs: [] };
      } else {
        return {
          ...state,
          contents: [...state.contents, ...contents],
          totalPages,
          currentPage: page,
        };
      }

    case types.CREATE_CONTENT_CHANGE_SELECTED_SPECIAL_CONTENT:
      const { index, isSelected } = payload;
      // Select/Remove ALL
      if (index === -1) {
        if (isSelected === true) {
          return {
            ...state,
            selectedIndexs: Array.from(state.contents.keys()),
          };
        }
        else if (isSelected === false) {
          return {
            ...state,
            selectedIndexs: [],
          };
        }
      }
      // Select/Remove single item
      else if (isSelected === true && !state.selectedIndexs.includes(index))
        return {
          ...state,
          selectedIndexs: [...state.selectedIndexs, index],
        };
      else if (isSelected === false && state.selectedIndexs.includes(index))
        return {
          ...state,
          selectedIndexs: [...state.selectedIndexs.filter(idx => idx !== index)],
        };
      // default
      return state;
    default:
      return state;
  }
};

export default specialReducer;
