import { Container } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';
import { Circle } from 'react-feather';

function LabelsComponent() {
  const { data } = useCanvasContext();
  return (
    <>
      {data.labels.map((x) => (
        <div>
          <Circle fontSize="18px" color={x.color} fill={x.color}></Circle>&nbsp;
          {x.text}
        </div>
      ))}
    </>
  );
}

export default LabelsComponent;
