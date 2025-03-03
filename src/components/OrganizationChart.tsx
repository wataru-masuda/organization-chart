import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  EdgeTypes,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  MiniMap,
  Panel,
  useReactFlow,
  XYPosition,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

// カスタムノードのインポート
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import PersonNode from './nodes/PersonNode';
import DepartmentNode from './nodes/DepartmentNode';

// ユーティリティとデータ
import { mockDepartments, mockPersons } from './mockData';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

// 定数
const NODE_TYPES: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  person: PersonNode,
  department: DepartmentNode,
};

// ノードデータを変換する関数
const mapMockDepartmentsToNodes = (deps: any[]) => {
  return deps.map(dept => ({
    id: `dept-${dept.id}`,
    type: 'department',
    data: { ...dept },
    position: dept.position as XYPosition,
    style: {
      width: dept.width || 300,
      height: dept.height || 200,
      background: dept.color || '#f2f2f2',
      borderRadius: '5px',
      padding: '10px',
    },
  }));
};

const mapMockPersonsToNodes = (persons: any[]) => {
  return persons.map(person => ({
    id: `person-${person.id}`,
    type: 'person',
    data: { 
      ...person, 
      isContacted: person.isContacted || false 
    },
    position: person.position as XYPosition,
    parentNode: person.departmentId ? `dept-${person.departmentId}` : undefined,
    style: {
      opacity: person.isContacted ? 1 : 0.5,
    },
  }));
};

const OrganizationChart: React.FC = () => {
  // 初期状態の設定
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useReactFlow();

  // 初期データのロード
  React.useEffect(() => {
    const savedData = loadFromLocalStorage('organizationChart');
    if (savedData) {
      setNodes(savedData.nodes || []);
      setEdges(savedData.edges || []);
    } else {
      // モックデータを初期表示
      const departmentNodes = mapMockDepartmentsToNodes(mockDepartments);
      const personNodes = mapMockPersonsToNodes(mockPersons);

      setNodes([...departmentNodes, ...personNodes]);
    }
  }, [setNodes, setEdges]);

  // ノードの変更を処理
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  // エッジの変更を処理
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // 接続が作成されたときの処理
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  // ノード選択時の処理
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    []
  );

  // マップ上のクリック時の処理（選択解除など）
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 状態を保存
  const saveChart = useCallback(() => {
    if (reactFlowInstance) {
      const flowObject = reactFlowInstance.toObject();
      saveToLocalStorage('organizationChart', flowObject);
      alert('組織図が保存されました！');
    }
  }, [reactFlowInstance]);

  // 新規テキストノードの追加
  const addTextNode = useCallback(() => {
    const newNode: Node = {
      id: `text-${Date.now()}`,
      type: 'text',
      data: { text: 'テキストを入力してください' },
      position: { x: 100, y: 100 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 新規画像ノードの追加
  const addImageNode = useCallback(() => {
    const newNode: Node = {
      id: `image-${Date.now()}`,
      type: 'image',
      data: { src: null, alt: '画像' },
      position: { x: 100, y: 200 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 新規部門ノードの追加
  const addDepartmentNode = useCallback(() => {
    const newNode: Node = {
      id: `dept-${Date.now()}`,
      type: 'department',
      data: { 
        name: '新しい部門', 
        description: '部門の説明',
      },
      position: { x: 100, y: 300 },
      style: {
        width: 300,
        height: 200,
        background: '#f2f2f2',
        borderRadius: '5px',
        padding: '10px',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 担当者ノードの追加
  const addPersonNode = useCallback(() => {
    const newNode: Node = {
      id: `person-${Date.now()}`,
      type: 'person',
      data: { 
        name: '新しい担当者', 
        position: '役職', 
        email: 'email@example.com',
        isContacted: false,
      },
      position: { x: 150, y: 150 },
      style: {
        opacity: 0.5,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // 未接触者の表示/非表示を切り替え
  const toggleUncontactedVisibility = useCallback(() => {
    setNodes((nds) => 
      nds.map(node => {
        if (node.type === 'person' && !node.data.isContacted) {
          return {
            ...node,
            hidden: !node.hidden,
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  return (
    <div className="organization-chart-container" style={{ width: '100%', height: '800px' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={NODE_TYPES}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />

            <Panel position="top-right">
              <div className="button-container">
                <button onClick={addTextNode}>テキスト追加</button>
                <button onClick={addImageNode}>画像追加</button>
                <button onClick={addDepartmentNode}>部門追加</button>
                <button onClick={addPersonNode}>担当者追加</button>
                <button onClick={toggleUncontactedVisibility}>未接触者表示切替</button>
                <button onClick={saveChart} style={{ marginLeft: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
                  保存
                </button>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      
      {selectedNode && (
        <div className="node-properties">
          <h3>プロパティ</h3>
          <pre>{JSON.stringify(selectedNode.data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default OrganizationChart;