import Client from '../Client';
import { API_FANPAGES, _LIMIT_DEFAULT } from '../configs';

export const fanpageService = {
  getAllFanpage(page = 1, limit = _LIMIT_DEFAULT, sort = 'posts_count', order = 'desc') {
    const sortQuery = `&_sort=${sort}&_order=${order}`;
    return Client.get(`${API_FANPAGES}?_limit=${limit}&page=${page}${sortQuery}`);
  },
  searchFanpagesByCategories(query, cateId, start = 0, sort = 'createdAt', order = 'desc') {
    const sortQuery = `&_sort=${sort}&_order=${order}`;
    const endpoint = `${API_FANPAGES}?${query}=${cateId}&_limit=${_LIMIT_DEFAULT}&page=${start}${sortQuery}`;
    return Client.get(endpoint);
  },
  searchFanpagesByName(name, cateId, isFilter, start) {
    return Client.get(
      `${API_FANPAGES}?${
        isFilter === 'BYCATEANDNAME'
          ? `category=${cateId}&keyword=${name}&_limit=${_LIMIT_DEFAULT}&page=${start}`
          : `keyword=${name}&_limit=${_LIMIT_DEFAULT}&page=${start}`
      }`
    );
  },
  updateLabelFanpage(id , data){
    return Client.put(`${API_FANPAGES}/${id}` , data)
  }
};
