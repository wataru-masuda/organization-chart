

// src/components/nodes/PersonNode.tsx
import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

type PersonNodeData = {
  name: string;
  position: string;
  email: string;
  isContacted: boolean;
};

const PersonNode: React.FC<NodeProps<PersonNodeData>> = ({ data, isConnectable }) => {
  const [isContacted, setIsContacted] = useState(data.isContacted);
  
  const toggleContactStatus = useCallback(() => {
    const newStatus = !isContacted;
    setIsContacted(newStatus);
    data.isContacted = newStatus;
  }, [isContacted, data]);

  return (
    <div 
      className={`person-node ${isContacted ? 'contacted' : 'not-contacted'}`}
      style={{ 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '5px',
        backgroundColor: 'white',
        opacity: isContacted ? 1 : 0.5,
        width: '180px',
      }}
    >
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <div 
          style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: '#ddd', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: '10px',
          }}
        >
          {data.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 'bold' }}>{data.name}</div>
          <div style={{ fontSize: '12px' }}>{data.position}</div>
        </div>
      </div>
      <div style={{ fontSize: '12px', marginBottom: '5px' }}>{data.email}</div>
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={isContacted}
            onChange={toggleContactStatus}
          />
          コンタクト済み
        </label>
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

export default PersonNode;
