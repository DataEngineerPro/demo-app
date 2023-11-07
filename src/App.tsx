/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.scss';
import Canvas from './components/canvas/canvas';
import TopNavBar from './components/navbar/topnavbar';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { ILabel } from './components/canvas/context/contextType';

function App() {
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [labels, setLabels] = useState<Array<ILabel>>([]);
  useEffect(() => {
    const fetchData = async () => {
      const labels = await fetch('http://localhost:4444/api/labels').then(
        (data) => data.json()
      );
      const boundingBoxes = await fetch(
        'http://localhost:4444/api/boundingboxes'
      ).then((data) => data.json());
      setBoundingBoxes(
        boundingBoxes.map((x: any) => {
          return {
            rect: {
              x: x.x,
              y: x.y,
              width: x.width,
              height: x.height,
            },
            id: x.id,
            label: x.label,
            text: x.text,
          };
        })
      );
      setLabels(labels);
    };
    fetchData();
  }, []);
  return (
    <>
      <TopNavBar></TopNavBar>
      <Container>
        {boundingBoxes.length > 0 && labels.length > 0 && (
          <Canvas boundingBoxes={boundingBoxes} labels={labels}></Canvas>
        )}
      </Container>
    </>
  );
}

export default App;
