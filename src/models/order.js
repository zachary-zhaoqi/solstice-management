import { message } from 'antd';
import { createOrder, queryProduct,queryOrder,removeProduct } from '../services/api';

export default {
  namespace: 'order',

  state: {
    newOrder: {
      userId: undefined,
      shippingAddressId: undefined,
      payMethod: undefined,
      shippingSn: undefined,
      orderMoney: 0,
      orderDetailList: [],
    },
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *createOrder({ payload }, { call, put }) {
      console.log("model order createOrder payload", payload);
      const response = yield call(createOrder, payload);
      if (response.code === 10000) {
        message.success(response.message);
        // dispatch 更新查询方法
      } else {
        message.error(response.message);
      }
    },
    *queryOrder({ payload }, { call, put }) {
      const response = yield call(queryOrder, payload);
      yield put({
        type: 'savaOrderList',
        payload: response.data || [],
      });
    },
    *initOrderDetailList({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'initSavaOrderDetailList',
        payload: response.data || [],
      });
    },

  },

  reducers: {
    savaOrderList(state, { payload }){
      const nowdata = {
        list: payload,
        pagination: {},
      }

      return {
        ...state,
        data: nowdata,
      }
    },

    initSavaOrderDetailList(state, { payload }) {
      console.log("initOrderDetailList payload", payload);
      const orderDetailList = [];
      let orderMoney = 0;
      payload.map(item => {
        orderDetailList.push(Object.assign({}, item, { orderProductNumber: item.orderProductNumber || 1, orderProductPrice: item.price }));
        orderMoney += ((item.orderProductNumber || 1) * item.price);
      });

      return {
        ...state,
        newOrder: {
          orderMoney,
          orderDetailList,
        },
      }
    },

    updateNewOrder(state, { payload }) {

      console.log("updateNewOrder", payload);

      return {
        ...state,
        newOrder: payload,
      }
    },

  },

}