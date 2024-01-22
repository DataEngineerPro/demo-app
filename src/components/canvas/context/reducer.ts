/* eslint-disable @typescript-eslint/no-explicit-any */
import { Action, ActionTypes } from './actions';
import { ICanvasStateType, IExtraction, IImage, ILabel } from './contextType';

const setInitialData = (
  state: ICanvasStateType,
  payload: {
    extractions: IExtraction[];
    labels: ILabel[];
    document: IImage[];
    page: any;
  }
) => {
  return {
    ...state,
    extractions: payload.extractions,
    labels: payload.labels,
    document: payload.document,
    page: payload.page || 1,
    rects: payload.extractions.filter(
      (x) => x.document === payload.document[payload.page - 1].url
    ),
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
    rects: [...(state.rects || []), payload],
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
  const rects = state.rects.filter((item) => item.id !== payload.id);
  return {
    ...state,
    extractions: extractions,
    rects: rects,
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

const updatePage = (state: ICanvasStateType, payload: number) => {
  return {
    ...state,
    page: payload,
    rects: state.extractions.filter(
      (item) =>
        item.document === state.document?.find((x) => x.page == payload)?.url
    ),
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
