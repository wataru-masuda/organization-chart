
// src/components/nodes/DepartmentNode.tsx
import React, { useState, useCallback } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';

type DepartmentNodeData = {
  name: string;
  description: string;
  color?: string;
};

const DepartmentNode: React.FC<NodeProps<DepartmentNodeData>> = ({ data, selected }) => {
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);
  const [color, setColor] = useState(data.color || '#f2f2f2');
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    data.name = e.target.value;
  }, [data]);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    data.description = e.target.value;
  }, [data]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    data.color = e.target.value;
  }, [data]);

  const toggleEdit = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <div
      className="department-node"
      style={{
        height: '100%',
        background: color,
        borderRadius: '5px',
        padding: '10px',
        position: 'relative',
      }}
    >
      <NodeResizer minWidth={100} minHeight={100} isVisible={selected} />
      
      {isEditing ? (
        <div className="department-edit">
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="部門名"
            style={{ marginBottom: '5px', width: '100%' }}
          />
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="説明"
            style={{ marginBottom: '5px', width: '100%', height: '60px' }}
          />
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            style={{ marginBottom: '5px' }}
          />
          <button onClick={toggleEdit}>保存</button>
        </div>
      ) : (
        <div onClick={toggleEdit}>
          <h3 style={{ margin: '0 0 5px 0' }}>{name}</h3>
          <p style={{ fontSize: '12px' }}>{description}</p>
        </div>
      )}
    </div>
  );
};

export default DepartmentNode;