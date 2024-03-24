import request from '../../utils/http'
import { Button, Tooltip, Form, message, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react'

const { TextArea } = Input;

function App({ className, nodeData, onSuccess, children, buttonProps = {} }: any) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)

  const editCategory = ({ name, categoryDesc }: any) => {
    request({
      url: `/service/category`,
      data: { name, categoryDesc, parentId: nodeData.categoryId || null },
      method: 'post',
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

  const afterOpenChange = (val: boolean) => {
    if (!val) {
      form.setFieldValue('name', '')
      form.setFieldValue('categoryDesc', '')
    }
  }

  const title = nodeData.categoryId ? '新增子分类' : '';

  return (
    <>
      <Tooltip title={title} placement="bottom">
        <Button size="small" {...buttonProps} className={className} icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          {children}
        </Button>
      </Tooltip>

      <Modal
        title={title || '新增一级分类'}
        open={open} onOk={onOk}
        onCancel={() => setOpen(false)}
        afterOpenChange={afterOpenChange}
      >
        <Form
          layout="vertical"
          initialValues={{ name: '', categoryDesc: '' }}
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