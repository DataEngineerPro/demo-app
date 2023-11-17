import Slider from 'react-slick';
import { useCanvasContext } from '../canvas/context/context';
import { ChevronDown, ChevronUp } from 'react-feather';
import './thumbnail-slider.scss';
import { Button } from 'react-bootstrap';

function ThumbnailSliderComponent() {
  const { data } = useCanvasContext();
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    arrows: false,
    beforeChange: function (currentSlide: any, nextSlide: any) {
      console.log('before change', currentSlide, nextSlide);
    },
    afterChange: function (currentSlide: any) {
      console.log('after change', currentSlide);
    },
  };
  return (
    <div>
      <div className="d-flex align-items-center justify-content-center">
        <Button variant="outline-dark" size="sm" className="shadow rounded">
          <ChevronUp size={24}></ChevronUp>
        </Button>
        <div className="m-2"></div>
        <Button variant="outline-dark" size="sm" className="shadow rounded">
          <ChevronDown size={24}></ChevronDown>
        </Button>
      </div>
      <div className="slider-container">
        <Slider {...settings}>
          <div className="selected-thumbnail d-flex align-items-center justify-content-center flex-column rounded mx-auto my-2">
            <img
              src={data.document?.url}
              className="img-thumbnail rounded mx-auto"
            />
          </div>
          <div className="d-flex align-items-center justify-content-center flex-column rounded mx-auto my-2">
            <img
              src={data.document?.url}
              className="img-thumbnail rounded mx-auto"
            />
          </div>
          <div className="d-flex align-items-center justify-content-center flex-column rounded mx-auto my-2">
            <img
              src={data.document?.url}
              className="img-thumbnail rounded mx-auto"
            />
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default ThumbnailSliderComponent;
