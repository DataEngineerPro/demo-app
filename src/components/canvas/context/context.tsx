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
  IExtraction,
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
      extractions: Array<IExtraction>;
      labels: Array<any>;
      document: any;
      page?: number;
    }) => {
      dispatch({
        type: ActionTypes.SET_INITIAL_DATA,
        payload: {
          rects: args.rects,
          extractions: args.extractions,
          labels: args.labels,
          document: args.document,
          page: args.page || 1,
        },
      });
    },
    []
  );

  const updateValues = useCallback((args: IExtraction) => {
    dispatch({
      type: ActionTypes.UPDATE_LABEL_VALUE,
      payload: args,
    });
  }, []);

  const addRect = useCallback((args: IExtraction) => {
    dispatch({
      type: ActionTypes.ADD_RECT,
      payload: args,
    });
  }, []);

  const selectRect = useCallback(
    (args: { extraction: IExtraction; isSelected: boolean }) => {
      dispatch({
        type: ActionTypes.SELECT_RECT,
        payload: {
          extraction: args.extraction,
          isSelected: args.isSelected,
        },
      });
    },
    []
  );

  const removeRect = useCallback((args: IExtraction) => {
    dispatch({
      type: ActionTypes.REMOVE_RECT,
      payload: args,
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
