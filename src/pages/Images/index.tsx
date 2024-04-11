
import styles from './index.module.css'
import classnames from 'classnames';
import { Button, Upload, Image, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
// import { useNavigate } from "react-router-dom";
import request from '../../utils/http'
import { useBoolean, useMount } from "ahooks";
import { useState } from 'react'

function App() {
  const [data, setData] = useState([])
  const [loading, { setTrue, setFalse }] = useBoolean(false)

  function getList() {
    request({
      url: '/service/file/listImages'
    }).then(res => {
      setData(res.data)
    })
  }

  useMount(getList)


  const handleUploadChange = ({ fileList }: any) => {
    const done = fileList.every((item: any) => item.status === "done");
    if (done) {
      console.log(fileList)
      getList()
    }
  }

  return (
    <>
      <Upload
        action="/service/file/uploadFiles"
        multiple
        accept=".jpg, .jpeg, .png"
        onChange={e => handleUploadChange(e)}
        showUploadList={true}
        name='files'
      >
        <Button type='primary' icon={<UploadOutlined />} loading={loading}>批量上传</Button>
      </Upload>

      <div className='g-p-t-40'>
        <p className='g-fs-20'>2024-04-06 23:00</p>
        <div className={classnames(styles.images, 'g-p-t-16')}>

          {
            data.map((item: any) => (
              <Image
                width={'100%'}
                key={item.fileName}
                src={process.env.REACT_APP_IMG_URL + item.url}
              />
            ))
          }
        </div>
      </div>

    </>
  );
}

export default App;