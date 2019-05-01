import React from 'react';
// import createHistory from 'history/createBrowserHistory';
import { createHashHistory } from 'history'; // 如果是hash路由
import PromiseRender from './PromiseRender';
import { CURRENT } from './renderAuthorize';
import request from '../../utils/request';

function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}

/**
 * 通用权限检查方法
 * Common check permissions method
 * @param { 权限判定 Permission judgment type string |array | Promise | Function } authority
 * @param { 你的权限 Your permission description  type:string} currentAuthority
 * @param { 通过的组件 Passing components } target
 * @param { 未通过的组件 no pass components } Exception
 */
const checkPermissions = (authority, currentAuthority, target, Exception) => {
  // 没有判定权限.默认查看所有
  // Retirement authority, return target;

  let token = "";
  const name = `token=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      token = c.substring(name.length, c.length);
    }
  }
  const jwt = require('jsonwebtoken');
  const decoded = jwt.decode(token, { complete: true });
  if (decoded === null || decoded.payload === null || decoded.payload.userId === null) {
    // console.log("decoded null");
    return Exception;
  }
  const { userId } = decoded.payload;

  // console.log('checkPermissions', decoded);
  if (userId === undefined || userId === null) {
    return Exception;
  }
  // const response = request(`/userinfo/userInfo/${userId}`);
  // const {dispatch} = this.props;
  request(`/userinfo/userInfo//${userId}  `).then((result) => {
    if (result !== null && result.code !== 10000) {
      // dispatch(routerRedux.push('/user/logins'));
      // con  sole.log("createHistory().push('/user/logins');")
      createHashHistory().push('/user/logout');
      // 后期要重新登出，不能仅仅跳转到登陆页。
    }
  })

  if (!authority) {
    return target;
  }
  // 数组处理
  if (Array.isArray(authority)) {
    if (authority.indexOf(currentAuthority) >= 0) {
      return target;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return target;
        }
      }
    }
    return Exception;
  }

  // string 处理
  if (typeof authority === 'string') {
    if (authority === currentAuthority) {
      return target;
    }
    if (Array.isArray(currentAuthority)) {
      for (let i = 0; i < currentAuthority.length; i += 1) {
        const element = currentAuthority[i];
        if (authority.indexOf(element) >= 0) {
          return target;
        }
      }
    }
    return Exception;
  }

  // Promise 处理
  if (isPromise(authority)) {
    return <PromiseRender ok={target} error={Exception} promise={authority} />;
  }

  // Function 处理
  if (typeof authority === 'function') {
    try {
      const bool = authority(currentAuthority);
      // 函数执行后返回值是 Promise
      if (isPromise(bool)) {
        return <PromiseRender ok={target} error={Exception} promise={bool} />;
      }
      if (bool) {
        return target;
      }
      return Exception;
    } catch (error) {
      throw error;
    }
  }
  throw new Error('unsupported parameters');
};

export { checkPermissions };

const check = (authority, target, Exception) => {
  return checkPermissions(authority, CURRENT, target, Exception);
};

export default check;
