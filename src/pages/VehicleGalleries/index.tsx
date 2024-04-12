
import styles from './index.module.css'
import classnames from 'classnames';
import { Button, Modal, Image, Form, Input, Upload, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import { useNavigate } from "react-router-dom";
import request from '../../utils/http'
import { useBoolean, useMount } from "ahooks";
import { useState } from 'react'

function App() {
  const [form] = Form.useForm();
  const [data, setData] = useState([])
  const [loading, { setTrue, setFalse }] = useBoolean(false)

  function getList() {
    request({
      url: '/service/customer/show'
    }).then(res => {
      const data = (res.data || []).map((item: any) => {
        const showInfo = item.showInfo?.[0] || {};
        return {
          ...item,
          ...showInfo,
        }
      })
      // data.reverse()
      setData(data)
      // console.log(data)
    })
  }

  useMount(getList)

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

  const onConfirm = (showId: string) => {
    request({
      url: `/service/customer/show/${showId}`,
      method: 'DELETE',
    }).then(() => {
      getList()
      message.success('删除成功')
    })
  }

  return (
    <>
      <Button type='primary' onClick={handleAdd}>新增</Button>
      <div className={classnames(styles.wrapper, 'g-p-t-40')}>
        {
          data.map((item: any, index) => (
            <dl key={index} className='g-p-r'>
              <dt>
                <Image
                  width={'100%'}
                  src={process.env.REACT_APP_IMG_URL + item.image}
                />
              </dt>
              <dd className='g-p-t-18 g-p-lr-10 g-p-b-6 g-fs-20 g-fw-b g-e-1 g-ta-c'>{item.carModel}</dd>
              {/* <dd>{item.showId}</dd> */}
              <dd className='g-ta-c g-p-lr-10 g-fs-12 g-e-1' style={{ color: '#999' }}>{item.categoryId}</dd>
              <dd className='g-ta-c g-p-lr-10 g-fs-14 g-e-1 g-lh-30 g-p-b-30'>{item.productId}</dd>
              <dd className={classnames('g-p-a', styles.buttons)}>
                <Button
                  type="primary"
                  size='small'
                  className='g-m-r-10'
                  onClick={() => hanldeEdit(item)}
                >编辑</Button>
                <Popconfirm
                  title="删除"
                  description="删除后无法恢复，确定删除？"
                  onConfirm={() => onConfirm(item.showId)}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button danger size='small'>删除</Button>
                </Popconfirm>
              </dd>
            </dl>
          ))
        }
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
            label="车型品牌（BMV/Ferrari等，不展示，用于筛选）"
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