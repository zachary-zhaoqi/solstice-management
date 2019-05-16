import React, { PureComponent } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Row, Col, Form, Card, Select, List, Divider, Button, Slider } from 'antd';

import TagSelect from 'components/TagSelect';
import AvatarList from 'components/AvatarList';
import Ellipsis from 'components/Ellipsis';
import StandardFormRow from 'components/StandardFormRow';
import { routerRedux } from 'dva/router';
import styles from './Projects.less';

const { Option } = Select;
const FormItem = Form.Item;

/* eslint react/no-array-index-key: 0 */
@Form.create()
@connect(({ product, dictionary, loading }) => ({
  product,
  categoryArray: dictionary.categoryArray,
  loading: loading.models.list,
}))
export default class CoverCardList extends PureComponent {

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dictionary/getDataDictionary',
      payload: { key: 'category' },
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'product/queryProduct',
      payload: {},
    });
  }

  handleFormSubmit = () => {
    const { form, dispatch } = this.props;
    // setTimeout 用于保证获取表单值是在所有表单字段更新完毕的时候
    setTimeout(() => {
      form.validateFields(err => {
        if (!err) {
          // eslint-disable-next-line
          // dispatch({
          //   type: 'list/fetch',
          //   payload: {
          //     count: 8,
          //   },
          // });
        }
      });
    }, 0);
  };

  newOrder = (id) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/order/add',
      params: id,
    }));
  };

  render() {
    const {
      product: { data },
      categoryArray,
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    console.log(this.props);


    const cardList = data.list ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
        dataSource={data.list}
        renderItem={item => (
          <List.Item>
            <Card
              className={styles.card}
              hoverable
              cover={<img alt={item.name} src={item.picture} height={154} />}
            >
              <Card.Meta
                title={<a>{item.name}</a>}
                description={<Ellipsis lines={2}>{item.describe}</Ellipsis>}
              />
              <Button onClick={() => this.newOrder(item.id)}>购买</Button>
              <div className={styles.cardItemContent}>
                <span>{item.categoryName}</span>
                <Divider type="vertical" />
                <span>{item.brandName}</span>
                <div className={styles.avatarList}>
                  {/* <AvatarList size="mini">
                    {item.members.map((member, i) => (
                      <AvatarList.Item
                        key={`${item.id}-avatar-${i}`}
                        src={member.avatar}
                        tips={member.name}
                      />
                    ))}
                  </AvatarList> */}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    ) : null;

    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };



    return (
      <div className={styles.coverCardList}>
        <Card bordered={false}>
          <Form layout="inline">
            <StandardFormRow title="所属类目" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('categorySn')(
                  <TagSelect onChange={this.handleFormSubmit} expandable>
                    {categoryArray.map(item => <TagSelect.Option value={item.id}>{item.labelZhCn}</TagSelect.Option>)}
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="其它选项" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="品牌">
                    {getFieldDecorator('author', {})(
                      <Select
                        onChange={this.handleFormSubmit}
                        placeholder="不限"
                        style={{ maxWidth: 200, width: '100%' }}
                      >
                        <Option value="lisa">王昭君</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="售价">
                    {getFieldDecorator('rate', {})(
                      <Slider
                        range
                        step={0.1}
                        max={10000}
                        defaultValue={[20, 50]}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <div className={styles.cardList}>{cardList}</div>
      </div>
    );
  }
}
