import { message } from 'antd';
import { saveProduct, queryProduct } from '../services/api';

export default {
  namespace: 'product',

  state: {
    status: undefined,
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *saveProduct({ payload }, { call, put }) {
      console.log("model product payload", payload);
      const response = yield call(saveProduct, payload);
      if (response.code === 10000) {
        message.success(response.message);
        // dispatch 更新查询方法
      } else {
        message.error(response.message);
      }
    },

    *queryProduct({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'savaProductList',
        payload: response.date || [],
      });
    },
  },

  reducers: {
    savaProductList(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    }
  },

}