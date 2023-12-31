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
  ILabel,
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
    page: 0,
  });

  const setInitialData = useCallback(
    (args: {
      rects: Array<IRect>;
      labels: Array<any>;
      document: any;
      page?: number;
    }) => {
      dispatch({
        type: ActionTypes.SET_INITIAL_DATA,
        payload: {
          rects: args.rects,
          labels: args.labels,
          document: args.document,
          page: args.page || 1,
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

  const addRect = useCallback((args: { rect: IRect; text: string }) => {
    dispatch({
      type: ActionTypes.ADD_RECT,
      payload: {
        rect: args.rect,
        text: args.text,
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

  const addLabel = useCallback((args: { label: Partial<ILabel> }) => {
    dispatch({
      type: ActionTypes.ADD_LABEL,
      payload: {
        label: args.label,
      },
    });
  }, []);

  const updatePage = useCallback((args: { page: number; rects: IRect[] }) => {
    dispatch({
      type: ActionTypes.UPDATE_PAGE,
      payload: {
        page: args.page,
        rects: args.rects,
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
      addLabel,
      updatePage,
    }),
    [
      data,
      setInitialData,
      updateValues,
      addRect,
      selectRect,
      removeRect,
      addLabel,
      updatePage,
    ]
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};

export const useCanvasContext = (): CanvasContextReturnType =>
  useContext(CanvasContext);
