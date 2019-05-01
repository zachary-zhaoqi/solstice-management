import { getDataDictionary } from '../services/api';

export default {
  namespace: 'category',

  state: {
    categoryTreeData: undefined,
    categorySn: undefined,
    categoryName: undefined,
  },

  effcets: {
    *getCategoryTreeData(_, { call, put }) {
      const response=yield call(getDataDictionary,{key:'category'});
      console.log('category model - effcets - getCategoryTreeData - res',response);
    },
  },

  reducer: {

  },
}