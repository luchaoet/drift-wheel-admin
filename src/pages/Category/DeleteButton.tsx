
import request from '../../utils/http'
import { message, Button, Tooltip, Popconfirm } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';

function App({ className, nodeData, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const handleOk = () => {
    setLoading(true)
    request({
      url: `/service/category/${nodeData.categoryId}`,
      method: 'DELETE'
    }).then(() => {
      message.success('删除成功');
      onSuccess?.()
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <Popconfirm
      title="删除"
      description={`确定删除${nodeData.name}?`}
      icon={<DeleteOutlined />}
      onConfirm={handleOk}
    >
      <Tooltip title="删除" placement="bottom">
        <Button danger className={className} size="small" icon={loading ? <LoadingOutlined /> : <DeleteOutlined />} />
      </Tooltip>
    </Popconfirm>
  )
}

export default App