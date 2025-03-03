// src/mockData.ts
import { XYPosition } from 'reactflow';

export const mockDepartments = [
  {
    id: '1',
    name: '営業本部',
    description: '営業活動全体を統括する部門',
    position: { x: 100, y: 100 } as XYPosition,
    width: 800,
    height: 600,
    color: '#e6f7ff',
  },
  {
    id: '2',
    name: '営業1課',
    description: '国内営業を担当',
    position: { x: 150, y: 200 } as XYPosition,
    parentId: '1',
    width: 350,
    height: 400,
    color: '#f0f5ff',
  },
  {
    id: '3',
    name: '営業2課',
    description: '海外営業を担当',
    position: { x: 550, y: 200 } as XYPosition,
    parentId: '1',
    width: 350,
    height: 400,
    color: '#f9f0ff',
  }
];

export const mockPersons = [
  {
    id: '1',
    name: '山田太郎',
    position: '部長',
    email: 'yamada@example.com',
    departmentId: '1',
    positionXY: { x: 100, y: 150 } as XYPosition,
    isContacted: true,
  },
  {
    id: '2',
    name: '佐藤次郎',
    position: '課長',
    email: 'sato@example.com',
    departmentId: '2',
    positionXY: { x: 170, y: 250 } as XYPosition,
    isContacted: true,
  },
  {
    id: '3',
    name: '鈴木花子',
    position: '主任',
    email: 'suzuki@example.com',
    departmentId: '2',
    positionXY: { x: 170, y: 350 } as XYPosition,
    isContacted: false,
  },
  {
    id: '4',
    name: '高橋一郎',
    position: '課長',
    email: 'takahashi@example.com',
    departmentId: '3',
    positionXY: { x: 570, y: 250 } as XYPosition,
    isContacted: true,
  },
  {
    id: '5',
    name: '田中雅子',
    position: '主任',
    email: 'tanaka@example.com',
    departmentId: '3',
    positionXY: { x: 570, y: 350 } as XYPosition,
    isContacted: false,
  },
];

export interface Department {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  position: XYPosition;
  width?: number;
  height?: number;
  color?: string;
}

export interface Person {
  id: string;
  name: string;
  position: string;
  email: string;
  departmentId?: string;
  positionXY: XYPosition;
  isContacted: boolean;
}