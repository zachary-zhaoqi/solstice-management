import { getBrand } from '../services/api';

export default {
  namespace: 'brand',

  state: {
    brandArray: [],
  },

  effcets: {
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

  reducer: {
    saveBrandArray(state, { payload }) {
      return {
        ...state,
        brandArray:payload,
      };
    },
  },
}