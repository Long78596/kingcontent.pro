import { isEmpty } from 'lodash';

const TOKEN_KEY = 'jwtToken';
const USER_INFO = 'userInfo';

const parse = JSON.parse;
const stringify = JSON.stringify;

const ROLE_CUSTOMER = 'register';
const ROLE_VIP = 'um_customer-level-1';
const ROLE_VIP_2 = 'um_thanh-vien-vip-2';
const ROLE_VIP_3 = 'vip-3';
const ROLE_VIP_3B = 'vip-3-b';
const ROLE_VIP_3C = 'vip-3-c';

const auth = {
  /**
   * Remove an item from the used storage
   * @param  {String} key [description]
   */
  clear(key) {
    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key);
    }

    if (sessionStorage && sessionStorage.getItem(key)) {
      return sessionStorage.removeItem(key);
    }

    return null;
  },

  /**
   * Clear all app storage
   */
  clearAppStorage() {
    if (localStorage) {
      localStorage.clear();
    }

    if (sessionStorage) {
      sessionStorage.clear();
    }
  },

  clearToken(tokenKey = TOKEN_KEY) {
    return auth.clear(tokenKey);
  },

  clearUserInfo(userInfo = USER_INFO) {
    return auth.clear(userInfo);
  },

  /**
   * Returns data from storage
   * @param  {String} key Item to get from the storage
   * @return {String|Object}     Data from the storage
   */
  get(key) {
    return parse(localStorage.getItem(key)) || null;
  },
  checkLocalStorage(key) {
    if (localStorage && localStorage.getItem(key)) {
      return true;
    }
    return false;
  },

  getToken(tokenKey = TOKEN_KEY) {
    return auth.get(tokenKey);
  },

  getUserInfo(userInfo = USER_INFO) {
    return auth.get(userInfo);
  },

  /**
   * Set data in storage
   * @param {String|Object}  value    The data to store
   * @param {String}  key
   * @param {Boolean} isLocalStorage  Defines if we need to store in localStorage or sessionStorage
   */
  // @ts-ignore
  set(value, key, isLocalStorage = true) {
    if (isEmpty(value)) {
      return null;
    }
    return localStorage.setItem(key, stringify(value));
  },

  setToken(value = '', isLocalStorage = true, tokenKey = TOKEN_KEY) {
    return auth.set(value, tokenKey, isLocalStorage);
  },

  setUserInfo(value = '', isLocalStorage = true, userInfo = USER_INFO) {
    return auth.set(value, userInfo, isLocalStorage);
  },

  isVip() {
    const userInfo = auth.getUserInfo();
    if (userInfo) {
      const { customer_role = {} } = userInfo;
      if (
        customer_role &&
        (customer_role[ROLE_VIP] === 1 || customer_role[ROLE_VIP] === true)
      ) {
        return true;
      }
    }
  },

  isVip2() {
    const userInfo = auth.getUserInfo();
    if (userInfo) {
      const { customer_role = {} } = userInfo;
      if (
        customer_role &&
        (customer_role[ROLE_VIP_2] === 1 || customer_role[ROLE_VIP_2] === true)
      ) {
        return true;
      }
    }
    return false;
  },

  isVip3() {
    const userInfo = auth.getUserInfo();
    if (userInfo) {
      const { customer_role = {} } = userInfo;
      if (
        customer_role &&
        (customer_role[ROLE_VIP_3] === 1 || customer_role[ROLE_VIP_3] === true)
      ) {
        return true;
      }
    }
    return false;
  },

  isVip3b() {
    const userInfo = auth.getUserInfo();
    if (userInfo) {
      const { customer_role = {} } = userInfo;
      if (
        customer_role &&
        (customer_role[ROLE_VIP_3B] === 1 || customer_role[ROLE_VIP_3B] === true)
      ) {
        return true;
      }
    }
    return false;
  },

  isVip3c() {
    const userInfo = auth.getUserInfo();
    if (userInfo) {
      const { customer_role = {} } = userInfo;
      if (
        customer_role &&
        (customer_role[ROLE_VIP_3C] === 1 || customer_role[ROLE_VIP_3C] === true)
      ) {
        return true;
      }
    }
    return false;
  },

  isHasVip3() {
    return (
      auth.isVip3() ||
      auth.isVip3b() ||
      auth.isVip3c()
    );
  },

  isRegistered() {
    const userInfo = auth.getUserInfo();
    if (userInfo) {
      const { customer_role = {} } = userInfo;
      if (customer_role && customer_role[ROLE_CUSTOMER]) {
        return true;
      }
    }
    return false;
  },

  isHasPermission() {
    return auth.isVip() || auth.isVip2() || auth.isVip3() || auth.isVip3b() || auth.isVip3c();
  },

  isNearlyExpired() {
    if (auth.isHasPermission()) {
      const userInfo = auth.getUserInfo();
      const { date_expired = null } = userInfo;
      // check if expired day is less than 10 days
      if (date_expired) {
        const currentDate = new Date();
        const expiredDate = new Date(date_expired * 1000);
        // @ts-ignore
        const diffTime = Math.abs(expiredDate - currentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 10) {
          return true;
        }
      }
    }
    return false;
  },

  checkNeedReloadData() {
    const lastCheck = auth.get('lastCheck');
    // return true when no last check or last check is more than 10 minutes
    // @ts-ignore
    if (!lastCheck || new Date() - new Date(lastCheck) > 600000) {
      return true;
    }
    return false;
  },

  getMaxContentsByRole() {
    if (auth.isVip2() || auth.isVip3() || auth.isVip3b() || auth.isVip3c()) {
      return 50;
    }
    return 10;
  },

  getMaxRenderAIVideoByRole() {
    switch (true) {
      case auth.isVip3():
        return 10;
      case auth.isVip3b():
        return 25;
      case auth.isVip3c():
        return 60;
      default:
        return 0;
    }
  },
};

export default auth;
