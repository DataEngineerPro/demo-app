/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.scss';
import Canvas from './components/canvas/canvas';
import TopNavBar from './components/navbar/topnavbar';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { IImage, ILabel } from './components/canvas/context/contextType';
import UploadComponent from './components/upload/upload';
import LoadingComponent from './components/loading/loading';
import ContactForm from './components/contact/contact';

function App() {
  const lumenSessionId = 'LumenSessionId';
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [labels, setLabels] = useState<Array<ILabel>>([
    {
      id: -1,
      color: '#000000',
      text: 'REDACT',
    },
    {
      id: 0,
      text: 'Processing',
      color: '#ff0000',
    },
    {
      id: 1,
      text: 'Ready To Label',
      color: '#00ff00',
    },
  ]);
  const [document, setDocument] = useState<IImage>();
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const sessionId = sessionStorage.getItem(lumenSessionId);
    if (!sessionId) {
      setDisplay(1);
      return;
    }
    fetchData(sessionId);
  }, []);
  const fetchData = async (sessionId: string) => {
    const documentData = await fetch(
      import.meta.env.VITE_API_PREFIX + 'upload?id=' + sessionId
    )
      .then((data) => data.json())
      .then((data) => {
        return {
          url: data.presigned_url,
          width: data.img_width,
          height: data.img_height,
        };
      });
    const labels = await fetch(
      import.meta.env.VITE_API_PREFIX + 'labels?id=' + sessionId
    ).then((data) => data.json());
    const boundingBoxes = await fetch(
      import.meta.env.VITE_API_PREFIX + 'retrive_bbox?id=' + sessionId
    ).then((data) => data.json());
    if (boundingBoxes.length > 0) {
      setBoundingBoxes(
        boundingBoxes.map((x: any, index: number) => {
          return {
            rect: {
              x: x.x,
              y: x.y,
              width: x.width,
              height: x.height,
            },
            id: x.id + '-' + index,
            label: x.label,
            text: x.text,
          };
        })
      );
    }
    if (labels.length > 0) {
      setLabels((prev) => [...prev, labels]);
    }
    setDocument(documentData);
    setDisplay(2);
  };
  const uploadComplete = (id: string) => {
    sessionStorage.setItem(lumenSessionId, id);
    fetchData(id);
  };

  return (
    <>
      <TopNavBar></TopNavBar>
      <Container>
        {display === 0 && <LoadingComponent></LoadingComponent>}
        {display === 1 && (
          <UploadComponent uploadComplete={uploadComplete}></UploadComponent>
        )}
        {display === 2 && (
          <Canvas
            boundingBoxes={boundingBoxes}
            labels={labels}
            document={document}
          ></Canvas>
        )}
      </Container>
    </>
  );
}

export default App;
