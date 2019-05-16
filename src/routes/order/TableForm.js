import React, { PureComponent, Fragment } from 'react';
import {
  Table,
  Button,
  Input,
  message,
  Popconfirm,
  InputNumber,
  Divider,
} from 'antd';
import styles from './style.less';

export default class TableForm extends PureComponent {
  index = 0;

  constructor(props) {
    super(props);

    console.log("tttbale props", this.props);

    this.state = {
      data: props.value,
      loading: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }


  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };


  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.map(item => ({ ...item }));
    const target = (newData || data).filter(item => item.key === key)[0];;

    if (target) {
      target[fieldName] = e;
      this.setState({ data: newData });
      onChange(newData);
    }
  }


  render() {
    const { loading, data } = this.state;
    console.log("data", data);

    const columns = [
      {
        title: '产品名称',
        dataIndex: 'name',
        fixed: 'left',
        width: 100,
        key: 'id',
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
        dataIndex: 'describe',
      },
      {
        title: '产品包装规格',
        dataIndex: 'specification',
      },
      {
        title: '单价',
        dataIndex: 'orderProductPrice',
      },
      {
        title: '购买数量',
        dataIndex: 'orderProductNumber',
        render: (record) => {
          return (
            <InputNumber
              defaultValue={record}
              min={1}
              precision={0}
              onChange={e => this.handleFieldChange(e, 'orderProductNumber', record.key)}
            />
          );
        },
      },
    ];

    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增商品
        </Button>
      </Fragment>
    );
  }
}
