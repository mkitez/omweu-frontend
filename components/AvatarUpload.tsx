import { useState } from 'react';
import Image from 'next/image';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import {
  message,
  Upload,
  Avatar,
  type UploadProps,
  Button,
  Row,
  Col,
} from 'antd';
import api from '../services/api';
import { useDefaultHeaders } from '../hooks/useDefaultHeaders';
import { useTranslation } from 'next-i18next';
import styles from '../styles/UserProfileForm.module.css';

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = ['image/jpeg', 'image/png'].includes(file.type);
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isSmallerThan2Mb = file.size / 1024 / 1024 < 2;
  if (!isSmallerThan2Mb) {
    message.error('Image must be smaller than 2MB!');
  }
  return isJpgOrPng && isSmallerThan2Mb;
};

type Props = {
  initialImageUrl: string | null;
};

const AvatarUpload: React.FC<Props> = ({ initialImageUrl }) => {
  const headers = useDefaultHeaders();

  const { t } = useTranslation('dashboard');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      setLoading(false);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      return;
    }
  };

  return (
    <Row gutter={[20, 20]} className={styles.avatarUpload}>
      <Col>
        <div className={styles.avatar}>
          {imageUrl ? (
            <Image src={imageUrl} alt="avatar" width={100} height={100} />
          ) : (
            <Avatar size={100} icon={<UserOutlined />} />
          )}
        </div>
      </Col>
      <Col className={styles.avatarActions}>
        <Upload
          name="avatar"
          showUploadList={false}
          customRequest={async ({ file, onSuccess }) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.put('/users/photo/', formData, {
              headers: {
                ...headers,
                'Content-Type': 'multipart/form-data',
              },
            });
            setImageUrl(response.data.photo);
            if (onSuccess) {
              onSuccess(response.data.photo);
            }
          }}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          <Button
            icon={<UploadOutlined />}
            loading={loading}
            disabled={loading}
          >
            {t('profile.upload_image')}
          </Button>
        </Upload>
      </Col>
    </Row>
  );
};

export default AvatarUpload;
