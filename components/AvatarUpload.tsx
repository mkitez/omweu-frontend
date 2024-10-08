import {
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Col,
  message,
  Modal,
  Row,
  Upload,
  type UploadProps,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { RcFile } from 'antd/es/upload';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import { useUserApi } from '../hooks/api/useUserApi';
import styles from '../styles/UserProfileForm.module.css';

type Props = {
  initialImageUrl: string | null;
  onUpload?: () => Promise<unknown>;
};

const AvatarUpload: React.FC<Props> = ({ initialImageUrl, onUpload }) => {
  const api = useUserApi();

  const { t, i18n } = useTranslation(['dashboard', 'common']);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const beforeUpload: UploadProps['beforeUpload'] = useCallback(
    (file: RcFile) => {
      const isSupportedFormat = [
        'image/jpeg',
        'image/png',
        'image/webp',
      ].includes(file.type);
      if (!isSupportedFormat) {
        message.error(t('errors.imageFormatConstraint') + ' PNG, JPG, WEBP');
      }
      const isSmallerThan2Mb = file.size / 1024 / 1024 < 2;
      if (!isSmallerThan2Mb) {
        message.error(t('errors.imageSizeConstraint'));
      }
      return isSupportedFormat && isSmallerThan2Mb;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language]
  );

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      setLoading(false);
      message.error(t('errors.common', { ns: 'common' }));
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false);
      message.success(t('notifications.image_update'));
      setImageUrl(info.file.response.photo);
      if (onUpload) {
        onUpload();
      }
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setConfirmModalOpen(false);
    try {
      await api.deletePhoto();
      message.success(t('notifications.image_update'));
      setImageUrl(null);
      setLoading(false);
      if (onUpload) {
        onUpload();
      }
    } catch (e) {
      setLoading(false);
      if (axios.isAxiosError(e)) {
        message.error(t('errors.common', { ns: 'common' }));
      }
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
      <Col>
        <div className={styles.avatarActions}>
          <ImgCrop modalTitle={t('modals.image_crop') || ''}>
            <Upload
              name="file"
              showUploadList={false}
              customRequest={async ({ file, onSuccess, onError }) => {
                const formData = new FormData();
                formData.append('file', file);
                let response;
                try {
                  response = await api.uploadPhoto(formData);
                  if (onSuccess) {
                    onSuccess(response.data);
                  }
                } catch (e) {
                  if (onError && axios.isAxiosError(e)) {
                    onError(e, response);
                  }
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
          </ImgCrop>
          {imageUrl && (
            <Button
              danger
              type="text"
              icon={<DeleteOutlined />}
              disabled={loading}
              onClick={() => setConfirmModalOpen(true)}
            >
              {t('profile.delete_image')}
            </Button>
          )}
        </div>
      </Col>
      <Modal
        open={confirmModalOpen}
        title={t('modals.delete_image.title')}
        okText={t('modals.delete_image.confirm')}
        cancelText={t('modals.delete_image.dismiss')}
        onOk={handleDelete}
        confirmLoading={loading}
        onCancel={() => setConfirmModalOpen(false)}
      >
        {t('modals.delete_image.body')}
      </Modal>
    </Row>
  );
};

export default AvatarUpload;
