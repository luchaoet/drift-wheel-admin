import { useEffect, useCallback, useState, useMemo } from "react";
import { PlusOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import request from '../../utils/http'
import { Form, Input, Button, TreeSelect, Upload, Divider, message, Modal, Timeline } from 'antd'
import { useMount, useBoolean } from "ahooks";
import { useNavigate } from "react-router-dom";
import styles from './index.module.css'
import Image from './Image'
import moment from 'moment';
import classnames from 'classnames';

function Page() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [treeData, setTreeData] = useState([]);
  const { categoryId, productId } = useParams();
  const [loading, { setTrue, setFalse }] = useBoolean(false);

  useMount(() => {
    request({
      url: '/service/category/list'
    }).then(res => {
      setTreeData(res.data)
    })
  })

  // 编辑商品的商品详情
  const [formData, setFormData] = useState({ placeOfOrigin: 'Zhejiang,China (Mainland)' } as any)


  const getProduct = useCallback(() => {
    request({
      url: '/service/product',
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
        url: (process.env.REACT_APP_IMG_URL || 'http://www.drift-wheel.com:8081') + url
      }))
      const productPhotos = (imgList.productPhotos || []).map((url: string, index: number) => ({
        uid: index,
        name: 'image.png',
        status: 'done',
        url: (process.env.REACT_APP_IMG_URL || 'http://www.drift-wheel.com:8081') + url
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
    setTrue()
    request({
      url: '/service/product',
      method: 'post',
      data: {
        ...others,
        category: { categoryId }
      }
    }).then(() => {
      message.success('新增成功')
      navigate('/product')
    }).finally(() => {
      setFalse()
    })
  }

  // 修改商品
  const updateProduct = (data: any) => {
    setTrue()
    request({
      url: `/service/product/${productId}`,
      method: 'put',
      data
    }).then(() => {
      message.success('修改成功')
      navigate('/product')
    }).finally(() => {
      setFalse()
    })
  }

  const getImageList = (data: any) => {
    const list = data.fileList || data;
    return list.map((item: any) => {
      let url: string = item.url || item.response.data || '';
      const index = url.indexOf('/img/');
      if (index >= 0) {
        url = url.slice(index)
      }
      return url
    })
  }

  const onFinishFailed = (a: any) => {
    message.warning('存在必填信息未处理')
  }

  const onFinish = (values: any) => {
    const {
      categoryId, category,
      unitPrice, tradeTerm, paymentTerms, minOrder, meansOfTransport,
      productionCapacity, packing, deliveryDate,
      ...others
    } = values;
    const { bigPic, productPhotos } = formData;

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

  const beforeUpload = (file: any) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片限制小于5M!');
    }

    return isLt5M ? true : Upload.LIST_IGNORE;
  }

  const [listImages, setListImages] = useState([] as any[]);

  const imageList = useMemo(() => {
    const formImg = [...(formData.bigPic || []), ...(formData.productPhotos || [])];
    const temp = {} as Record<string, Object[]>;
    for (const l of listImages) {
      const modifiedTime = l.modifiedTime;
      const d = {
        ...l,
        isUsed: l.isUsed || !!formImg.find((i: any) => i.url === l.url)
      }
      if (temp[modifiedTime]) {
        temp[modifiedTime].push(d)
      } else {
        temp[modifiedTime] = new Array(d)
      }
    }
    const data = []
    for (const key of Object.keys(temp)) {
      data.push({
        time: key,
        data: temp[key],
      })
    }
    return data
  }, [
    listImages,
    formData.bigPic,
    formData.productPhotos
  ])

  function getList() {
    request({
      url: '/service/file/listImages'
    }).then(res => {
      const d = (res.data || []).map((i: any) => ({
        ...i,
        modifiedTime: moment(i.modifiedTime).format('YYYY-MM-DD'),
        _modifiedTime: new Date(i.modifiedTime).getTime(),
        url: process.env.REACT_APP_IMG_URL + i.url
      })).sort((a: any, b: any) => b._modifiedTime - a._modifiedTime)

      setListImages(d)
    })
  }

  useMount(getList)

  const [model, setModelValue] = useState({
    isModalOpen: false,
    images: [],
    key: '',
  })

  const setModel = (object: any) => {
    setModelValue({
      ...model,
      ...object
    })
  }

  const handleOk = () => {
    const { key, images } = model;
    setFormData({
      ...formData,
      [key]: [
        ...formData[key],
        ...images
      ]
    })
    handleCancel()
  }

  function handleCancel() {
    setModel({
      isModalOpen: false,
      images: [],
      key: '',
    })
  }

  const modalStyles = {
    body: {
      maxHeight: 500,
      overflow: 'auto'
    },
  }

  const selectImage = ({ fileName, url }: any) => {
    setModel({
      images: [
        ...model.images,
        {
          name: fileName,
          state: 'done',
          uid: fileName,
          url
        }
      ]
    })
  }

  const items = useMemo(() => {
    return imageList.map((item: any) => ({
      dot: <ClockCircleOutlined className="timeline-clock-icon" />,
      children: (
        <div>
          <p className='g-fs-14'>{item.time}</p>
          <div className={classnames(styles.images, 'g-p-t-16')}>
            {
              item.data.map((d: any, index: number) => (
                <Image
                  key={d.url}
                  url={d.url}
                  onClick={() => selectImage(d)}
                  disabled={d.isUsed}
                  checked={!!model.images.find((i: any) => i.url === d.url)}
                />
              ))
            }
          </div>
        </div>
      ),
    }))
  }, [listImages, selectImage, model.images])

  return (
    <>
      <Form
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={formData}
        form={form}
        className="g-p-r"
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
          <div>
            <Upload
              action="/service/file/upload"
              listType="picture-card"
              fileList={formData.bigPic}
              multiple
              beforeUpload={beforeUpload}
              onChange={e => handleUploadChange(e, 'bigPic')}
              accept=".jpg, .jpeg, .png"
              className={styles['g-w-auto']}
            >
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </button>
            </Upload>
            <Button
              type="dashed"
              className={styles.select}
              size="small"
              onClick={() => setModel({ isModalOpen: true, key: 'bigPic', images: [] })}
            >
              <PlusOutlined size={10} />
              <div style={{ marginTop: 6 }} className="g-fs-12">选择</div>
            </Button>
          </div>
        </Form.Item>
        <Form.Item
          label="Detailed Image"
          name="productPhotos"
          rules={[{ required: true, message: '请上传' }]}
        >
          <div>
            <Upload
              action="/service/file/upload"
              multiple
              listType="picture-card"
              fileList={formData.productPhotos}
              beforeUpload={beforeUpload}
              onChange={e => handleUploadChange(e, 'productPhotos')}
              className={styles['g-w-auto']}
            >
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </button>
            </Upload>
            <Button
              type="dashed"
              className={styles.select}
              size="small"
              onClick={() => setModel({ isModalOpen: true, key: 'productPhotos', images: [] })}
            >
              <PlusOutlined size={10} />
              <div style={{ marginTop: 6 }} className="g-fs-12">选择</div>
            </Button>
          </div>
        </Form.Item>

        <Divider />

        <Form.Item
          label="MODEL NO."
          name="model"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="PLACE OF ORIGIN"
          name="placeOfOrigin"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="SIZE"
          name="availableSize"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="OFFSET"
          name="offsetRange"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="PCD"
          name="pcd"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="CENTER BORE"
          name="centerBore"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="FINISH"
          name="finishing"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="BRAND NAME"
          name="brandName"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="CAR MAKE"
          name="carMake"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item>

        {/* <Form.Item
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
        </Form.Item> */}

        {/* <Form.Item
          label="Width"
          name="width"
          rules={[{ required: true, message: '请填写' }]}
        >
          <Input />
        </Form.Item> */}

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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }} className="g-p-s g-b-0 g-l-0 g-w-100per g-bc-w g-p-tb-20">
          <Button type="primary" htmlType="submit" loading={loading}>
            {categoryId && productId ? '修改' : '新增'}商品
          </Button>
        </Form.Item>
      </Form>

      <Modal styles={modalStyles} title="选择" open={model.isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Timeline
          className='g-m-t-40'
          items={items}
        />
      </Modal>
    </>
  )
}

export default Page