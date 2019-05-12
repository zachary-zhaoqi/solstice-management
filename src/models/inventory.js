import { message } from 'antd';
import {saveProduct, removeProduct,queryInventoryInfo,queryInventoryOperation} from '../services/api';

export default {
  namespace: 'inventory',

  state: {
    status: undefined,
    infoData: {
      list: [],
      pagination: {},
    },
    operationData: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *saveProduct({ payload }, { call, put }) {
      console.log("model product savProduct payload", payload);
      const response = yield call(saveProduct, payload);
      if (response.code === 10000) {
        message.success(response.message);
        // dispatch 更新查询方法
      } else {
        message.error(response.message);
      }
    },

    *queryInventoryInfo({ payload }, { call, put }) {
      const response = yield call(queryInventoryInfo, payload);
      yield put({
        type: 'savaInventoryInfoData',
        payload: response.data || [],
      });
    },

    *removeProduct({ payload, callback }, { call, put }) {
      const response = yield call(removeProduct, payload);
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    },

    *queryInventoryOperation({ payload }, { call, put }) {
      const response = yield call(queryInventoryOperation, payload);
      yield put({
        type: 'savaInventoryOperation',
        payload: response.data || [],
      });
    },
  },

  reducers: {
    savaInventoryInfoData(state, { payload }) {
      const nowdata = {
        list: payload,
        pagination: {},
      }
      return {
        ...state,
        infoData: nowdata,
      }
    },
    savaInventoryOperation(state, { payload }) {
      const nowdata = {
        list: payload,
        pagination: {},
      }
      return {
        ...state,
        operationData: nowdata,
      }
    },
  },

}