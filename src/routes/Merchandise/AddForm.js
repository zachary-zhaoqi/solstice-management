import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  TreeSelect,
  Row,
  Col,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

@connect(({ brand, category, loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  categoryTreeData: category.categoryTreeData,
  brandArray: brand.brandArray,
}))
@Form.create()
export default class BasicForms extends PureComponent {

  componentDidMount() {
    console.log('addForm-componentDidMount this.props -before', this.props);
    const { dispatch } = this.props;

    dispatch({
      type: 'brand/getTotalBrand',
    });

    dispatch({
      type: 'category/getCategoryTree',
    });

    console.log('addForm-componentDidMount this.props -later', this.props);

  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { submitting, form, categoryTreeData, brandArray } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

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
        content="请填写一下商品属性，以添加新的商品。（带*为必填项目）"
      >
        <Card bordered={false}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="产品分类">
                  {getFieldDecorator('categoryNo')(
                    <TreeSelect
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={categoryTreeData}
                      placeholder="请选择类别"
                      onChange={this.onChange}
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="商品名称">
                  {getFieldDecorator('brandName', {
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
                <FormItem {...formItemLayout} label="品牌">
                  {getFieldDecorator('brand_id')(
                    <Select
                      style={{ width: 120 }}
                      placeholder="请选择品牌"
                    >
                      {brandArray.map(brand => <Option key={brand.id}>{brand.name}</Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="包装规格">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商品名称',
                      },
                    ],
                  })(
                    <Select defaultValue="lucy" style={{ width: 120 }}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col lg={8} md={12} sm={24}>
                <FormItem {...formItemLayout} label="上架状态">
                  {getFieldDecorator('publicUsers')(
                    <Select defaultValue="lucy" style={{ width: 120 }}>
                      <Option value="jack">Jack</Option>
                      <Option value="lucy">Lucy</Option>
                      <Option value="disabled" disabled>Disabled</Option>
                      <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="商品图片">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商品名称',
                      },
                    ],
                  })(<Input placeholder="改用Upload" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={24} sm={24}>
                <FormItem {...formItemLayout} label="商品描述">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入商品描述',
                      },
                    ],
                  })(<TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入该商品的详细描述"
                    rows={4}
                  />)}
                </FormItem>
              </Col>
            </Row>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
