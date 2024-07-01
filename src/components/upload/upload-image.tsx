import { UploadProps } from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { ReactElement } from 'react';

import { Iconify } from '../icon';

import { StyledUploadBox } from './styles';

interface Props extends UploadProps {
  placeholder?: ReactElement;
}
export function UploadImage({ placeholder, ...other }: Props) {
  return (
    <StyledUploadBox>
      <Dragger {...other} showUploadList={false}>
        <div className="opacity-60 hover:opacity-50">
          {placeholder || (
            <div className="m-auto flex h-16 w-16 items-center justify-center ">
              <Iconify icon="hugeicons:image-upload" size={28} />
            </div>
          )}
        </div>
      </Dragger>
    </StyledUploadBox>
  );
}
