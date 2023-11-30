/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ILabel {
  id: number;
  text: string;
  color: string;
}

export interface IImage {
  url: string;
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

export interface ICanvasStateType {
  rects: Array<IRect>;
  labels: Array<ILabel>;
  document?: Array<IImage>;
  nextRectId: number;
  page: number;
}

export interface CanvasContextProviderProps {
  children: React.ReactNode;
}

export interface CanvasContextReturnType {
  data: ICanvasStateType;
  setInitialData: (args: {
    rects: Array<IRect>;
    labels: Array<ILabel>;
    document: IImage;
    page?: number;
  }) => void;
  updateValues: (args: { rect: IRect }) => void;
  addRect: (args: { rect: IRect; text: string }) => void;
  selectRect: (args: { rect: IRect; isSelected: boolean }) => void;
  removeRect: (args: { rect: IRect }) => void;
}
