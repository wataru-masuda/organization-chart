// 組織データ型定義用のtypes.ts
export interface Department {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  position: { x: number; y: number };
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
  positionXY: { x: number; y: number };
  isContacted: boolean;
}