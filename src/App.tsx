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
import { useCanvasContext } from './components/canvas/context/context';

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
      text: 'Select Label',
      color: '#00ff00',
    },
  ]);
  const [document, setDocument] = useState<IImage>({
    url: '/assets/sample.png',
    width: 2000,
    height: 2000,
  });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const sessionId = sessionStorage.getItem(lumenSessionId);
    if (!sessionId) {
      setDisplay(1);
      return;
    }
    fetchData(sessionId);
    // loadFromLocal();
  }, []);
  const loadFromLocal = async () => {
    const labels = await fetch(import.meta.env.VITE_API_PREFIX + 'labels').then(
      (data) => data.json()
    );
    const boundingBoxes = await fetch(
      import.meta.env.VITE_API_PREFIX + 'boundingboxes'
    ).then((data) => data.json());
    // setDocument();
    setLabels(
      labels.map((x: any, index: number) => {
        return {
          id: 1 + index,
          text: x.text,
          color: x.colour,
        };
      })
    );
    setBoundingBoxes(boundingBoxes);
  };
  const fetchData = async (sessionId: string) => {
    const documentData = await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/upload?id=' + sessionId
    )
      .then((data) => {
        if (data.ok) return data.json();
        throw 'newError';
      })
      .then((data) => {
        if (!data.id) {
          sessionStorage.removeItem(sessionId);
          setDisplay(1);
          return;
        }
        return {
          url: data.presigned_url,
          width: data.img_width,
          height: data.img_height,
        };
      })
      .catch(() => {
        sessionStorage.removeItem(sessionId);
        setDisplay(1);
        return;
      });
    const apilabels = await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/labels?id=' + sessionId
    ).then((data) => data.json());
    const boundingBoxes = await fetch(
      import.meta.env.VITE_API_PREFIX +
        '/api/retrive_bbox?id=' +
        sessionId +
        '&page_no=' +
        1
    ).then((data) => data.json());
    if (boundingBoxes.length > 0) {
      const newBoundingBoxes = boundingBoxes.map((x: any, index: number) => {
        return {
          rect: {
            x: x.left,
            y: x.top,
            width: x.width,
            height: x.height,
          },
          id: index,
          label: x.label ? x.label : 1,
          text: x.ocr_text,
        };
      });
      console.log(newBoundingBoxes);
      setBoundingBoxes(newBoundingBoxes);
    }
    if (apilabels.length > 0) {
      setLabels([
        ...labels,
        ...apilabels.map((x) => {
          return {
            id: x.id,
            text: x.label,
            color: x.colour,
          };
        }),
      ]);
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
            showContact={false}
            uploadComplete={uploadComplete}
          ></UploadComponent>
        )}
        {display === 2 && (
          <Canvas
            labels={labels}
            rects={boundingBoxes}
            document={document}
            showUpload={showUpload}
            id={sessionStorage.getItem(lumenSessionId)}
          ></Canvas>
        )}
      </Container>
    </>
  );
}

export default App;
