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

const tableData = [
  {
    key: '1',
    workId: '00001',
    name: 'John Brown',
    department: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    workId: '00002',
    name: 'Jim Green',
    department: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    workId: '00003',
    name: 'Joe Black',
    department: 'Sidney No. 1 Lake Park',
  },
];

const SearchShippingAddressModel = Form.create()(props => {
  const { modalVisible, handleSetShippingAddress, handleModalVisible, dataSource,chooseShippingAddressLoading } = props;

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

@connect(({ user, dictionary, global, loading }) => ({
  user,
  dictionary,
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
export default class AdvancedForm extends PureComponent {
  state = {
    SearchShippingAddressModelVisible: false,
    shippingAddress:undefined,
    shippingAddressArray: [],
    chooseShippingAddressLoading:true,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/queryUserArray',
      payload: {},
    });
  }

  handleSetShippingAddress = (selectedRowKeys, selectedRows) => {
    // const{form}=this.props;
    this.setState({
      shippingAddress:selectedRows[0],
      SearchShippingAddressModelVisible: false,
      chooseShippingAddressLoading:true,
    });
    // form.setFieldsValue('shippingAddressName',selectedRows[0].consifnee)
    // form.setFieldsValue('shippingAddressTel',selectedRows[0].tel)
    // form.setFieldsValue('shippingAddressDesc',`${selectedRows[0].province}${selectedRows[0].city}${selectedRows[0].district}${selectedRows[0].address}`)
   
  }

  handleModalVisible = flag => {
    this.setState({
      chooseShippingAddressLoading:true,
      SearchShippingAddressModelVisible: !!flag,
    });
  }

  handleQueryShippinAddress = (value) => {
    queryShippingAddress({ 'id': value }).then((res) => {
      this.setState({
        shippingAddressArray:res.data,
        SearchShippingAddressModelVisible: true,
        chooseShippingAddressLoading:false,
      });
    })
    this.handleModalVisible(true);
  }

  render() {
    const {
      form,
      dispatch,
      submitting,
      user: { userArray },
      dictionary: {
        payMethodArray,
      },
    } = this.props;

    const {
      SearchShippingAddressModelVisible,
      shippingAddressArray,
      shippingAddress,
      chooseShippingAddressLoading,
    } = this.state;

    console.log("=========-------------", this.props);

    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          // submit the values
          dispatch({
            type: 'form/submitAdvancedForm',
            payload: values,
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
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={orderMasterInfo.user}>
                  {getFieldDecorator('userId', {
                    rules: [{ required: true, message: '请输入' }],
                  })(
                    <Select placeholder="请选择">
                      {userArray.map(user => <Option key={user.id}>{user.userName}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label={orderMasterInfo.payMethod}>
                  {getFieldDecorator('payMethod', {
                    rules: [{ required: true, message: '请选择' }],
                  })(
                    <Select placeholder="请选择">
                      {payMethodArray.map(payMethod => <Option key={payMethod.value}>{payMethod.labelZhCn}</Option>)}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={orderMasterInfo.shippingAddress}>
                  {getFieldDecorator('shippingAddressID', {
                    initialValue:shippingAddress?shippingAddress.id:'',
                    rules: [{ required: true, message: '请选择收货地址' }],
                  })(
                    <Input.Search
                      placeholder="点击右侧按钮选择收货地址"
                      onSearch={(value) => this.handleQueryShippinAddress(value)}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label={orderMasterInfo.shippingAddressName}>
                  {getFieldDecorator('shippingAddressName', {
                    initialValue:shippingAddress?shippingAddress.consignee:'',
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
                    initialValue:shippingAddress?shippingAddress.tel:'',
                    rules: [{ required: true, message: '请选择收货地址' }],
                  })(
                    <Input placeholder="选择收货地址后自动填写" readOnly />
                  )}
                </Form.Item>
              </Col>
              <Col xl={{ span: 8, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Form.Item label={orderMasterInfo.shippingAddressDesc}>
                  {getFieldDecorator('shippingAddressDesc', {
                    initialValue:shippingAddress?`${shippingAddress.province}${shippingAddress.city}${shippingAddress.district}${shippingAddress.address}`:'',
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
            initialValue: tableData,
          })(<TableForm />)}
        </Card>
        <FooterToolbar>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
