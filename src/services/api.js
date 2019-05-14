import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

// ============================================
// 以上为虚假url

export async function AccountLogin(params) {
  return request('userlogin/session', {
    method: 'POST',
    body: params,
  });
}

export async function getDataDictionary(params) {
  return request(`dictionary/dataDictionary?${stringify(params)}`)
}

export async function getBrand(params) {
  return request(`/brand/brandInfo?${stringify(params)}`)
}

// 商品相关操作
export async function saveProduct(params) {
  return request(`product/productInfo/${params.name}`, {
    method: 'POST',
    body: params,
  });
}

export async function queryProduct(params) {
  return request(`/product/productInfo?${stringify(params)}`)
}

export async function removeProduct(params) {
  return request(`product/productInfo/`, {
    method: 'DELETE',
    body: params,
  });
}


// 库存信息
export async function queryInventoryInfo(params) {
  return request(`/inventory/inventoryInfo?${stringify(params)}`)
}

export async function queryInventoryOperation(params) {
  return request(`/inventory/inventoryOperation?${stringify(params)}`)
}

export async function newInventoryInfo(params){
  return request(`inventory/inventoryInfo`, {
    method: 'POST',
    body: params,
  });
}

//shippingAddress
export async function queryShippingAddress(params) {
  return request(`/shippingaddress/shippingAddress?${stringify(params)}`)
}
