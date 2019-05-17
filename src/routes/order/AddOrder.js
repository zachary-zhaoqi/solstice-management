import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  Input,
  Select,
  Popover,
  Modal,
  Table,
  Spin,
  Divider,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableForm from './TableForm';
import styles from './style.less';
import { queryShippingAddress } from '../../services/api';

const { Option } = Select;

const orderMasterInfo = {
  user: '下单用户',
  payMethod: '付款方式',
  shippingAddress: '收货地址ID',
  shippingAddressName: '收货人',
  shippingAddressTel: '联系电话',
  shippingAddressDesc: '详细收货地址',
};

const SearchShippingAddressModel = Form.create()(props => {
  const { modalVisible, handleSetShippingAddress, handleModalVisible, dataSource, chooseShippingAddressLoading } = props;

  const columns = [
    {
      title: '收货人姓名',
      dataIndex: 'consignee',
      key: 'name',
    },
    {
      title: '电话',
      dataIndex: 'tel',
    },
    {
      title: '省',
      dataIndex: 'province',
    },
    {
      title: '市',
      dataIndex: 'city',
    },
    {
      title: '区',
      dataIndex: 'district',
    },
    {
      title: '详细地址',
      dataIndex: 'address',
    },
  ];

  return (
    <Modal
      title="请选择收货地址"
      visible={modalVisible}
      onCancel={() => handleModalVisible()}
      footer={null}
    >
      <Spin spinning={chooseShippingAddressLoading}>
        <Table columns={columns} dataSource={dataSource} rowSelection={{ type: 'radio', onChange: (selectedRowKeys, selectedRows) => { handleSetShippingAddress(selectedRowKeys, selectedRows) } }} scroll={{ x: 600 }} />
      </Spin>
    </Modal>
  )
});

@connect(({ user, product, order, dictionary, global, loading }) => ({
  user,
  dictionary,
  product,
  order,
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
export default class AdvancedForm extends PureComponent {
  state = {
    SearchShippingAddressModelVisible: false,
    shippingAddress: undefined,
    shippingAddressArray: [],
    chooseShippingAddressLoading: true,
  };

  componentWillMount() {
    const { dispatch, location } = this.props;

    if (location.params !== undefined) {
      dispatch({
        type: 'order/initOrderDetailList',
        payload: { id: location.params },
      });
    }

    dispatch({
      type: 'user/queryUserArray',
      payload: {},
    });

    dispatch({
      type: 'dictionary/getDataDictionary',
      payload: { key: 'payMethod' },
    });

    console.log("location.params", location.params);
  }

  handleSetShippingAddress = (selectedRowKeys, selectedRows) => {
    // const{form}=this.props;
    this.setState({
      shippingAddress: selectedRows[0],
      SearchShippingAddressModelVisible: false,
      chooseShippingAddressLoading: true,
    });
    // form.setFieldsValue('shippingAddressName',selectedRows[0].consifnee)
    // form.setFieldsValue('shippingAddressTel',selectedRows[0].tel)
    // form.setFieldsValue('shippingAddressDesc',`${selectedRows[0].province}${selectedRows[0].city}${selectedRows[0].district}${selectedRows[0].address}`)

  }

  handleModalVisible = flag => {
    this.setState({
      chooseShippingAddressLoading: true,
      SearchShippingAddressModelVisible: !!flag,
    });
  }

  handleQueryShippinAddress = (value) => {
    queryShippingAddress({ 'id': value }).then((res) => {
      this.setState({
        shippingAddressArray: res.data,
        SearchShippingAddressModelVisible: true,
        chooseShippingAddressLoading: false,
      });
    })
    this.handleModalVisible(true);
  }

  handleOrderDetailChange = (e) => {
    const { dispatch } = this.props;
    const newOrder = {
      orderDetailList: e,
      orderMoney: 0,
    }

    e.map(item => {
      newOrder.orderMoney += ((item.orderProductNumber || 1) * item.orderProductPrice)
    });

    dispatch({
      type: 'order/updateNewOrder',
      payload: newOrder,
    });
  }

  render() {
    const {
      form,
      order: { newOrder },
      submitting,
      user: { userArray },
      dispatch,
    } = this.props;

    const {
      SearchShippingAddressModelVisible,
      shippingAddressArray,
      shippingAddress,
      chooseShippingAddressLoading,
    } = this.state;

    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;

    console.log("render this.props", this.props);

    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          console.log("values", {
            ...newOrder,
            shippingAddressId: values.shippingAddressId,
            payMethod: values.payMethod,
            userId: values.userId,
          });
          dispatch({
            type: 'order/createOrder',
            payload: {
              ...newOrder,
              shippingAddressId: values.shippingAddressId,
              payMethod: values.payMethod,
              userId: values.userId,
            },
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = fieldKey => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{orderMasterInfo[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };
    return (
      <PageHeaderLayout
        title="新建订单"
        content="在这里可以创建一个新的订单。"
        wrapperClassName={styles.advancedForm}
      >
        <SearchShippingAddressModel
          {
          ...{
            handleSetShippingAddress: this.handleSetShippingAddress,
            handleModalVisible: this.handleModalVisible,
            chooseShippingAddressLoading,
          }
          }
          modalVisible={SearchShippingAddressModelVisible}
          dataSource={shippingAddressArray}
        />
        <Card title="订单基础信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Form.Item label={orderMasterInfo.user}>
              {getFieldDecorator('userId', {
                rules: [{ required: true, message: '请输入' }],
              })(
                <Select placeholder="请选择">
                  {userArray.map(user => <Option key={user.id}>{user.userName}</Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item label={orderMasterInfo.shippingAddress}>
              {getFieldDecorator('shippingAddressId', {
                initialValue: shippingAddress ? shippingAddress.id : '',
                rules: [{ required: true, message: '请选择收货地址' }],
              })(
                <Input.Search
                  placeholder="点击右侧按钮选择收货地址"
                  onSearch={(value) => this.handleQueryShippinAddress(value)}
                />
              )}
            </Form.Item>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={orderMasterInfo.shippingAddressName}>
                  {getFieldDecorator('shippingAddressName', {
                    initialValue: shippingAddress ? shippingAddress.consignee : '',
                    rules: [{ required: true, message: '请选择收货地址' }],
                  })
                    (
                      <Input placeholder="选择收货地址后自动填写" readOnly />
                    )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={orderMasterInfo.shippingAddressTel}>
                  {getFieldDecorator('shippingAddressTel', {
                    initialValue: shippingAddress ? shippingAddress.tel : '',
                    rules: [{ required: true, message: '请选择收货地址' }],
                  })(
                    <Input placeholder="选择收货地址后自动填写" readOnly />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={orderMasterInfo.shippingAddressDesc}>
                  {getFieldDecorator('shippingAddressDesc', {
                    initialValue: shippingAddress ? `${shippingAddress.province}${shippingAddress.city}${shippingAddress.district}${shippingAddress.address}` : '',
                    rules: [{ required: true, message: '请选择收货地址' }],
                  })(
                    <Input placeholder="选择收货地址后自动填写" readOnly />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="订单商品" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: newOrder.orderDetailList,
          })(<TableForm onChange={(e) => { this.handleOrderDetailChange(e) }} />)}
        </Card>
        <FooterToolbar>
          <span>订单总价：</span>
          <Icon type="money-collect" theme="twoTone" twoToneColor="#e06c75" />
          <span>{newOrder.orderMoney || ''}</span>
          <Divider type="vertical" />
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
