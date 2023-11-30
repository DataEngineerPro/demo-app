import useImage from 'use-image';
import { Image } from 'react-konva';

const CanvasImage = ({ image, width, height }) => {
  console.log(image, width, height);
  const imgElement = useImage(image);
  return <Image image={imgElement} width={width} height={height} />;
};

export default CanvasImage;
