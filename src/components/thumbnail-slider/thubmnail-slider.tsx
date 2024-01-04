import { useEffect } from 'react';
import { useCanvasContext } from '../canvas/context/context';
import './thumbnail-slider.scss';

function ThumbnailSliderComponent({ height, pageChange, page }) {
  console.log('Page==>', page);
  const { data } = useCanvasContext();

  useEffect(() => {
    const top =
      document.querySelector(`#thumb-page-${data.page}`)?.offsetTop - 250;

    console.log('Top==>', top);

    document.querySelector('.slider-container').scrollTop = top;
  }, [data]);

  return (
    <>
      {data && data.document && data.document.length > 0 && (
        <div className="thubmnail-slider" style={{ height: height }}>
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
                    id={`thumb-page-${x.page}`}
                    key={x.page}
                    onClick={() => pageChange(x.page)}
                    className={`d-flex align-items-center justify-content-center flex-column rounded mx-auto my-2 pointer ${
                      x.page === data.page ? 'selected-thumbnail' : ''
                    }`}
                  >
                    <img
                      src={x.displayUrl}
                      className="img-thumbnail rounded mx-auto"
                    />
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
