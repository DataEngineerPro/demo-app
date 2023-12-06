import Slider from 'react-slick';
import { useCanvasContext } from '../canvas/context/context';
import { ChevronDown, ChevronUp } from 'react-feather';
import './thumbnail-slider.scss';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useRef } from 'react';

function ThumbnailSliderComponent({ height, pageChange }) {
  const { data } = useCanvasContext();
  
  return (
    <>
      {data && data.document && data.document.length > 0 && (
        <div className="thubmnail-slider" style={{height:height}}>
          <div className="header small my-2 mx-auto">
            <label className="mx-1">Page</label>
            <input
              type="text"
              readOnly
              disabled={true}
              value={`${data.page}`}
              style={{
                width: '5ch',
                textAlign: 'center',
              }}
            />
          </div>

          <div className="slider-container w-100">
            <div className="thumbnail-container mx-auto">
            {data.document?.map((x) => {
              return (
                <div
                  key={x.page}
                  onClick={() => pageChange(x.page)}
                  className={`d-flex align-items-center justify-content-center flex-column rounded mx-auto my-2 pointer ${
                    x.page === data.page ? 'selected-thumbnail' : ''
                  }`}
                >
                  <img src={x.url} className="img-thumbnail rounded mx-auto" />
                  <div className="page-number">{x.page}</div>
                </div>
              );
            })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ThumbnailSliderComponent;
