import styles from './index.module.css'
import classnames from 'classnames';
import request from '../../utils/http'
import { useMount, useSetState, useBoolean } from 'ahooks';
import { Button, Tree, Table, Pagination, message, Popconfirm } from 'antd';
import { useEffect, useMemo, useState, useCallback } from 'react'
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Img from '../components/Img'

function App() {
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState([])
  const [loading, { setTrue, setFalse }] = useBoolean(false);

  const getList = () => {
    request({
      url: '/service/category/list'
    }).then(res => {
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

  useMount(getList)

  const [selectedKeys, setSelectedKeys] = useState([] as any[]);

  useEffect(() => {
    const data: any = treeData?.[0] || {};
    setSelectedKeys([data.categoryId])
  }, [treeData])

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

  const [tableData, setTableData] = useSetState({
    dataSource: [],
    pager: {
      currentPage: 1,
      pageSize: 20,
      total: 0,
      totalPage: 1,
    }
  })

  const getProductList = useCallback((key: string, pageIndex: number) => {
    request({
      url: '/service/product/page',
      data: {
        queryKey: 'category_id',
        queryValue: key,
        pageSize: tableData.pager.pageSize,
        pageIndex
      }
    }).then((res: any) => {
      setTableData({ dataSource: res.data, pager: res.pager })
    })
  }, [setTableData])

  const pageChange = (page: number) => {
    const key = selectedKeys?.[0];
    getProductList(key, page)
  }

  const handleDelete = (id: string) => {
    setTrue()
    request({
      url: `/service/product/${id}`,
      method: 'delete'
    }).then((res: any) => {
      message.success('删除成功')
      pageChange(tableData.pager.currentPage)
    }).finally(() => {
      setFalse()
    })
  }

  useEffect(() => {
    const key = selectedKeys?.[0];
    if (key) {

      setTableData({
        pager: {
          currentPage: 1,
          pageSize: 20,
          total: 0,
          totalPage: 1,
        }
      })
      getProductList(key, 1)
    }
  }, [selectedKeys, getProductList, setTableData])

  const columns = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'productId',
      key: 'productId',
      render: (_: any, { category }: any) => {
        return category.name
      }
    },
    {
      title: '图片',
      dataIndex: 'imgList',
      key: 'imgList',
      render: (_: any, { imgList }: any) => {
        const bigPic = imgList?.bigPic || [];
        return (
          <div className='g-ai-c'>
            {
              bigPic.slice(0, 3).map((item: string, index: number) => (
                <Img style={{ width: 50 }} src={item} key={index} alt="" />
              ))
            }
            {
              bigPic.length > 3 && <span className='g-fs-20 g-m-l-10'>...</span>
            }
          </div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'width',
      key: 'width',
      render: (_: any, { productId, category }: any) => {
        const categoryId = category.categoryId;
        return (
          <>
            <Button
              type="primary"
              size='small'
              className='g-m-r-10'
              onClick={() => navigate(`/product/${categoryId}/${productId}`)}
            >编辑</Button>
            <Popconfirm
              title="删除商品"
              description="删除后无法恢复，确定删除该商品？"
              onConfirm={() => handleDelete(productId)}
              okText="确定"
              cancelText="取消"
            >
              <Button loading={loading} danger size='small'>删除</Button>
            </Popconfirm>
          </>
        )
      }
    },
  ];

  return (
    <>
      <div className='g-p-b-20'>
        <Button type='primary' onClick={() => navigate('/product/create')}>新增商品</Button>
      </div>
      <div className='g-d-f'>
        <div style={{ width: 300 }} className='g-p-r-20'>
          <Tree
            showLine
            switcherIcon={<DownOutlined />}
            autoExpandParent
            onSelect={setSelectedKeys}
            treeData={treeData}
            blockNode
            fieldNames={{ title: 'name', key: 'categoryId', children: 'children' }}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
          />
        </div>

        <div className={classnames('g-fg-1 g-mw-0 g-p-l-20', styles.table)}>
          <Table dataSource={tableData.dataSource} columns={columns} pagination={false} />
          <div className='g-p-t-20'>
            <Pagination
              current={tableData.pager.currentPage}
              pageSize={tableData.pager.pageSize}
              total={tableData.pager.total}
              onChange={pageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;