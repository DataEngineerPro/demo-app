/* eslint-disable @typescript-eslint/no-explicit-any */
import { IImage, ILabel, IRect } from './contextType';

export enum ActionTypes {
  SET_INITIAL_DATA = 'SET_INITIAL_DATA',
  UPDATE_LABEL_VALUE = 'UPDATE_LABEL_VALUE',
  ADD_RECT = 'ADD_RECT',
  SELECT_RECT = 'SELECT_RECT',
  REMOVE_RECT = 'REMOVE_RECT',
  UPDATE_RECT = 'UPDATE_RECT',
  ADD_LABEL = 'ADD_LABEL',
}

interface SetInitialDataAction {
  type: ActionTypes.SET_INITIAL_DATA;
  payload: {
    rects: Array<IRect>;
    labels: Array<ILabel>;
    document: IImage;
  };
}

interface UpdateLabelValueAction {
  type: ActionTypes.UPDATE_LABEL_VALUE;
  payload: {
    rect: IRect;
  };
}

interface AddRectAction {
  type: ActionTypes.ADD_RECT;
  payload: {
    rect: IRect;
  };
}

interface SelectRectAction {
  type: ActionTypes.SELECT_RECT;
  payload: {
    rect: IRect;
    isSelected: boolean;
  };
}

interface RemoveRectAction {
  type: ActionTypes.REMOVE_RECT;
  payload: {
    rect: IRect;
  };
}

interface AddLabel {
  type: ActionTypes.ADD_LABEL;
  payload: {
    label: Partial<ILabel>;
  };
}

export type Action =
  | SetInitialDataAction
  | UpdateLabelValueAction
  | AddRectAction
  | SelectRectAction
  | RemoveRectAction
  | AddLabel;
