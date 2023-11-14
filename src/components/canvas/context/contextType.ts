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
}

export interface IRect {
  rect: { x: number; y: number; width: number; height: number };
  text?: string;
  label?: ILabel;
  id?: number;
  isSelected?: boolean;
  comment?: string;
}

export interface ICanvasStateType {
  rects: Array<IRect>;
  labels: Array<ILabel>;
  document?: IImage;
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
  }) => void;
  updateValues: (args: { rect: IRect }) => void;
  addRect: (args: { rect: IRect }) => void;
  selectRect: (args: { rect: IRect; isSelected: boolean }) => void;
  removeRect: (args: { rect: IRect }) => void;
}
