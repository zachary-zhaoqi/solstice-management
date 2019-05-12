import { getDataDictionary } from '../services/api';

export default {
  namespace: 'dictionary',

  state: {
    categoryArray: [],
    shelfLifeArray:[],
    productStatusArray:[],
    specificationArray:[],
    operationTypeArray:[],
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
  },

  reducers: {
    saveDataDictionary(state,{payload}){
      return{
        ...state,
        ...payload,
      }
    },

  },
}