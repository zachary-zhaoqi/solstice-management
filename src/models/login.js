import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { AccountLogin } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },
  
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(AccountLogin, payload);
      // console.log('login model login accountLogin-responser',response);

      yield put({
        type: 'changeLoginStatus',
        payload: response.data,
      });

      // Login successfully
      if (response.code === 10000) {
        const datetime = new Date();
        datetime.setTime(datetime.getTime() + (60 * 60 * 1000));
        const expires = `expires=${datetime.toGMTString()}`;
        document.cookie = `token=${response.data.jwt};${expires}`;

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

      const datetime = new Date();
      datetime.setTime(datetime.getTime() + (-1 * 60 * 60 * 1000));
      const expires = `expires=${datetime.toGMTString()}`;
      document.cookie = `token='';${expires}`;

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
      console.log("login model changeLoginStatus",payload);
      setAuthority(payload.userAuthority);
      return {
        ...state,
        ...{
          status:payload.status,
          currentAuthority:payload.userAuthority,
        },
      };
    },
  },
};
