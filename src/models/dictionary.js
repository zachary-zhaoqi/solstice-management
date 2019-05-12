import { getDataDictionary } from '../services/api';

export default {
  namespace: 'dictionary',

  state: {
    categoryArray: [],
    shelfLifeArray:[],
    productStatusArray:[],
    specificationArray:[],
  },

  effects: {
    *getDataDictionary({payload}, { call, put }) {
      const response = yield call(getDataDictionary,payload);
      const {key}=payload;
      const arrayName=`${key}Array`;
      yield put({
        type: 'saveDataDictionary',
        payload: {
          [arrayName]:response.data,
        },
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
    saveDataDictionary(state,{payload}){
      console.log('---------------------',payload);
      return{
        ...state,
        ...payload,
      }
    },

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