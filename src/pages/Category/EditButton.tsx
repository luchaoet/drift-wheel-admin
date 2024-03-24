import request from '../../utils/http'
import { Button, Tooltip, Form, message, Input, Modal } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react'

function App({ className, nodeData, onSuccess }: any) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)

  const editCategory = ({ name, categoryDesc }: any) => {
    request({
      url: `/service/category/${nodeData.categoryId}`,
      data: { name, categoryDesc },
      method: 'put',
    }).then(() => {
      message.success('编辑成功');
      onSuccess?.()
      setOpen(false)
    })
  }

  const onOk = () => {
    form.validateFields().then(values => {
      if (nodeData.name !== values.name || nodeData.categoryDesc !== values.categoryDesc) {
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
          initialValues={{ name: nodeData.name, categoryDesc: nodeData.categoryDesc }}
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
            label="描述"
            name="categoryDesc"
          >
            <Input allowClear />
          </Form.Item>
        </Form>
      </Modal>
    </>

  )
}

export default App