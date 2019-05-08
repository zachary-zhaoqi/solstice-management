import { getDataDictionary } from '../services/api';

export default {
  namespace: 'category',

  state: {
    categoryTreeData: undefined,
    categorySn: undefined,
    categoryName: undefined,
  },

  effcets: {
    *getCategoryTree(_, { call, put }) {
      const response = yield call(getDataDictionary, { key: 'category', isTree: true });
      yield put({
        type: 'saveCategoryTreeData',
        payload: response.data,
      });
    },
  },

  reducer: {
    saveCategoryTreeData(state, { payload }) {
      const tree=[];
      payload.forEach(treenode => {
        tree.push({
          title:treenode.label_zh_cn,
          value:treenode.value,
          key:treenode.value,
        });
      });

      return {
        ...state,
        categoryTreeData:payload,
      };
    },
  },
}