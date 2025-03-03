
// src/utils/storage.ts
export const saveToLocalStorage = (key: string, data: any): void => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
    }
  };
  
  export const loadFromLocalStorage = (key: string): any => {
    try {
      const serializedData = localStorage.getItem(key);
      if (serializedData === null) {
        return null;
      }
      return JSON.parse(serializedData);
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
      return null;
    }
  };