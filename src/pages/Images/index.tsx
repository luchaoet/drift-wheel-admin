
import styles from './index.module.css'
import classnames from 'classnames';
import { Button, Upload, Image, Timeline } from 'antd';
import { UploadOutlined, ClockCircleOutlined } from '@ant-design/icons';
// import { useNavigate } from "react-router-dom";
import request from '../../utils/http'
import { useBoolean, useMount } from "ahooks";
import { useMemo, useState } from 'react'
import moment from 'moment'

function App() {
  const [data, setData] = useState([] as any[])
  const [loading, { setTrue, setFalse }] = useBoolean(false)

  function getList() {
    request({
      url: '/service/file/listImages'
    }).then(res => {
      const d = (res.data || []).map((i: any) => ({
        ...i,
        modifiedTime: moment(i.modifiedTime).format('YYYY-MM-DD'),
        _modifiedTime: new Date(i.modifiedTime).getTime()
      })).sort((a: any, b: any) => b._modifiedTime - a._modifiedTime)

      const temp = {} as Record<string, Object[]>;

      for (const i of d) {
        const modifiedTime = i.modifiedTime;
        if (temp[modifiedTime]) {
          temp[modifiedTime].push(i)
        } else {
          temp[modifiedTime] = new Array(i)
        }
      }

      const data = []
      for (const key of Object.keys(temp)) {
        data.push({
          time: key,
          data: temp[key]
        })
      }
      setData(data)
    })
  }

  useMount(getList)


  const handleUploadChange = ({ fileList }: any) => {
    const done = fileList.every((item: any) => item.status === "done");
    if (done) {
      getList()
    }
  }

  const items = useMemo(() => {
    return data.map((item: any) => ({
      dot: <ClockCircleOutlined className="timeline-clock-icon" />,
      children: (
        <div>
          <p className='g-fs-14'>{item.time}</p>
          <div className={classnames(styles.images, 'g-p-t-16')}>

            {
              item.data.map((d: any, index: number) => (
                <Image
                  width={'100%'}
                  key={d.fileName + index}
                  src={process.env.REACT_APP_IMG_URL + d.url}
                />
              ))
            }
          </div>
        </div>
      ),
    }))
  }, [data])

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

      <Timeline
        className='g-m-t-40'
        items={items}
      />
    </>
  );
}

export default App;