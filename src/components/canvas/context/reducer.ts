/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionTypes } from './actions';
import { ICanvasStateType, ILabel, IRect } from './contextType';

const setInitialData = (
  state: ICanvasStateType,
  payload: { rects: IRect[]; labels: ILabel[]; document: any }
) => {
  return {
    ...state,
    rects: payload.rects,
    labels: payload.labels,
    document: payload.document,
    nextRectId: payload.rects.length + 1,
  };
};

const updateValues = (state: ICanvasStateType, payload: { rect: IRect }) => {
  return {
    ...state,
    rects: [
      ...state.rects.filter((x) => x.id !== payload.rect.id),
      payload.rect,
    ],
  };
};

const addRect = (
  state: ICanvasStateType,
  payload: { rect: IRect; text: string }
) => {
  const { rect, text } = payload;
  if (
    !rect ||
    !rect.rect ||
    !rect.rect.x ||
    !rect.rect.y ||
    !rect.rect.width ||
    !rect.rect.height
  )
    return state;
  return {
    ...state,
    rects: [
      ...state.rects,
      {
        rect: rect.rect,
        id: state.nextRectId,
        isSelected: false,
        label: 1,
        text: '',
        comment: '',
      },
    ],
    nextRectId: state.nextRectId + 1,
  };
};

const selectRect = (
  state: ICanvasStateType,
  payload: { rect: IRect; isSelected: boolean }
) => {
  const { rect, isSelected } = payload;
  const index = state.rects.findIndex((item) => item.id === rect.id);
  const rects = [...state.rects];
  if (!rects[index]) return state;
  rects[index].isSelected = isSelected;
  return {
    ...state,
    rects,
  };
};

const removeRect = (state: ICanvasStateType, payload: { rect: IRect }) => {
  const { rect } = payload;
  const newRects = state.rects.filter((item) => item.id !== rect.id);
  return {
    ...state,
    rects: newRects,
  };
};

const addLabel = (
  state: ICanvasStateType,
  payload: { label: Partial<ILabel> }
) => {
  return {
    ...state,
    labels: [
      ...state.labels,
      {
        id: state.labels.length + 1,
        color: payload.label.color,
        text: payload.label.text,
      },
    ],
  };
};

export const reducer = (state: ICanvasStateType, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_INITIAL_DATA:
      return setInitialData(state, action.payload);
    case ActionTypes.UPDATE_LABEL_VALUE:
      return updateValues(state, action.payload);
    case ActionTypes.ADD_RECT:
      return addRect(state, action.payload);
    case ActionTypes.SELECT_RECT:
      return selectRect(state, action.payload);
    case ActionTypes.REMOVE_RECT:
      return removeRect(state, action.payload);
    case ActionTypes.ADD_LABEL:
      return addLabel(state, action.payload);
    default:
      return state;
  }
};
