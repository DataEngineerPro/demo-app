/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage, Rect, Image } from 'react-konva';
import 'konva/lib/shapes/Rect';
import useImage from 'use-image';
import { CanvasContextProvider, useCanvasContext } from './context/context';
import { IRect } from './context/contextType';
import ActionCard from '../action-card/card';
import './canvas.scss';
import DataHolder from '../data-holder/data-holder';
import LabelsComponent from '../labels/labels';

function Canvas(props: any) {
  const divRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [divHeight, setDivHeight] = useState<number>(0);
  const [aspectWidth, setAspectWidth] = useState(1);
  const [aspectHeight, setAspectHeight] = useState(1);
  const { data, setInitialData, addRect, selectRect, removeRect } =
    useCanvasContext();

  useEffect(() => {
    setInitialData({
      rects: props.boundingBoxes,
      labels: props.labels,
      document: {
        url: '/assets/sample.png',
        width: 2550,
        height: 3301,
      },
    });
  }, []);

  useEffect(() => {
    if (!divRef.current || !data.document?.width || !data.document.height)
      return;
    setDivWidth(Math.round(divRef.current?.offsetWidth - 2));
    setDivHeight(Math.round((divRef.current?.offsetWidth - 2) * 1.414));
    setAspectWidth(
      Math.round(divRef.current?.offsetWidth - 2) / data.document?.width
    );
    setAspectHeight(
      (Math.round(divRef.current?.offsetWidth - 2) * 1.414) /
        data.document?.height
    );
  }, [divRef.current, data.document]);
  const [image] = useImage(data.document?.url);
  const [tempRect, setTempRect] = useState<any>(null);
  const [originalCords, setOriginalCords] = useState<any>(null);
  const [newCords, setNewCords] = useState<any>(null);
  const [isListening, setListening] = useState<boolean>(false);
  const [selectedRect, setSelectedRect] = useState<IRect | null>(null);
  const [contextRect, setContextRect] = useState<IRect | null>(null);

  const mousedown = (e: any) => {
    e.evt.preventDefault();
    if (e.evt.button !== 0) return;
    setListening(true);
    setOriginalCords({
      x: e.currentTarget.getPointerPosition().x,
      y: e.currentTarget.getPointerPosition().y,
    });
    setNewCords({
      x: e.currentTarget.getPointerPosition().x,
      y: e.currentTarget.getPointerPosition().y,
    });
  };
  const mouseup = (e: any) => {
    e.evt.preventDefault();
    setListening(false);
    if (!tempRect) return;
    const newRect = {
      x: tempRect.x / aspectWidth,
      width: tempRect.width / aspectWidth,
      y: tempRect.y / aspectHeight,
      height: tempRect.height / aspectHeight,
    };
    addRect({
      rect: {
        rect: newRect,
      },
    });
    console.log(tempRect, newRect);
    setTempRect(null);
    setOriginalCords(null);
    setNewCords(null);
  };
  const mousemove = (e: any) => {
    e.evt.preventDefault();
    if (!isListening) return;
    setNewCords({
      x: e.currentTarget.getPointerPosition().x,
      y: e.currentTarget.getPointerPosition().y,
    });
    setTempRect({
      x: Math.min(originalCords.x, newCords.x),
      y: Math.min(originalCords.y, newCords.y),
      width: Math.abs(originalCords.x - newCords.x),
      height: Math.abs(originalCords.y - newCords.y),
    });
  };

  const handleRectClick = (e: any, newRect?: IRect) => {
    e.evt.preventDefault();
    divRef.current?.focus();
    if (e.evt.button !== 0) return;
    e.cancelBubble = true;
    if (newRect && !selectedRect) {
      setSelectedRect(newRect);
      selectRect({ rect: newRect, isSelected: true });
      showContextMenu(newRect.id);
    } else if (newRect && selectedRect && newRect.id !== selectedRect.id) {
      selectRect({ rect: selectedRect, isSelected: false });
      setSelectedRect(newRect);
      selectRect({ rect: newRect, isSelected: true });
      showContextMenu(newRect.id);
    } else if (!newRect && selectedRect) {
      selectRect({ rect: selectedRect, isSelected: false });
      setSelectedRect(null);
    }
  };

  const handleRightClick = (e: any) => {
    e.evt.preventDefault();
    if (e.target === Stage) {
      return;
    }
    // const currentShape = e.target;
    showContextMenu(e.target.attrs.id);
  };

  const showContextMenu = (id: number) => {
    const selectedbox = id && data.rects?.find((x) => x.id === id);
    if (!selectedbox || !selectedbox.rect) return;
    setContextRect(null);
    setTimeout(() => {
      setContextRect(selectedbox);
      // show menu
      if (menuRef.current && divRef.current) {
        menuRef.current.style.display = 'initial';
        menuRef.current.style.top =
          divRef.current.offsetTop +
          selectedbox?.rect?.y * aspectHeight +
          4 +
          'px';
        menuRef.current.style.left =
          divRef.current.offsetLeft +
          selectedbox?.rect?.x * aspectWidth +
          selectedbox?.rect?.width * aspectWidth +
          4 +
          'px';
      }
    }, 300);
  };

  const handleKeyBoard = (e: any) => {
    e.preventDefault();
    if (e.keyCode === 27 && isListening) {
      setListening(false);
      setTempRect(null);
    } else if (e.keyCode === 8 && selectedRect) {
      removeRect({ rect: selectedRect });
      setSelectedRect(null);
    }
  };

  const closeContext = () => {
    if (selectedRect) {
      selectRect({ rect: selectedRect, isSelected: false });
      setSelectedRect(null);
    }
    setContextRect(null);
  };

  return (
    <>
      <div className="row">
        <div
          className="col-6 border-1 border-dark p-0"
          ref={divRef}
          onKeyDown={handleKeyBoard}
          onKeyUp={handleKeyBoard}
          tabIndex={0}
          style={{ borderStyle: 'solid' }}
        >
          {divHeight > 0 && divWidth > 0 && (
            <Stage
              width={divWidth}
              height={divHeight}
              onMouseDown={mousedown}
              onMouseUp={mouseup}
              onMouseMove={mousemove}
              onClick={(e: any) => {
                handleRectClick(e);
              }}
              onContextMenu={handleRightClick}
            >
              <Layer>
                <Image
                  image={image}
                  width={divWidth}
                  height={divHeight}
                ></Image>
                {tempRect && (
                  <Rect
                    key={tempRect.x}
                    x={tempRect.x}
                    y={tempRect.y}
                    width={tempRect.width}
                    height={tempRect.height}
                    stroke="red"
                    shadowBlur={2}
                    dash={[2, 2]}
                  />
                )}
                {data.rects &&
                  data.rects.map((x: any) => {
                    return (
                      <Rect
                        key={x.id}
                        x={x.rect.x * aspectWidth}
                        y={x.rect.y * aspectHeight}
                        width={x.rect.width * aspectWidth}
                        height={x.rect.height * aspectHeight}
                        fill={data.labels.find((l) => x.label === l.id).color}
                        opacity={x.isSelected || x.label === -1 ? 1 : 0.1}
                        fillEnabled={!x.isSelected}
                        shadowBlur={2}
                        dash={[2, 2]}
                        stroke={data.labels.find((l) => x.label === l.id).color}
                        dashEnabled={x.isSelected}
                        id={x.id}
                        onClick={(e: any) => handleRectClick(e, x)}
                      />
                    );
                  })}
              </Layer>
            </Stage>
          )}
        </div>
        <div className="col-6 col-offset-1">
          <h3>Reference Table</h3>
          <DataHolder showContextMenu={showContextMenu} />

          <h3>Labels Legend</h3>
          <LabelsComponent></LabelsComponent>
        </div>
        <div className="menu" ref={menuRef}>
          {contextRect && (
            <ActionCard rect={contextRect} close={closeContext}></ActionCard>
          )}
        </div>
      </div>
    </>
  );
}

const withCanvasContext = (Component: React.FC<any>) => {
  return (props: any) => (
    <CanvasContextProvider>
      <Component {...props} />
    </CanvasContextProvider>
  );
};

export default withCanvasContext(Canvas);
