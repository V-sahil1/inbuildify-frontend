import React from 'react';
import { Image } from 'antd';
import {
  IconArrowsHorizontal,
  IconArrowsVertical,
  IconDownload,
  IconEye,
  IconRotate,
  IconRotate2,
  IconZoomIn,
  IconZoomOut,
} from '@tabler/icons-react';

interface ImagePreviewProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  fileName?: string;
}

const downloadFromUrl = async (url: string, fileName: string) => {
  try {
    console.log(url);
    const response = await fetch(url, {
      mode: "cors",
    });

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Download failed:', error);
  }
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  width = 30,
  height = 25,
  className = 'rounded transition-all duration-200',
  fileName = "image.png"
}) => {
  if (!src) return null;

  return (
    <div className="flex items-center gap-1 relative group">
      <div className="relative">
        <Image
          src={src}
          width={width}
          height={height}
          className={className}
          preview={{
            mask: (
              <div className="w-full h-full flex items-center justify-center bg-black-10 bg-opacity-90 rounded">
                <IconEye size={16} className="text-white" />
              </div>
            ),
            maskClassName: 'rounded',
            toolbarRender: (_, { transform: { scale }, actions: { onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onFlipX, onFlipY } }) => (
              <ul className="ant-image-preview-operations">
                <li className="ant-image-preview-operations-operation" onClick={onZoomIn}>
                  <IconZoomIn />
                </li>
                <li className="ant-image-preview-operations-operation" onClick={onZoomOut}>
                  <IconZoomOut />
                </li>
                <li className="ant-image-preview-operations-operation" onClick={onRotateLeft}>
                  <IconRotate2 />
                </li>
                <li className="ant-image-preview-operations-operation" onClick={onRotateRight}>
                  <IconRotate />
                </li>
                <li className="ant-image-preview-operations-operation" onClick={onFlipX}>
                  <IconArrowsHorizontal />
                </li>
                <li className="ant-image-preview-operations-operation" onClick={onFlipY}>
                  <IconArrowsVertical />
                </li>
                <li
                  className="ant-image-preview-operations-operation"
                  onClick={() => {
                    downloadFromUrl(src, fileName);
                  }}
                >
                  <IconDownload />
                </li>
              </ul>
            )
          }}
        />
      </div>
    </div>
  );
};

export default ImagePreview;
