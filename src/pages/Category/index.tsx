
import request from '../../utils/http'
import { useMount } from 'ahooks';
import { Tree } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react'
import EditButton from './EditButton'
import AddButton from './AddButton'
import DeleteButton from './DeleteButton'

function App() {
  const [treeData, setTreeData] = useState([])

  const getList = () => {
    request({
      url: '/category/list'
    }).then(res => {
      setTreeData(res.data)
    })
  }

  const titleRender = useCallback((nodeData: any) => {
    return (
      <div className='g-ai-c g-p-tb-2'>
        <div style={{ maxWidth: 'calc(100% - 300px)' }}>
          <p className='g-m-r-10 g-fs-16'>{nodeData.name}</p>
          <p className='g-e-1 g-m-r-10 g-lh-20 g-fs-14 color-666'>{nodeData.categoryDesc}</p>
        </div>
        <EditButton nodeData={nodeData} className="g-m-r-10" onSuccess={getList} />
        <DeleteButton nodeData={nodeData} className="g-m-r-10" onSuccess={getList} />
        <AddButton nodeData={nodeData} onSuccess={getList} />
      </div>
    )

  }, [])


  useMount(() => {
    getList()
  })


  return (
    <>
      <p className='g-p-b-20'>
        <AddButton buttonProps={{ type: "primary", size: 'large' }} nodeData={{ name: '', desc: '', categoryId: null }} onSuccess={getList}>新增一级分类</AddButton>
      </p>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        treeData={treeData}
        blockNode
        fieldNames={{ title: 'name', key: 'categoryId', children: 'children' }}
        titleRender={titleRender}
      />

    </>
  );
}

export default App;