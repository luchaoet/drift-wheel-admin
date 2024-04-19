
import request from '../../utils/http'
import { useMount } from 'ahooks';
import { Tree, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useState, useCallback, useMemo } from 'react'
import EditButton from './EditButton'
import AddButton from './AddButton'
import DeleteButton from './DeleteButton'

function App() {
  const [treeData, setTreeData] = useState([])

  const getList = () => {
    request({
      url: '/service/category/list'
    }).then((res) => {
      const data = res.data.sort((a: any, b: any) => {
        const aIndex = Number(a.index) ?? 0;
        const bIndex = Number(b.index) ?? 0;
        return aIndex - bIndex;
      })

      for (let index = 0; index < data.length; index++) {
        const children = data[index].children;
        data[index].children = children.sort((a: any, b: any) => {
          const aIndex = Number(a.index) ?? 0;
          const bIndex = Number(b.index) ?? 0;
          return aIndex - bIndex;
        })
      }
      setTreeData(data)

    })
  }

  const titleRender = useCallback((nodeData: any) => {
    return (
      <div className='g-ai-c g-p-tb-2 g-fg-1 g-mw-0'>
        <div style={{ maxWidth: 400 }}>
          <p className='g-m-r-10 g-fs-16' title={nodeData.name}>
            <Tag className='g-m-l-10' color={nodeData.level === 0 ? 'magenta' : 'green'}>No.{nodeData.index || 0}</Tag>
            {nodeData.name}
          </p>
          <p className='g-e-1 g-m-r-10 g-lh-20 g-fs-14 color-666 g-p-l-40 g-m-l-20' title={nodeData.categoryDesc}>{nodeData.categoryDesc}</p>
        </div>
        <EditButton nodeData={nodeData} className="g-m-r-10" onSuccess={getList} />
        <DeleteButton nodeData={nodeData} className="g-m-r-10" onSuccess={getList} />
        {
          nodeData.level === 0 && <AddButton nodeData={nodeData} onSuccess={getList} />
        }
      </div>
    )

  }, [])


  useMount(() => {
    getList()
  })

  const expandedKeys = useMemo(() => {
    const keys = [] as string[];
    function pushCategoryId(data: any[]) {
      for (const d of data) {
        d.categoryId && keys.push(d.categoryId)
        if (d.children.length) {
          pushCategoryId(d.children)
        }
      }
    }
    pushCategoryId(treeData)
    return keys
  }, [treeData])


  return (
    <>
      <p className='g-p-b-20'>
        <AddButton buttonProps={{ type: "primary", size: 'large' }} nodeData={{ name: '', desc: '', categoryId: null }} onSuccess={getList}>新增一级分类</AddButton>
      </p>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        defaultExpandAll
        expandedKeys={expandedKeys}
        treeData={treeData}
        blockNode
        fieldNames={{ title: 'name', key: 'categoryId', children: 'children' }}
        titleRender={titleRender}
      />

    </>
  );
}

export default App;