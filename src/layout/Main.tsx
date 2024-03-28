import { Outlet } from 'react-router-dom'
import React from 'react';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const items = [
  {
    label: '分类管理',
    key: '/category',
  },
  {
    label: '商品管理',
    key: '/product',
  }
]

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();


  const handleMenu: MenuProps['onClick'] = ({ key }) => {
    navigate(key)
  };

  const pathname = window.location.pathname.replace(/^\/manage/, '');

  return (
    <Layout hasSider>
      <Sider

        style={{ overflow: 'auto', height: '100vh' }}
      >
        <div className="g-p-tb-20 g-p-lr-30">
          <img src="/logo.png" className='g-w-100per' alt="" />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[pathname]}
          items={items}
          onClick={handleMenu}
        />
      </Sider>
      <Layout className='g-h-100vh'>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content className='g-p-t-24 g-p-lr-16 g-p-b-16 g-oy-a'>
          <div
            style={{
              padding: 24,
              minHeight: 'calc(100vh - 16px - 24px - 64px)',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;