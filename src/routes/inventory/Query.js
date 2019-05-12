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
  Icon,
  Button,
  message,
  DatePicker,
} from 'antd';
import { routerRedux } from 'dva/router';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

@connect(({
  inventory, brand, dictionary, loading }) => ({
    inventory,
    categoryArray: dictionary.categoryArray,
    shelfLifeArray: dictionary.shelfLifeArray,
    productStatusArray: dictionary.productStatusArray,
    specificationArray: dictionary.specificationArray,
    brandArray: brand.brandArray,
    loading: loading.models.rule,
  }))
@Form.create()
export default class TableList extends PureComponent {
  state = {
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
      payload: { key: 'specification' },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;

    // dispatch({
    //   type: 'inventory/queryInventoryInfo',
    //   payload: {},
    // });


  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
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

  handleRemoveClick = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/removeProduct',
      payload: [record.id],
    });
  }

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

      console.log('inventory handleSearch values', values);

      dispatch({
        type: 'product/queryProduct',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const { form, specificationArray } = this.props;
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
            <FormItem label="产品包装规格">
              {getFieldDecorator('specification')(
                <Select placeholder="请选择">
                  {specificationArray.map(specification => <Option key={specification.value}>{specification.labelZhCn}</Option>)}
                </Select>
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
  }

  renderAdvancedForm() {
    const { form, categoryArray, brandArray, specificationArray } = this.props;
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
            <FormItem label="条形码号">
              {getFieldDecorator('barCode')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="产品包装规格">
              {getFieldDecorator('specification')(
                <Select placeholder="请选择">
                  {specificationArray.map(specification => <Option key={specification.value}>{specification.labelZhCn}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="品&emsp;&emsp;牌">
              {getFieldDecorator('brandId')(
                <Select placeholder="请选择品牌">
                  {brandArray.map(brand => <Option key={brand.id}>{brand.name}</Option>)}
                </Select>
              )}
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
            <FormItem label="创建日期">
              {getFieldDecorator('creatTimeRange')(
                <RangePicker />
              )}
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
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      inventory: { infoData },
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '库存批次号',
        fixed: 'left',
        dataIndex: 'batchSn',
      },
      {
        title: '产品名称',
        dataIndex: 'name',
        fixed: 'left',
        key: 'name',
      },
      {
        title: '商品条形码',
        dataIndex: 'barCode',
      },
      {
        title: '产品类别',
        dataIndex: 'categoryName',
      },
      {
        title: '品牌',
        dataIndex: 'brandName',
      },
      {
        title: '产品包装规格',
        dataIndex: 'specification',
      },
      {
        title: '库存数量',
        dataIndex: 'number',
      },
      {
        title: '创建时间',
        dataIndex: 'creatTime',
        sorter: true,
        render(val) {
          return val ? <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span> : {};
        },
      },
    ];


    return (
      <PageHeaderLayout title="库存查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>冻结</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={infoData}
              scroll={{ x: 3000, y: 300 }}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
