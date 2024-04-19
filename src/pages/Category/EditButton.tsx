import request from '../../utils/http'
import { Button, Tooltip, Form, message, Input, Modal, InputNumber } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react'
const { TextArea } = Input;

function App({ className, nodeData, onSuccess }: any) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)

  const editCategory = ({ name, categoryDesc, index }: any) => {
    request({
      url: `/service/category/${nodeData.categoryId}`,
      data: { name, categoryDesc, index },
      method: 'put',
    }).then(() => {
      message.success('编辑成功');
      onSuccess?.()
      setOpen(false)
    })
  }

  const onOk = () => {
    form.validateFields().then(values => {
      if (
        nodeData.name !== values.name ||
        nodeData.categoryDesc !== values.categoryDesc ||
        nodeData.index !== values.index
      ) {
        editCategory(values)
      }
    })

  }

  return (
    <>
      <Tooltip title="编辑" placement="bottom">
        <Button className={className} size="small" icon={<EditOutlined />} onClick={() => setOpen(true)} />
      </Tooltip>
      <Modal title="编辑" open={open} onOk={onOk} onCancel={() => setOpen(false)}>
        <Form
          layout="vertical"
          initialValues={{ name: nodeData.name, categoryDesc: nodeData.categoryDesc, index: nodeData.index || 0 }}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="分类名称"
            name="name"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input allowClear />
          </Form.Item>

          <Form.Item
            label="排序"
            name="index"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <InputNumber className='g-w-100per' min={0} max={999} />
          </Form.Item>
          <Form.Item
            label="描述"
            name="categoryDesc"
          >
            <TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              allowClear
            />

          </Form.Item>
        </Form>
      </Modal>
    </>

  )
}

export default App