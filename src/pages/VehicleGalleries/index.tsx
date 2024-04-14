
// import styles from './index.module.css'
// import classnames from 'classnames';
import { Button, Modal, Image, Form, Input, Upload, Popconfirm, message, Table, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import { useNavigate } from "react-router-dom";
import request from '../../utils/http'
import { useBoolean, useMount } from "ahooks";
import { useState, useCallback } from 'react'
import { debounce } from 'lodash'

function App() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [page, setPage] = useState({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })
  const [loading, { setTrue, setFalse }] = useBoolean(false);

  const [queryValue, setQueryValue] = useState('');

  function getList(query = '') {
    request({
      url: '/service/customer/show/page',
      data: {
        queryValue: query || queryValue,
        pageIndex: page.currentPage,
        pageSize: page.pageSize,
      }
    }).then((res: any) => {
      const data = (res.data || []).map((item: any) => {
        const showInfo = item.showInfo?.[0] || {};
        return {
          ...item,
          ...showInfo,
          key: showInfo.showId
        }
      })
      setData(data)
      setPage(res.pager)
    })
  }

  useMount(getList)

  const debouncedHandleChange = useCallback(debounce((value) => {
    getList(value)
  }, 200), [])

  const handleSearch = (value: string) => {
    setQueryValue(value)
    debouncedHandleChange(value)
  }

  const [model, setModel] = useState({
    isModalOpen: false,
    formData: {} as any
  })

  const setModelValue = (object: Object) => {
    setModel({
      ...model,
      ...object
    })
  }

  const handleCancel = () => {
    setModelValue({ isModalOpen: false })
  }

  const handleUploadChange = ({ fileList }: any) => {
    setModelValue({
      formData: {
        ...model.formData,
        image: fileList

      }
    })
  }

  const show = (data: any) => {
    const showId = model.formData?.showId;
    // return console.log(model.formData, data)
    setTrue()
    const pars = showId ? {
      url: `/service/customer/show/${showId}`,
      method: 'put'
    } : {
      url: '/service/customer/show',
      method: 'post'
    }
    request({
      ...pars,
      data: {
        productId: data.productId,
        categoryId: data.categoryId,
        showInfo: [
          {
            image: data.image,
            brandName: data.brandName,
            carModel: data.carModel,
          }
        ]
      }
    }).then(res => {
      getList()
      setModelValue({
        isModalOpen: false,
        formData: {}
      })
    }).finally(() => {
      setFalse()
    })
  }

  const handleOk = () => {
    form.validateFields().then((values) => {
      const image = values.image?.[0]?.url || values.image.fileList?.[0]?.response?.data;
      const url = image.slice(image.indexOf('/img/'))
      show({
        ...values,
        image: url
      })
    }).catch((err) => {
      console.log(err)
    })
  }

  const handleAdd = () => {
    const d = {
      image: undefined,
      carModel: '',
      brandName: '',
      categoryId: '',
      productId: '',
    }
    form.setFieldsValue(d)

    setModelValue({ isModalOpen: true, formData: d })
  }

  const hanldeEdit = (data: any) => {
    const d = {
      ...data,
      image: [{
        uid: 1,
        name: 'image.png',
        status: 'done',
        url: process.env.REACT_APP_IMG_URL + data.image
      }]
    }
    form.setFieldsValue(d)
    setModelValue({
      isModalOpen: true,
      formData: d
    })
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([] as string[]);

  const handlePageChange = (value: number) => {
    setPage({
      ...page,
      currentPage: value
    })
    getList()
  }

  const remove = (data: string[]) => {
    request({
      url: `/service/customer/show/remove`,
      method: 'post',
      data
    }).then(() => {
      getList()
      message.success('删除成功');
      setSelectedRowKeys([])
    })
  }

  const columns = [
    {
      title: '图片',
      dataIndex: 'image',
      key: 'showId',
      render: (_: any, { image }: any) => (
        <Image
          width={100}
          src={process.env.REACT_APP_IMG_URL + image}
        />
      )
    },
    {
      title: '车型',
      dataIndex: 'carModel',
      key: 'carModel',
    }, {
      title: '车型品牌',
      dataIndex: 'brandName',
      key: 'brandName',
    }, {
      title: '轮毂分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
    }, {
      title: '轮毂型号',
      dataIndex: 'productId',
      key: 'productId',
    }, {
      title: '操作',
      render: (_: any, data: any) => (
        <>
          <Button
            type="primary"
            size='small'
            className='g-m-r-10'
            onClick={() => hanldeEdit(data)}
          >编辑</Button>
          <Popconfirm
            title="删除"
            description="删除后无法恢复，确定删除？"
            onConfirm={() => remove([data.showId])}
            okText="确定"
            cancelText="取消"
          >
            <Button danger size='small'>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ]



  const rowSelection = {
    selectedRowKeys,
    onChange: (_: React.Key[], selectedRows: any[]) => {
      const selectedRowKeys: string[] = selectedRows.map((i: any) => i.showId);
      setSelectedRowKeys(selectedRowKeys)
    },
  };

  return (
    <>
      <div className='g-ai-c'>
        <Button type='primary' onClick={handleAdd}>新增</Button>
        <Popconfirm
          title="删除"
          description={`确定删除选中的${selectedRowKeys.length}条数据？`}
          onConfirm={() => remove(selectedRowKeys)}
          okText="确定"
          cancelText="取消"
        >
          <Button
            type="default"
            className='g-m-l-10'
            danger
            disabled={!selectedRowKeys.length}
          >删除</Button>
        </Popconfirm>
        <Input
          value={queryValue}
          placeholder='搜索'
          className='g-m-l-20'
          style={{ width: 200 }}
          onChange={e => handleSearch(e.target.value)}
          allowClear
        ></Input>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        rowSelection={{ ...rowSelection }}
        pagination={false}
        className='g-m-t-30'
      ></Table>

      <div className='g-fd-rr g-p-t-20'>
        <Pagination
          current={page.currentPage}
          pageSize={page.pageSize}
          total={page.total}
          onChange={handlePageChange}
        />
      </div>


      <Modal
        title={model.formData?.showId ? '编辑' : "新增"}
        open={model.isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ loading }}
        destroyOnClose={true}
      >
        <Form
          autoComplete="off"
          layout="vertical"
          initialValues={model.formData}
          className="g-p-r"
          form={form}
        >
          <Form.Item
            label="图片"
            name="image"
            rules={[
              {
                validator: (_: any, value: any) => {
                  if (value?.[0]?.url || value?.fileList?.length) {
                    return Promise.resolve()
                  } else {
                    return Promise.reject(new Error('请上传'));
                  }
                }
              }
            ]}
          >
            <Upload
              action="/service/file/upload"
              listType="picture-card"
              maxCount={1}
              accept=".jpg, .jpeg, .png"
              fileList={model.formData?.image || []}
              onChange={e => handleUploadChange(e)}
            >
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="车型"
            name="carModel"
            rules={[{ required: true, message: '请填写' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="车型品牌（BMV/Ferrari等）"
            name="brandName"
            rules={[{ required: true, message: '请填写' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="轮毂分类"
            name="categoryId"
            rules={[{ required: true, message: '请填写' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="轮毂型号"
            name="productId"
            rules={[{ required: true, message: '请填写' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default App;