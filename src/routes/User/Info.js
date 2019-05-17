import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Form, Input, Button, Select, Radio, DatePicker, Row, Col, Popover, Progress, Message } from 'antd';
import styles from './Register.less';

const FormItem = Form.Item;

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, location } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        dispatch({
          type: 'register/submitInfo',
          payload: {
            userId: location.params.id,
            ...values,
          },
          callback: (response) => {
            if (response.code === 10000) {
              dispatch(routerRedux.push({
                pathname: '/user/login',
              }));
            } else {
              Message.error(response.message);
            }
          },
        });
      }
    });
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div className={styles.main}>
        <h1>请补充填写用户基本信息</h1>
        <br />
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入账户！',
                },
              ],
            })(<Input size="large" placeholder="用户名称" />)}
          </FormItem>
          <FormItem style={{ 'text-align': 'center' }}>
            {getFieldDecorator('userSex', {
              rules: [
                {
                  required: true,
                  message: '请输入账户！',
                },
              ],
            })(
              <Radio.Group value='保密'>
                <Radio value='男'>男</Radio>
                <Radio value='女'>女</Radio>
                <Radio value='保密'>保密</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem style={{ 'text-align': 'center' }}>
            {getFieldDecorator('userBirthday', {
              rules: [
                {
                  required: true,
                  message: '请选择您的生日~有惊喜哦',
                },
              ],
            })(<DatePicker size="large" placeholder="出生日期" />)}
          </FormItem>

          <FormItem style={{ 'text-align': 'center' }}>
            <Button
              size="large"
              loading={submitting}
              style={{ width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              完成
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
