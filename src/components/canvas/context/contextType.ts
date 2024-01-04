/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILabel {
  id: string;
  text: string;
  color: string;
}

export interface IImage {
  url: string;
  displayUrl: string;
  height: number;
  width: number;
  page: number;
}

export interface IRect {
  rect: { x: number; y: number; width: number; height: number };
  text?: string;
  label?: number;
  id?: number;
  isSelected?: boolean;
  comment?: string;
}

export interface IExtraction {
  top: number;
  left: number;
  height: number;
  width: number;
  extractedText: string;
  document: string;
  comments: string;
  userText: string;
  id: string;
  isSelected?: boolean;
  label: string;
  tempId?: string;
}

export interface ICanvasStateType {
  rects: Array<IRect>;
  extractions: Array<IExtraction>;
  labels: Array<ILabel>;
  document?: Array<IImage>;
  nextRectId: number;
  page: number;
}

export interface CanvasContextProviderProps {
  children: React.ReactNode;
}

export interface IRecord {
  id: string;
  documents: {
    [key: string]: IImage;
  };
  labels?: {
    [key: string]: ILabel;
  };
  extractions?: {
    [key: string]: IExtraction;
  };
}

export interface CanvasContextReturnType {
  data: ICanvasStateType;
  setInitialData: (args: {
    rects: Array<IRect>;
    extractions: Array<IExtraction>;
    labels: Array<ILabel>;
    document: IImage;
    page?: number;
  }) => void;
  updateValues: (args: IExtraction) => void;
  addRect: (args: IExtraction) => void;
  selectRect: (args: { extraction: IExtraction; isSelected: boolean }) => void;
  removeRect: (args: IExtraction) => void;
}
