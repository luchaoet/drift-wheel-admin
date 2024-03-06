
import styles from './index.module.css'
import classnames from 'classnames';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log(values)
    navigate('/home')
  }
  return (
    <div className={classnames('g-jc-ai-c g-w-100vw g-h-100vh g-d-f g-fd-c')}>
      <div className={styles.form}>
        <dl>
          <dt className='color-333 g-fs-24 g-fw-b g-lh-36 g-m-b-8'>Drift Wheel</dt>
          <dd className='color-666 g-m-b-28 g-fs-16 g-lh-24'>One Stop Alloy Wheels Supplier</dd>
        </dl>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="g-w-100per">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  );
}

export default App;