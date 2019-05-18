import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  TreeSelect,
  Radio,
  Icon,
  Button,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Badge,
  Modal,
  Divider,
} from 'antd';
import { routerRedux } from 'dva/router';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => {
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
}

const CreatePayForm = Form.create()(props => {
  const { form, payModalVisible, handlePayModalOk, handlePayModalCancel, payMethodArray } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handlePayModalOk(fieldsValue);
    });
  };
  return (
    <Modal
      title="Basic Modal"
      visible={payModalVisible}
      onOk={okHandle}
      onCancel={handlePayModalCancel}
    >
      <Form.Item label="支付方式">
        {form.getFieldDecorator('payMethod', {
          rules: [{ required: true, message: '选择支付方式' }],
        })(
          <Select style={{ width: '100%' }} placeholder="请选择">
            {payMethodArray.map(payMethod => <Option key={payMethod.value}>{payMethod.labelZhCn}</Option>)}
          </Select>
        )}
      </Form.Item>
    </Modal>
  );
});

const CreateShipForm = Form.create()(props => {
  const { form, shipModalVisible, handleShipModalOk, handleShipModalCancel } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleShipModalOk(fieldsValue);
    });
  };
  return (
    <Modal
      title="请输入发货信息"
      visible={shipModalVisible}
      onOk={okHandle}
      onCancel={handleShipModalCancel}
    >
      <Form.Item label="快递公司名称">
        {form.getFieldDecorator('shippingCompanyName')(<Input />)}
      </Form.Item>
      <Form.Item label="快递单号">
        {form.getFieldDecorator('shippingSn')(<Input />)}
      </Form.Item>
    </Modal>
  );
});

