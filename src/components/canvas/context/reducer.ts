/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionTypes } from './actions';
import { ICanvasStateType, IExtraction, ILabel, IRect } from './contextType';

const setInitialData = (
  state: ICanvasStateType,
  payload: {
    rects: IRect[];
    extractions: IExtraction[];
    labels: ILabel[];
    document: any;
    page?: number;
  }
) => {
  return {
    ...state,
    rects: payload.rects,
    extractions: payload.extractions,
    labels: payload.labels,
    document: payload.document,
    nextRectId: payload.rects.length + 1,
    page: payload.page || 1,
  };
};

const updateValues = (state: ICanvasStateType, payload: IExtraction) => {
  return {
    ...state,
    extractions: state.extractions.map((item) =>
      item.id === payload.id || item.id === payload.tempId
        ? { ...item, ...payload }
        : item
    ),
  };
};

const addRect = (state: ICanvasStateType, payload: IExtraction) => {
  if (
    !payload ||
    !payload.left ||
    !payload.top ||
    !payload.width ||
    !payload.height
  )
    return state;
  return {
    ...state,
    extractions: [...(state.extractions || []), payload],
  };
};

const selectRect = (
  state: ICanvasStateType,
  payload: { extraction: IExtraction; isSelected: boolean }
) => {
  const { extraction, isSelected } = payload;
  const index = state.extractions.findIndex(
    (item) => item.id === extraction.id
  );
  const extractions = [...state.extractions];
  if (!extractions[index]) return state;
  extractions[index].isSelected = isSelected;
  return {
    ...state,
    extractions,
  };
};

const removeRect = (state: ICanvasStateType, payload: IExtraction) => {
  const extractions = state.extractions.filter(
    (item) => item.id !== payload.id
  );
  return {
    ...state,
    extractions: extractions,
  };
};

const addLabel = (
  state: ICanvasStateType,
  payload: { label: Partial<ILabel> }
) => {
  return {
    ...state,
    labels: [...state.labels, payload.label],
  };
};

const updatePage = (
  state: ICanvasStateType,
  payload: { page: number; rects: IRect[] }
) => {
  return {
    ...state,
    page: payload.page,
    rects: payload.rects,
    nextRectId: payload.rects.length + 1,
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
    case ActionTypes.UPDATE_PAGE:
      return updatePage(state, action.payload);
    default:
      return state;
  }
};
