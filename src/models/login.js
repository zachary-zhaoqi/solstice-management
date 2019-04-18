import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { AccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';
import { SSL_OP_COOKIE_EXCHANGE } from 'constants';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      // console.log(payload);      
      const jwt = require('jsonwebtoken');
      // get the decoded payload ignoring signature, no secretOrPrivateKey needed
      // const decoded = jwt.decode(response.data);
      const decoded = jwt.decode(response.data, { complete: true });
      // console.log(decoded.header);
      // console.log(decoded.payload)

      yield put({
        type: 'changeLoginStatus',
        payload: decoded.payload,
      });

      // Login successfully
      if (response.code === 10000) {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      console.log(payload);
      setAuthority(payload.user.userAuthority);
      let newstatus = 'error';
      if (payload.code === 10000) {
        newstatus = 'ok';
      }
      return {
        ...state,
        status: newstatus,
        type: payload.type,
      };
    },
  },
};