@connect(({
  product, brand, order, dictionary, rule, loading }) => ({
    rule,
    product,
    order,
    categoryArray: dictionary.categoryArray,
    payMethodArray: dictionary.payMethodArray,
    productStatusArray: dictionary.productStatusArray,
    brandArray: brand.brandArray,
    loading: loading.models.rule,
  }))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    payModalVisible: false,
    shipModalVisible: false,
    recordOrder: undefined,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'brand/getTotalBrand',
    });

    dispatch({
      type: 'dictionary/getDataDictionary',
      payload: { key: 'category', tree: true },
    });

    dispatch({
      type: 'dictionary/getDataDictionary',
      payload: { key: 'productStatus' },
    });

    dispatch({
      type: 'dictionary/getDataDictionary',
      payload: { key: 'payMethod' },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'order/queryOrder',
      payload: {},
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.pqueryOrderrops;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'product/queryProduct',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'product/queryProduct',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handlePayModalOk = (values) => {
    const { recordOrder } = this.state;
    const { dispatch } = this.props;

    recordOrder.payMethod = values.payMethod;
    recordOrder.payTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    recordOrder.orderStatus = '待收货';
    const orderList = [recordOrder];
    dispatch({
      type: 'order/modifyOrderMaster',
      payload: orderList,
    });
    this.handlePayModalCancel();
  }

  handlePayModalCancel = () => {
    this.setState({
      recordOrder: undefined,
      payModalVisible: false,
    });
  }

  handleShipModalOk = (values) => {
    const { recordOrder } = this.state;
    const { dispatch } = this.props;

    recordOrder.shippingCompanyName = values.shippingCompanyName;
    recordOrder.shippingSn = values.shippingSn;
    recordOrder.shipmentsTime = moment().format('YYYY-MM-DDTHH:mm:ss');

    recordOrder.orderStatus = '待收货';
    const orderList = [recordOrder];
    dispatch({
      type: 'order/modifyOrderMaster',
      payload: orderList,
    });
    this.handleShipModalCancel();
  }

  handleShipModalCancel = () => {
    this.setState({
      recordOrder: undefined,
      shipModalVisible: false,
    });
  }

  handlePayClick = (record) => {
    this.setState({
      recordOrder: record,
      payModalVisible: true,
    });
    console.log("record", record);

  }

  handleShipClick = (record) => {
    this.setState({
      recordOrder: record,
      shipModalVisible: true,
    });
  }

  handleSignForClick = (record) => {
    const { dispatch } = this.props;

    const orderList = [record];
    orderList[0].shipmentsTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    orderList[0].orderStatus = '已完成';
    dispatch({
      type: 'order/modifyOrderMaster',
      payload: orderList,
    });
  }

  handleReturnClick = (record) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'product/removeProduct',
    //   payload: [record.id],
    // });
  }

  handleMenuClick = e => {
    const { dispatch, form } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove': {
        const idList = selectedRows.map(row => row.id);
        dispatch({
          type: 'product/removeProduct',
          payload: idList,
          callback: (response) => {
            this.setState({
              selectedRows: [],
            });
            if (response.success) {
              message.success(response.message);
            } else {
              message.error(response.message);
            }
            form.validateFields((err, fieldsValue) => {
              if (err) return;

              const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
              };

              this.setState({
                formValues: values,
              });

              dispatch({
                type: 'product/queryProduct',
                payload: values,
              });
            });
          },
        });
        // .then((res)=>{
        //   console.log("handleMenuClick remove res",res)
        //   if (res) {
        //     message.success('修改成功')
        //   } else {
        //     message.error('修改失败')
        //   }
        // });
        break;
      }
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'order/queryOrder',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { form, categoryArray } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品类别">
              {getFieldDecorator('categorySn')(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={categoryArray}
                  placeholder="请选择"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  renderAdvancedForm() {
    const { form, categoryArray, brandArray, productStatusArray } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="产品名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品类别">
              {getFieldDecorator('categorySn')(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={categoryArray}
                  placeholder="请选择"
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="品牌">
              {getFieldDecorator('brandId')(
                <Select placeholder="请选择品牌">
                  {brandArray.map(brand => <Option key={brand.id}>{brand.name}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="产品状态">
              <div>
                {getFieldDecorator('productStatus')(
                  <Radio.Group>
                    {productStatusArray.map(productStatus => <Radio value={productStatus.value}>{productStatus.labelZhCn}</Radio>)}
                  </Radio.Group>
                )}
              </div>
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  };

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  };

  render() {
    const {
      order: { data },
      payMethodArray,
      loading,
    } = this.props;
    const {
      selectedRows,
      payModalVisible,
      shipModalVisible,
    } = this.state;

    console.log("manage render props", this.props);
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'orderSn',
        key: 'orderSn',
      },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
      },
      {
        title: '订单所属用户',
        dataIndex: 'userLogin.userAccount',
      },
      {
        title: '收货人',
        dataIndex: 'shippingAddress.consignee',
      },
      {
        title: '快递单号',
        dataIndex: 'shippingSn',
      },
      {
        title: '订单金额',
        dataIndex: 'orderMoney',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        render(val) {
          return val ? <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span> : {};
        },
      },
      {
        title: '操作',
        render: (record) => {
          return (
            <Fragment>
              {record.orderStatus === '待支付' ? <a onClick={() => this.handlePayClick(record)}>支付</a> : null}
              {record.orderStatus === "待发货" ? <a onClick={() => this.handleShipClick(record)}>发货</a> : null}
              {record.orderStatus === '待收货' ?
                (
                  <Popconfirm title="你确定吗?" onConfirm={() => this.handleSignForClick(record)} okText="确认" cancelText="取消">
                    <a>签收</a>
                  </Popconfirm>
                ) : null}
            </Fragment>
          )
        },
      },
    ];

    return (
      <PageHeaderLayout title="订单管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => {
                  const { dispatch } = this.props;
                  dispatch(
                    routerRedux.push({ pathname: '/order/add' })
                  );
                }}
              >
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreatePayForm
          payModalVisible={payModalVisible}
          handlePayModalOk={this.handlePayModalOk}
          handlePayModalCancel={this.handlePayModalCancel}
          payMethodArray={payMethodArray}
        />
        <CreateShipForm
          shipModalVisible={shipModalVisible}
          handleShipModalOk={this.handleShipModalOk}
          handleShipModalCancel={this.handleShipModalCancel}
        />
      </PageHeaderLayout>
    );
  };
};
