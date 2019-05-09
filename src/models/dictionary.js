import { getDataDictionary } from '../services/api';

export default {
  namespace: 'dictionary',

  state: {
    categoryTreeData: undefined,
    shelfLifeArray:[],
    productStatusArray:[],
  },

  effects: {
    *getCategoryTree(_, { call, put }) {
      const response = yield call(getDataDictionary, { key: 'category', tree: true });
      yield put({
        type: 'saveCategoryTreeData',
        payload: response.data,
      });
    },

    *getShelfLifeArray(_,{call,put}){
      const response=yield call(getDataDictionary,{key:'shelfLife'});
      yield put({
        type:'saveShelfLifeArray',
        payload:response.data,
      });
    },
    
    *getProductStatusArray(_,{call,put}){
      const response=yield call(getDataDictionary,{key:'productStatus'});
      yield put({
        type:'saveProductStatusArray',
        payload:response.data,
      });
    },
  },

  reducers: {
    saveCategoryTreeData(state, { payload }) {
      return {
        ...state,
        categoryTreeData:payload,
      };
    },

    saveShelfLifeArray(state, { payload }) {
    console.log("model dictionary reducers savaShelfLifeArray payload", payload);      
      return {
        ...state,
        shelfLifeArray:payload,
      };
    },

    saveProductStatusArray(state, { payload }) {    
      return {
        ...state,
        productStatusArray:payload,
      };
    },
  },
}