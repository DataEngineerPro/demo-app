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
import LabelStack from '../labels/label-stack';
import ThubmnailSlider from '../thumbnail-slider/thubmnail-slider';
import { Circle, Info } from 'react-feather';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
    console.log(props);
    setInitialData({
      rects: props.boundingBoxes,
      labels: props.labels,
      document: props.document,
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
    var params = new URLSearchParams();
    params.append('id', sessionStorage.getItem(props.id));
    params.append('x', newRect.x);
    params.append('x', newRect.y);
    params.append('width', newRect.width);
    params.append('height', newRect.height);
    await fetch(import.meta.env.VITE_API_PREFIX + 'upload_bbox_info', {
      method: 'POST',
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        addRect({
          rect: {
            rect: newRect,
            text: data.text,
          },
        });
        setTempRect(null);
        setOriginalCords(null);
        setNewCords(null);
      });

    console.log(tempRect, newRect);
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

  const tooltip = (
    <Tooltip id="tooltip">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu lorem
      vitae odio ultricies ullamcorper eget eu mauris. Nulla ultricies purus non
      ornare tempor. Nam dignissim nibh et eleifend placerat. Cras tempus magna
      arcu, id congue sapien rutrum ac. Nunc commodo mattis enim, sit amet
      volutpat mi volutpat non. Nulla sit amet fringilla massa, in ultrices dui.
      Aenean gravida pellentesque fermentum. Ut egestas, mi ut suscipit laoreet,
      lorem orci euismod risus, maximus malesuada lacus est at purus. Nunc eu
      tellus justo. Mauris ultrices auctor viverra. Vivamus sit amet ligula
      metus. Ut molestie auctor consectetur.
    </Tooltip>
  );
  const handleKeyBoard = (e: any) => {
    e.preventDefault();
    if (e.keyCode === 27 && isListening) {
      setListening(false);
      setTempRect(null);
    } else if (e.keyCode === 8 && selectedRect) {
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
  };

  return (
    <>
      <div className="row">
        <div className="col-1 left-panel">
          <ThubmnailSlider></ThubmnailSlider>
        </div>
        <div
          className="ms-3 col-7 border-1 border-dark p-0"
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
                        opacity={x.label === -1 ? 1 : 0.1}
                        fillEnabled={true}
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
        <div className="col ms-3 right-panel bg-light">
          <div className="d-flex flex-row align-items-baseline">
            <h6>Identified Labels</h6>
            <OverlayTrigger placement="right" overlay={tooltip}>
              <div className="px-1">
                <Info size={16} fill="black" color="white"></Info>
              </div>
            </OverlayTrigger>
          </div>
          <div className="data-holder">
            <DataHolder
              showUpload={props.showUpload}
              showContextMenu={showContextMenu}
            />
          </div>
          <div className="label-holder">
            <div className="d-flex flex-row align-items-baseline">
              <h6>Labels Legend</h6>
              <OverlayTrigger placement="right" overlay={tooltip}>
                <div className="px-1">
                  <Info size={16} fill="black" color="white"></Info>
                </div>
              </OverlayTrigger>
            </div>
            <LabelStack />
          </div>
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
