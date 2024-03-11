import { useEffect, useCallback, useState } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import request from '../../utils/http'
import { Form, Input, Button, TreeSelect, Upload, Divider, message } from 'antd'
import { useMount } from "ahooks";
import { useNavigate } from "react-router-dom";

function Page() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const { categoryId, productId } = useParams();

  useMount(() => {
    request({
      url: '/category/list'
    }).then(res => {
      setTreeData(res.data)
    })
  })

  // 编辑商品的商品详情
  const [formData, setFormData] = useState({ placeOfOrigin: 'Zhejiang,China (Mainland)' } as any)


  const getProduct = useCallback(() => {
    request({
      url: '/product',
      method: 'get',
      data: {
        productId
      }
    }).then((res: any) => {
      const data = res.data?.[0] || {};
      const imgList = data.imgList || {};
      const bigPic = (imgList.bigPic || []).map((url: string, index: number) => ({
        uid: index,
        name: 'image.png',
        status: 'done',
        url: process.env.REACT_APP_IMG_URL + url
      }))
      const productPhotos = (imgList.productPhotos || []).map((url: string, index: number) => ({
        uid: index,
        name: 'image.png',
        status: 'done',
        url: process.env.REACT_APP_IMG_URL + url
      }))
      const paymentAndShippingTerms = data.productDescription?.paymentAndShippingTerms || {};
      const supplyCapacity = data.productDescription?.supplyCapacity || {};
      const d = {
        ...data,
        categoryId: data.category.categoryId,
        bigPic,
        productPhotos,
        ...paymentAndShippingTerms,
        ...supplyCapacity,
      }
      setFormData(d)
      form.setFieldsValue(d);
    })
  }, [productId, form])

  // 获取商品详情
  useEffect(() => {
    if (categoryId && productId) {
      getProduct()
    }
  }, [categoryId, productId, getProduct])

  // 新增商品 http
  const createProduct = ({ categoryId, ...others }: any) => {
    request({
      url: '/product',
      method: 'post',
      data: {
        ...others,
        category: { categoryId }
      }
    }).then(() => {
      message.success('新增成功')
      navigate('/product')
    })
  }

  // 修改商品
  const updateProduct = (data: any) => {
    request({
      url: `/product/${productId}`,
      method: 'put',
      data
    }).then(() => {
      message.success('修改成功')
      navigate('/product')
    })
  }

  const getImageList = (data: any) => {
    const list = data.fileList || data;
    return list.map((item: any) => {
      const url = item.url || item.response.data || '';
      const reg = new RegExp(process.env.REACT_APP_IMG_URL as string, 'g')
      return url.replace(reg, '')
    })
  }

  const onFinish = (values: any) => {
    const {
      bigPic, productPhotos, categoryId, category,
      unitPrice, tradeTerm, paymentTerms, minOrder, meansOfTransport,
      productionCapacity, packing, deliveryDate,
      ...others
    } = values;

    const data = {
      ...others,
      productDescription: {
        paymentAndShippingTerms: {
          unitPrice, tradeTerm, paymentTerms, minOrder, meansOfTransport,
        },
        supplyCapacity: {
          productionCapacity, packing, deliveryDate,
        },
      },
      categoryId,
      imgList: {
        bigPic: getImageList(bigPic),
        productPhotos: getImageList(productPhotos),
      }
    }
    console.log(data)
    if (categoryId && productId) {
      updateProduct(data)
    } else {
      createProduct(data)
    }
  }

  const handleUploadChange = ({ fileList }: any, key: string) => {
    setFormData({
      ...formData,
      [key]: fileList
    })
  }

  // console.log('formData', formData)

  return (
    <Form
      autoComplete="off"
      layout="vertical"
      onFinish={onFinish}
      initialValues={formData}
      form={form}
    >
      <Form.Item
        label="分类"
        name="categoryId"
        rules={[{ required: true, message: '请填写' }]}
      >
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          treeData={treeData}
          fieldNames={{ label: 'name', value: 'categoryId', children: 'children' }}
        />
      </Form.Item>
      <Form.Item
        label="商品名称"
        name="title"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="商品主图"
        name="bigPic"
        rules={[{ required: true, message: '请上传' }]}
      >
        <Upload
          action="/file/upload"
          listType="picture-card"
          fileList={formData.bigPic}
          // onPreview={handlePreview}
          onChange={e => handleUploadChange(e, 'bigPic')}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>
      <Form.Item
        label="Detailed Image"
        name="productPhotos"
        rules={[{ required: true, message: '请上传' }]}
      >
        <Upload
          action="/file/upload"
          listType="picture-card"
          fileList={formData.productPhotos}
          onChange={e => handleUploadChange(e, 'productPhotos')}
        >
          <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>

      <Divider />

      <Form.Item
        label="Model"
        name="model"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Place of Origin"
        name="placeOfOrigin"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Diameter"
        name="diameter"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Drive Wheel"
        name="driveWheel"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Material"
        name="material"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Finishing"
        name="finishing"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Brand Name"
        name="brandName"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Width"
        name="width"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Car Make"
        name="carMake"
        rules={[{ required: true, message: '请填写' }]}
      >
        <Input />
      </Form.Item>

      <Divider orientation="left">Payment & Shipping Terms</Divider>
      <Form.Item label="Unit Price" name="unitPrice">
        <Input />
      </Form.Item>
      <Form.Item label="Trade Term" name="tradeTerm">
        <Input />
      </Form.Item>
      <Form.Item label="Payment Terms" name="paymentTerms">
        <Input />
      </Form.Item>
      <Form.Item label="Min. Order" name="minOrder">
        <Input />
      </Form.Item>
      <Form.Item label="Means of Transport" name="meansOfTransport">
        <Input />
      </Form.Item>

      <Divider orientation="left">Supply Capacity</Divider>
      <Form.Item label="Production Capacity" name="productionCapacity">
        <Input />
      </Form.Item>
      <Form.Item label="Packing" name="packing">
        <Input />
      </Form.Item>
      <Form.Item label="Delivery Date" name="deliveryDate">
        <Input />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          新增商品
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Page