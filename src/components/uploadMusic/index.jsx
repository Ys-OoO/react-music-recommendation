import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { uploadMusic } from '../../api/music/musicList';
import UploadFile from './upload';
export function UploadMusic() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [musicForm] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async (values) => {
    const { cover, music, name, singer } = values;
    const data = uploadMusic({
      name,
      cover,
      music,
      singer,
    });
    if (data) {
      handleCancel();
    }
  };
  const onFinishFailed = (errorInfo) => {
    // const { music } = errorInfo.values;
    // uploadFile(music, 5, '/music/uploadChunk', '/music/vertifyFile', '/music/mergeFile');
  };

  return (
    <div>
      <Button onClick={showModal}>上传音乐</Button>
      <Modal
        type="primary"
        onClick={showModal}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        width={320}
        title="上传文件"
        afterClose={musicForm.resetFields}
      >
        <Form
          name="basic"
          initialValues={{
            name: '',
            cover: '',
            singer: '',
            music: '',
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={musicForm}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input style={{ width: '200px' }} />
          </Form.Item>

          <Form.Item
            label="歌手"
            name="singer"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input style={{ width: '200px' }} />
          </Form.Item>

          <Form.Item
            name="cover"
            label="封面"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <UploadFile
              // value={musicFiles.cover}
              // getSubChange={getSubChange}
              isCover={true}
              // deleteMusicPath={deleteMusicPath}
            ></UploadFile>
          </Form.Item>

          <Form.Item
            name="music"
            label="文件"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <UploadFile isCover={false}></UploadFile>
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '10px' }}>
              <Button type="primary" htmlType="submit">
                上传
              </Button>
              <Button
                type="default"
                style={{ marginLeft: '80px' }}
                onClick={() => setIsModalOpen(false)}
              >
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
