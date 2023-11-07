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

const addRect = (state: ICanvasStateType, payload: { rect: IRect }) => {
  const { rect } = payload;
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
        id: state.rects.length + 1,
        isSelected: false,
        label: 0,
        text: '',
      },
    ],
  };
};

const selectRect = (
  state: ICanvasStateType,
  payload: { rect: IRect; isSelected: boolean }
) => {
  const { rect, isSelected } = payload;
  const index = state.rects.findIndex((item) => item.id === rect.id);
  const rects = [...state.rects];
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
    default:
      return state;
  }
};
