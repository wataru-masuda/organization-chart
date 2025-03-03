// src/components/nodes/TextNode.tsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

type TextNodeData = {
  text: string;
};

const TextNode: React.FC<NodeProps<TextNodeData>> = ({ data, isConnectable }) => {
  const [text, setText] = useState(data.text || 'テキストを入力');
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    data.text = e.target.value;
  }, [data]);

  const toggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <div className="text-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      {isEditing ? (
        <textarea
          value={text}
          onChange={handleTextChange}
          onBlur={toggleEdit}
          autoFocus
          style={{ width: '100%', minHeight: '80px' }}
        />
      ) : (
        <div onClick={toggleEdit} style={{ padding: '10px', minHeight: '40px' }}>
          {text}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default TextNode;
