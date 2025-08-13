import Client from '../Client';
import { API_SEARCH_ADS_RUNNING } from '../configs';

export const runningAdsService = {
  searchAds(inputValue, collectionToken = '', forwardCursor = '') {
    let params = '';
    if (collectionToken) {
      params += `&collection_token=${collectionToken}`;
    }
    if (forwardCursor) {
      params += `&forward_cursor=${forwardCursor}`;
    }
    // convert # to %23
    inputValue = inputValue.replace('#', '%23');
    return Client.get(
      `${API_SEARCH_ADS_RUNNING}?keyword=${inputValue}${params}`
    );
  },
};
