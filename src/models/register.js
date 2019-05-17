import { sendCaptcha, register, registerInfo } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {

    *sendCaptcha({ payload , callback}, { call, put }) {
      const response = yield call(sendCaptcha, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
    },

    *submit({ payload, callback }, { call, put }) {
      const response = yield call(register, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
    },

    *submitInfo({ payload, callback }, { call, put }) {
      const response = yield call(registerInfo, payload);
      if (callback && typeof callback === 'function') {
        callback(response)
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
