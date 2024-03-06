import { Outlet, Link } from 'react-router-dom'
const Layout = () => {
  return (
    <div>
      我是一级路由layout组件
      --
      <Link to="/board">面板</Link>
      --
      <Link to="/about">关于</Link>
      {/* 配置二级路由出口 */}
      <Outlet></Outlet>
    </div>
  )
}
export default Layout