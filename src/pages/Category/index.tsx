
import styles from './index.module.css'
import request from '../../utils/http'
import { useMount } from 'ahooks';
import { Tree, Button, Tooltip } from 'antd';
import { DownOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useCallback } from 'react'

function App() {
  const [treeData, setTreeData] = useState([])

  const getList = () => {
    request({
      url: '/category/list'
    }).then(res => {
      setTreeData(res.data)
    })
  }

  const onSelect = () => { }

  const titleRender = useCallback((nodeData: any) => {
    return (
      <div className='g-ai-c g-p-tb-2'>
        <span className='g-m-r-10'>{nodeData.name}</span>
        <Tooltip title="编辑/edit">
          <Button className='g-m-r-10' size="small" icon={<EditOutlined />} />
        </Tooltip>
        <Tooltip title="删除/delete">
          <Button className='g-m-r-10' size="small" icon={<DeleteOutlined />} />
        </Tooltip>
        <Tooltip title="删除/delete">
          <Button size="small" icon={<PlusOutlined />} />
        </Tooltip>
      </div>
    )

  }, [])


  useMount(() => {
    getList()
  })


  return (
    <>
      <p className='g-p-b-20'><Button type="primary">新增一级分类/Add a first-level category</Button></p>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        onSelect={onSelect}
        treeData={treeData}
        blockNode
        fieldNames={{ title: 'name', key: 'categoryId', children: 'children' }}
        titleRender={titleRender}
      />

    </>
  );
}

export default App;