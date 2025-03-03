
// src/components/nodes/ImageNode.tsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

type ImageNodeData = {
  src: string | null;
  alt: string;
};

const ImageNode: React.FC<NodeProps<ImageNodeData>> = ({ data, isConnectable }) => {
  const [src, setSrc] = useState<string | null>(data.src);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSrc(base64);
        data.src = base64;
      };
      
      reader.readAsDataURL(file);
    }
  }, [data]);

  return (
    <div className="image-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div style={{ padding: '10px' }}>
        {src ? (
          <img src={src} alt={data.alt} style={{ maxWidth: '200px', maxHeight: '200px' }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            <p>画像をアップロード</p>
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default ImageNode;