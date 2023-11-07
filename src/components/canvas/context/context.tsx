/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import {
  CanvasContextProviderProps,
  CanvasContextReturnType,
  IRect,
} from './contextType';
import { reducer } from './reducer';
import { ActionTypes } from './actions';

const CanvasContext = createContext<any>({});

export const CanvasContextProvider: FC<CanvasContextProviderProps> = ({
  children,
}) => {
  const [data, dispatch] = useReducer(reducer, {
    rects: [],
    labels: [],
    document: null,
  });

  const setInitialData = useCallback(
    (args: { rects: Array<IRect>; labels: Array<any>; document: any }) => {
      dispatch({
        type: ActionTypes.SET_INITIAL_DATA,
        payload: {
          rects: args.rects,
          labels: args.labels,
          document: args.document,
        },
      });
    },
    []
  );

  const updateValues = useCallback((args: { rect: IRect }) => {
    dispatch({
      type: ActionTypes.UPDATE_LABEL_VALUE,
      payload: {
        rect: args.rect,
      },
    });
  }, []);

  const addRect = useCallback((args: { rect: IRect }) => {
    dispatch({
      type: ActionTypes.ADD_RECT,
      payload: {
        rect: args.rect,
      },
    });
  }, []);

  const selectRect = useCallback((args: { rect: any; isSelected: boolean }) => {
    dispatch({
      type: ActionTypes.SELECT_RECT,
      payload: {
        rect: args.rect,
        isSelected: args.isSelected,
      },
    });
  }, []);

  const removeRect = useCallback((args: { rect: IRect }) => {
    dispatch({
      type: ActionTypes.REMOVE_RECT,
      payload: {
        rect: args.rect,
      },
    });
  }, []);

  const value = useMemo(
    () => ({
      data,
      setInitialData,
      updateValues,
      addRect,
      selectRect,
      removeRect,
    }),
    [data, setInitialData, updateValues, addRect, selectRect, removeRect]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};

export const useCanvasContext = (): CanvasContextReturnType =>
  useContext(CanvasContext);
