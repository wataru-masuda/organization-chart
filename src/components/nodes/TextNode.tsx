import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow, useKeyPress } from 'reactflow';

type TextNodeData = {
  text: string;
  fontSize: number;
};

const TextNode: React.FC<NodeProps<TextNodeData>> = ({ id, data, isConnectable, selected }) => {
  // データの初期化（データがない場合のデフォルト値を設定）
  const initialText = data.text || 'テキストを入力';
  const initialFontSize = data.fontSize || 14;
  
  const [text, setText] = useState(initialText);
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [isEditing, setIsEditing] = useState(false);
  
  const reactFlowInstance = useReactFlow();
  
  // Ctrl+C と Ctrl+V のキープレスを検知
  const isCPressed = useKeyPress('c');
  const isVPressed = useKeyPress('v');
  const isCtrlPressed = useKeyPress(['Control', 'Meta']);

  // テキスト変更ハンドラー
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    // データを更新
    data.text = newText;
  }, [data]);

  // フォントサイズ変更ハンドラー
  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value, 10) || 0;
    setFontSize(newSize);
    // データを更新
    data.fontSize = newSize;
  }, [data]);

  // 編集モード切り替え
  const toggleEdit = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  // 編集終了ハンドラー - テキストエリア外のクリックで呼ばれる
  const handleEditEnd = useCallback((e: React.FocusEvent) => {
    // 関連ターゲットがフォントサイズ入力フォームでない場合のみ編集モードを終了
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsEditing(false);
    }
  }, []);

  // コピー＆ペースト機能
  useEffect(() => {
    // コピー処理
    if (isCtrlPressed && isCPressed && selected) {
      const nodeToCopy = {
        text: text,
        fontSize: fontSize
      };
      localStorage.setItem('copiedTextNode', JSON.stringify(nodeToCopy));
    }

    // ペースト処理
    if (isCtrlPressed && isVPressed && selected) {
      const copiedNodeData = localStorage.getItem('copiedTextNode');
      if (copiedNodeData) {
        try {
          const parsedData = JSON.parse(copiedNodeData) as TextNodeData;
          
          // 現在選択されているノードの位置を取得
          const nodes = reactFlowInstance.getNodes();
          const selectedNode = nodes.find(node => node.id === id);
          
          if (selectedNode) {
            // 新しいノードを作成
            const newNode = {
              id: `text-${Date.now()}`,
              type: 'textNode',
              position: {
                x: selectedNode.position.x + 20,
                y: selectedNode.position.y + 20
              },
              data: {
                text: parsedData.text,
                fontSize: parsedData.fontSize
              }
            };
            
            reactFlowInstance.addNodes(newNode);
          }
        } catch (error) {
          console.error('Failed to paste node:', error);
        }
      }
    }
  }, [isCtrlPressed, isCPressed, isVPressed, selected, id, text, fontSize, reactFlowInstance]);

  return (
    <div 
      className="text-node"
      style={{
        backgroundColor: isEditing || selected ? 'white' : 'transparent',
        border: isEditing || selected ? '1px solid #1a192b' : '1px solid transparent',
        borderRadius: '5px',
        transition: 'background-color 0.3s, border 0.3s'
      }}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        isConnectable={isConnectable} 
        style={{
          background: isEditing || selected ? '#1a192b' : 'transparent',
          border: isEditing || selected ? '1px solid #1a192b' : '1px solid transparent',
          transition: 'background-color 0.3s, border 0.3s'
        }}
      />
      
      {isEditing ? (
        <div 
          style={{ padding: '10px' }}
          // onBlurイベントをdivに設定し、子要素間のフォーカス移動を検知
          onBlur={handleEditEnd}
          // tabIndexを設定してフォーカスを受け取れるようにする
          tabIndex={0}
        >
          <textarea
            value={text}
            onChange={handleTextChange}
            autoFocus
            style={{ 
              width: '100%', 
              minHeight: '80px',
              fontSize: `${fontSize}px`,
              padding: '5px'
            }}
          />
          <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: '5px', fontSize: '12px' }}>
              フォントサイズ:
            </label>
            <input
              type="number"
              min="8"
              max="72"
              value={fontSize}
              onChange={handleFontSizeChange}
              style={{ width: '50px' }}
              // フォントサイズ入力フォームのクリックでの編集モード終了を防ぐ
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      ) : (
        <div 
          onClick={toggleEdit} 
          style={{ 
            padding: '10px', 
            minHeight: '40px',
            fontSize: `${fontSize}px`
          }}
        >
          {text}
        </div>
      )}
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isConnectable={isConnectable} 
        style={{
          background: isEditing || selected ? '#1a192b' : 'transparent',
          border: isEditing || selected ? '1px solid #1a192b' : '1px solid transparent',
          transition: 'background-color 0.3s, border 0.3s'
        }}
      />
    </div>
  );
};

export default TextNode;