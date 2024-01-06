/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, message } from 'antd';
import requestInstance from '../../utils/request';

export default function LoginModal({ isRegister = false, onCancel, ...props }) {
  const onFinish = async (values) => {
    let res;
    if (isRegister) {
      res = await requestInstance.post('/user/register', values);
      if (!res?.status) {
        //注册失败
        message.warning(res?.data);
      } else {
        message.success(res?.data);
        onCancel();
      }
    } else {
      res = await requestInstance.post('/user/login', values);
      if (!res.code) {
        message.warning('密码错误');
      } else {
        message.success('登录成功');
        onCancel();
        localStorage.setItem('musictoken', res.data);
      }
    }
  };
  return (
    <Modal footer={null} title={isRegister ? '注册' : '登录'} onCancel={onCancel} {...props}>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 18,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
