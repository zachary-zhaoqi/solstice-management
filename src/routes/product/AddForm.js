import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Radio,
  Button,
  Card,
  TreeSelect,
  Tooltip,
  Icon,
  Row,
  Col,
} from 'antd';
import { routerRedux } from 'dva/router';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ brand, dictionary, loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  categoryTreeData: dictionary.categoryTreeData,
  brandArray: brand.brandArray,
  shelfLifeArray: dictionary.shelfLifeArray,
  productStatusArray: dictionary.productStatusArray,
}))
@Form.create()
export default class BasicForms extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'brand/getTotalBrand',
    });

    dispatch({
      type: 'dictionary/getCategoryTree',
    });

    dispatch({
      type: 'dictionary/getShelfLifeArray',
    });

    dispatch({
      type: 'dictionary/getProductStatusArray',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'product/saveProduct',
          payload: values,
        });
        dispatch(routerRedux.push({ pathname: '/product/manage' }))
      }
    });
  };

  render() {
    const { submitting, form, categoryTreeData, brandArray, shelfLifeArray, productStatusArray } = this.props;
    const { getFieldDecorator } = form;
    console.log("addForm render props", this.props);
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
    return (
      <PageHeaderLayout
        title="新增商品"
        content="请填写一下商品属性，以添加新的商品。"
      >
        <Card bordered={false}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="产品分类">
                  {getFieldDecorator('categorySn', {
                    rules: [
                      {
                        required: true,
                        message: '请选择产品分类',
                      },
                    ],
                  })(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={categoryTreeData}
                      placeholder="请选择类别"
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="商品名称">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商品名称',
                      },
                    ],
                  })(<Input placeholder="请输入商品名称" />)}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>品牌
                      <em className={styles.optional}>（选填）</em>
                    </span>
                  }
                >
                  {getFieldDecorator('brandId')(
                    <Select
                      placeholder="请选择品牌"
                    >
                      {brandArray.map(brand => <Option key={brand.id}>{brand.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      平均成本
                      <em className={styles.optional}>
                        &nbsp;
                        <Tooltip title="其实也就是成本价，这么说听起来比较严谨">
                          <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                        </Tooltip>
                      </em>
                    </span>
                  }
                >
                  {getFieldDecorator('averageCost', {
                    rules: [
                      {
                        required: true,
                        message: '请输入产品平均成本',
                      },
                    ],
                  })(
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      precision={2}
                      style={{ width: 'auto' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      零售价格
                      <em className={styles.optional}>
                        &nbsp;
                        <Tooltip title="都是价格，跟前面一样加个提示，一视同仁。">
                          <Icon type="info-circle-o" style={{ marginRight: 4 }} />
                        </Tooltip>
                      </em>
                    </span>
                  }
                >
                  {getFieldDecorator('price', {
                    rules: [
                      {
                        required: true,
                        message: '请输入产品零售价格',
                      },
                    ],
                  })(
                    <InputNumber
                      formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                      precision={2}
                      style={{ width: 'auto' }}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="保固期限">
                  {getFieldDecorator('shelfLife')(
                    <Select placeholder="请选择品牌">
                      {shelfLifeArray.map(shelfLife => <Option key={shelfLife.value}>{shelfLife.labelZhCn}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <FormItem {...formItemLayout} label="商品描述">
              {getFieldDecorator('describe')(
                <TextArea
                  style={{ minHeight: 32 }}
                  placeholder="请输入该商品的详细描述"
                  rows={4}
                />)}
            </FormItem>
            <FormItem {...formItemLayout} label="产品状态" help="单纯就是秀一下这里可以放注解">
              <div>
                {getFieldDecorator('productStatus', {
                  initialValue: productStatusArray[0] === undefined ? undefined : productStatusArray[0].value,
                })(
                  <Radio.Group>
                    {productStatusArray.map(productStatus => <Radio value={productStatus.value}>{productStatus.labelZhCn}</Radio>)}
                  </Radio.Group>
                )}
              </div>
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={() => { form.resetFields(); }}>重置</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
