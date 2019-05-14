import { message } from 'antd';
import {
  saveProduct, removeProduct, queryProduct,
  queryInventoryInfo, newInventoryInfo,
  queryInventoryOperation,
} from '../services/api';

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
    inventoryInfoArrayModal: [],
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

    *queryinventoryInfoArrayModal({ payload }, { call, put }) {
      console.log("|||||||||||=-=-=-=-=-=-=", payload);

      const response = yield call(queryProduct, payload);
      const response1 = yield call(queryInventoryInfo, { productId: response.data[0].id });

      console.log("queryinventoryInfoArrayModal", response, response1);


      if (response1.data.length > 0) {
        yield put({
          type: 'savaInventoryInfoArrayModal',
          payload: response1.data || [],
        });
      } else {
        yield put({
          type: 'savaInventoryInfoArrayModal',
          payload: response.data || [],
        });
      }
    },
    *newInventoryInfo({ payload }, { call, put }) {
      console.log("1236", payload);

      const response = yield call(newInventoryInfo, payload);
      console.log("123456789", response);
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
    savaInventoryInfoArrayModal(state, { payload }) {
      console.log("savaInventoryInfoArrayModal", payload)
      return {
        ...state,
        inventoryInfoArrayModal: payload,
      }
    },
  },

}