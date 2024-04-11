
import styles from './index.module.css'
import classnames from 'classnames';
import { Button, Table, Image, message } from 'antd';
// import { LockOutlined, UserOutlined } from '@ant-design/icons';
// import { useNavigate } from "react-router-dom";
import request from '../../utils/http'
import { useMount } from "ahooks";
import { useState } from 'react'

function App() {
  const [data, setData] = useState([])

  function getList() {
    request({
      url: '/service/file/listImages'
    }).then(res => {
      setData(res.data)
    })
  }

  useMount(getList)

  const columns = [
    {
      title: '图片', dataIndex: 'url', key: 'url',
      render: (_: any, { url }: any) => {
        return <Image
          width={100}
          src={process.env.REACT_APP_IMG_URL + url}
        />
      }
    },
    { title: '使用', dataIndex: 'isUsed', key: 'isUsed' },
  ]

  return (
    <>
      <Button type='primary'>新增</Button>
      <Table dataSource={data} columns={columns} />
    </>
  );
}

export default App;