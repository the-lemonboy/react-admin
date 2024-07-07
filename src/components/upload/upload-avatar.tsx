import { LoadingOutlined } from '@ant-design/icons';
import { Typography, Upload } from 'antd';
import { UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';

import { Iconify } from '../icon';

import { StyledUploadAvatar } from './styles';
import { beforeAvatarUpload } from './utils';

interface Props extends UploadProps {
  defaultAvatar?: string;
  helperText?: React.ReactElement | string;
  onImageUrlChange?: (url: string) => void; // 新增回调函数类型
}

export function UploadAvatar({
  helperText,
  defaultAvatar = '',
  onImageUrlChange,
  ...other
}: Props) {
  const [imageUrl, setImageUrl] = useState<string>(defaultAvatar);

  const [isHover, setIsHover] = useState(false);
  const handelHover = (hover: boolean) => {
    setIsHover(hover);
  };
  const [loading, setLoading] = useState(false);
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (['done', 'error'].includes(info.file.status!)) {
      const newImageUrl = info.file.response.data.src!;
      setImageUrl(newImageUrl);
      onImageUrlChange?.(newImageUrl); // 调用回调函数
      setLoading(false);
    }
  };

  const renderPreview = <img src={imageUrl} alt="" className="absolute rounded-full" />;

  const renderPlaceholder = (
    <div
      style={{
        backgroundColor: !imageUrl || isHover ? 'rgba(22, 28, 36, 0.64)' : 'transparent',
        color: '#fff',
      }}
      className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
    >
      <Iconify icon="mage:image-upload" size={32} />
      <div className="mt-1 text-xs">Upload Photo</div>
    </div>
  );

  const renderContent = (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
      onMouseEnter={() => handelHover(true)}
      onMouseLeave={() => handelHover(false)}
    >
      {loading ? <LoadingOutlined /> : imageUrl ? renderPreview : null}
      {!loading && (!imageUrl || isHover) ? renderPlaceholder : null}
    </div>
  );

  const defaultHelperText = (
    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
      Allowed *.jpeg, *.jpg, *.png, *.gif
    </Typography.Text>
  );
  const renderHelpText = <div className="text-center">{helperText || defaultHelperText}</div>;

  return (
    <StyledUploadAvatar>
      <Upload
        name="file"
        showUploadList={false}
        listType="picture-circle"
        className="avatar-uploader !flex items-center justify-center"
        {...other}
        beforeUpload={beforeAvatarUpload}
        onChange={handleChange}
      >
        {renderContent}
      </Upload>
      {renderHelpText}
    </StyledUploadAvatar>
  );
}
