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
  Divider,
} from 'antd';
import { routerRedux } from 'dva/router';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Manage.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = {
  '上架': 'success',
  '缺货': 'error',
  '绝版': 'processing',
  '默认': 'default',
}

@connect(({
  product, brand, dictionary, rule, loading }) => ({
    rule,
    product,
    categoryArray: dictionary.categoryArray,
    shelfLifeArray: dictionary.shelfLifeArray,
    productStatusArray: dictionary.productStatusArray,
    specificationArray:dictionary.specificationArray,
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
      payload:{ key: 'category', tree: true },
    });

    dispatch({
      type: 'dictionary/getDataDictionary',
      payload:{key:'productStatus'},
    });

    dispatch({
      type: 'dictionary/getDataDictionary',
      payload:{key:'specification'},
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/queryProduct',
      payload: {},
    });
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
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      product: { data },
      productStatusArray,
      loading,
    } = this.props;
    const { selectedRows } = this.state;

    console.log("manage render props", this.props);
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 100,
        key: 'id',
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
        title: '商品描述',
        dataIndex: 'description',
      },
      {
        title: '商品图片',
        dataIndex: 'description',
      },
      {
        title: '平均成本',
        dataIndex: 'averageCost',
      },
      {
        title: '产品售价',
        dataIndex: 'price',
      },
      {
        title: '产品保固期',
        dataIndex: 'shelfLife',
      },
      {
        title: '状态',
        dataIndex: 'productStatus',
        width: 100,
        // filters: [
        //   {
        //     text:productStatusArray.length===0?"":productStatusArray[0].labelZhCn,
        //     value: 0,
        //   },
        //   {
        //     text:productStatusArray.length===0?"":productStatusArray[1].labelZhCn,
        //     value: 1,
        //   },
        //   {
        //     text:productStatusArray.length===0?"":productStatusArray[2].labelZhCn,
        //     value: 2,
        //   },
        // ],
        // onFilter: (value, record) => record.status.toString() === value,
        render(val) {

          return <Badge status={statusMap[val]} text={val} />;
        },
      },
      {
        title: '更新时间',
        dataIndex: 'modifyTime',
        sorter: true,
        render(val) {
          return val ? <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span> : {};
        },
      },
      {
        title: '操作',
        fixed: 'right',
        render: (record) => (
          <Fragment>
            <a href="">修改</a>
            <Divider type="vertical" />
            <Popconfirm title="你确定要删掉该商品吗?" onConfirm={() => this.handleRemoveClick(record)} okText="确认" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量上架</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="库存查询">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量下架</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              scroll={{ x: 1500, y: 300 }}
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
