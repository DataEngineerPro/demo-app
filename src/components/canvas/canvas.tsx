/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import { Layer, Stage, Rect, Image } from 'react-konva';
import 'konva/lib/shapes/Rect';
import useImage from 'use-image';
import { useCanvasContext } from './context/context';
import { IRect } from './context/contextType';
import ActionCard from '../action-card/card';
import './canvas.scss';

function Canvas(props: any) {
  console.log(props);
  const divRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number>(0);
  const [divHeight, setDivHeight] = useState<number>(0);
  const [aspectWidth, setAspectWidth] = useState(1);
  const [aspectHeight, setAspectHeight] = useState(1);
  const { data, addRect, selectRect, removeRect } = useCanvasContext();

  useEffect(() => {
    if (!divRef.current || !props.document?.width || !props.document.height)
      return;
    const aspectRatio = props.document.height / props.document.width;
    const docWidth = Math.round(divRef.current?.offsetWidth - 2);
    const docHeight = Math.round((divRef.current?.offsetWidth - 2) * aspectRatio);
    setDivWidth(docWidth);
    setDivHeight(docHeight);
    props.updateHeight(docHeight);
    setAspectWidth(
      docWidth / props.document?.width);
    setAspectHeight(
      docHeight / props.document?.height
    );
  }, [divRef.current, props.document]);
  const [image] = useImage(props.document?.url);
  console.log('IMAGE==>', image, props.document?.url);
  const [tempRect, setTempRect] = useState<any>(null);
  const [originalCords, setOriginalCords] = useState<any>(null);
  const [newCords, setNewCords] = useState<any>(null);
  const [isListening, setListening] = useState<boolean>(false);
  const [selectedRect, setSelectedRect] = useState<IRect | null>(null);
  const [contextRect, setContextRect] = useState<IRect | null>(null);
  const [listenToStateChange, setListenToStateChange] = useState(false);

  useEffect(() => {
    if (listenToStateChange) {
      setListenToStateChange(false);
      showContextMenu(data.rects[data.rects.length - 1].id);
    }
  }, [data]);
  useEffect(()=>{
    divRef.current?.scrollTo(0,0)
  },[props.image])
  useEffect(() => {
    if (!props.openContextMenu) return;
    showContextMenu(props.openContextMenu);
  }, [props.openContextMenu]);
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
  const mouseup = async (e: any) => {
    e.evt.preventDefault();
    setListening(false);
    if (!tempRect) return;
    const newRect = {
      x: tempRect.x / aspectWidth,
      width: tempRect.width / aspectWidth,
      y: tempRect.y / aspectHeight,
      height: tempRect.height / aspectHeight,
    };
    addNewRect(newRect, '');

    console.log(tempRect, newRect);
  };
  const addNewRect = (rect: any, text: string) => {
    console.log(rect, text);
    addRect({
      rect: {
        rect: rect,
      },
      text: 'text',
    });
    setListenToStateChange(true);
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
    } else if (newRect && selectedRect && newRect.id === selectedRect.id) {
      selectRect({ rect: selectedRect, isSelected: true });
      setSelectedRect(null);
      showContextMenu(selectedRect.id);
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
      console.log("Selected Box=>", selectedbox, aspectHeight, aspectWidth);
      // show menu
      if (menuRef.current && divRef.current) {
        menuRef.current.style.display = 'initial';
        menuRef.current.style.top =
          selectedbox?.rect?.y * aspectHeight +
          4 + 'px';
        menuRef.current.style.left =
          selectedbox?.rect?.x * aspectWidth +
          selectedbox?.rect?.width * aspectWidth +
          4 +
          'px';
      }
      menuRef.current?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }, 300);
  };

  const handleKeyBoard = (e: any) => {
    e.preventDefault();
    if (e.keyCode === 27 && isListening) {
      setListening(false);
      setTempRect(null);
    } else if (e.keyCode === 8 && selectedRect) {
      const body = {
        id: props.id,
        coordinates: [
          {
            page_no: data.page,
            left: selectedRect.rect.x,
            top: selectedRect.rect.y,
            width: selectedRect.rect.width,
            height: selectedRect.rect.height,
          },
        ],
      };
      fetch(import.meta.env.VITE_API_PREFIX + '/api/delete_bbox', {
        method: 'DELETE',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(body),
      });

      removeRect({ rect: selectedRect });
      setSelectedRect(null);
      setContextRect(null);
    }
  };

  const closeContext = () => {
    if (selectedRect) {
      selectRect({ rect: selectedRect, isSelected: false });
      setSelectedRect(null);
    }
    setContextRect(null);
    props.closeContextMenu();
  };

  return (
    <>
      {data && (
        <>
          <div
            ref={divRef}
            onKeyDown={handleKeyBoard}
            onKeyUp={handleKeyBoard}
            tabIndex={0}
            className='position-relative'
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
                      console.log(
                        x.rect.x * aspectWidth,
                        x.rect.y * aspectHeight,
                        x.rect.width * aspectWidth,
                        x.rect.height * aspectHeight
                      );
                      return (
                        <Rect
                          key={x.id}
                          x={x.rect.x * aspectWidth}
                          y={x.rect.y * aspectHeight}
                          width={x.rect.width * aspectWidth}
                          height={x.rect.height * aspectHeight}
                          fill={
                            data.labels.find((l) => x.label === l.id)?.color
                          }
                          opacity={x.label === -1 ? 1 : 0.1}
                          fillEnabled={true}
                          shadowBlur={2}
                          dash={[2, 2]}
                          stroke={
                            data.labels.find((l) => x.label === l.id)?.color
                          }
                          dashEnabled={x.isSelected}
                          id={x.id}
                          onClick={(e: any) => handleRectClick(e, x)}
                        />
                      );
                    })}
                </Layer>
              </Stage>
            )}
            <div className="menu" ref={menuRef} tabIndex={0}>
              {contextRect && (
                <ActionCard
                  rect={contextRect}
                  close={closeContext}
                  sessionId={props.id}
                ></ActionCard>
              )}
            </div>
          </div>



        </>
      )}
    </>
  );
}

export default Canvas;
