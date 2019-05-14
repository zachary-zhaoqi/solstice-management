import { stringify } from 'qs';
import request from '../utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent(params) {
  return request(`/userinfo/userInfo/${params}`);
}

export async function queryUserInfo(params) {
  return request(`/userinfo/userInfo?${stringify(params)}`);
}
