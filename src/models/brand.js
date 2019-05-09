import { getBrand } from '../services/api';

export default {
  namespace: 'brand',

  state: {
    brandArray: [],
  },

  effects: {
    *getTotalBrand(_, { call, put }) {
      console.log("model brand getTotalBrand");

      const response = yield call(getBrand,undefined);
      
      console.log("model brand getTotalBrand response",response);

      yield put({
        type:'saveBrandArray',
        payload:response.data,
      });
    },
  },

  reducers: {
    saveBrandArray(state, { payload }) {
      console.log("brand model reducer saveBrandArray payload",payload);
      return {
        ...state,
        brandArray:payload,
      };
    },
  },
};