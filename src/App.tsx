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

function App() {
  const lumenSessionId = 'LumenSessionId';
  const [showContact, setShowContact] = useState(true);
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
  const [document, setDocument] = useState<IImage>({
    url: '/assets/sample.png',
    width: 2000,
    height: 1000,
  });
  const [display, setDisplay] = useState(2);
  useEffect(() => {
    // const sessionId = sessionStorage.getItem(lumenSessionId);
    // if (!sessionId) {
    //   setDisplay(1);
    //   return;
    // }
    // fetchData(sessionId);
    loadFromLocal();
  }, []);
  const loadFromLocal = async () => {
    const labels = await fetch(import.meta.env.VITE_API_PREFIX + 'labels').then(
      (data) => data.json()
    );
    const boundingBoxes = await fetch(
      import.meta.env.VITE_API_PREFIX + 'boundingboxes'
    ).then((data) => data.json());
    // setDocument(document);
    setLabels(labels);
    setBoundingBoxes(boundingBoxes);
  };
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
  const showUpload = () => {
    sessionStorage.removeItem(lumenSessionId);
    setShowContact(false);
    setDisplay(1);
  };

  return (
    <>
      <TopNavBar></TopNavBar>
      <Container fluid={true}>
        {display === 0 && <LoadingComponent></LoadingComponent>}
        {display === 1 && (
          <UploadComponent
            showContact={showContact}
            uploadComplete={uploadComplete}
          ></UploadComponent>
        )}
        {display === 2 && (
          <Canvas
            showUpload={showUpload}
            boundingBoxes={boundingBoxes}
            labels={labels}
            document={document}
            id={sessionStorage.getItem(lumenSessionId)}
          ></Canvas>
        )}
      </Container>
    </>
  );
}

export default App;
