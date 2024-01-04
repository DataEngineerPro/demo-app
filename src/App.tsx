/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.scss';
import Canvas from './components/canvas/canvas';
import TopNavBar from './components/navbar/topnavbar';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import {
  IExtraction,
  IImage,
  ILabel,
  IRecord,
} from './components/canvas/context/contextType';
import UploadComponent from './components/upload/upload';
import LoadingComponent from './components/loading/loading';
import Workspace from './components/workspace/workspace';

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
  const [document, setDocument] = useState<Array<IImage>>([]);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const sessionId = sessionStorage.getItem(lumenSessionId);
    if (!sessionId) {
      setDisplay(1);
      return;
    }
    // fetchData(sessionId);
    fetchFromBE(sessionId);
    // loadFromLocal();
  }, []);
  const fetchFromBE = async (id: string) => {
    const recordData = await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/customer/' + id
    );
    if (!recordData.ok) {
      sessionStorage.removeItem(lumenSessionId);
      setDisplay(1);
      return;
    }
    const data: IRecord = await recordData.json();
    if (data) {
      if (data.documents) {
        const documents: IImage[] = [];
        Object.keys(data.documents).forEach((key) => {
          if (key === 'master') return;
          documents.push(data.documents[key]);
        });
        const newDocuments: IImage[] = [];
        for (const d of documents) {
          const urlReq = await fetch(
            `${import.meta.env.VITE_API_PREFIX}/api/documents/${id}/${d.page}`
          );
          const url = await urlReq.text();
          newDocuments.push({
            ...d,
            displayUrl: url,
          });
        }
        setDocument(newDocuments);
      }
      if (data.labels) {
        const label: ILabel[] = [...labels];
        Object.keys(data.labels).forEach((key) => {
          label.push({
            id: key,
            text: data.labels[key].text,
            color: data.labels[key].color,
          });
        });
        setLabels(label);
      }
      if (data.extractions) {
        const extractions: IExtraction[] = [];
        Object.keys(data.extractions).forEach((key: string) => {
          extractions.push({
            ...data.extractions[key],
            id: key,
          });
        });
        setBoundingBoxes(extractions);
      }
      setDisplay(2);
    }
  };
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
    const documentData: Array<IImage> = await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/upload/' + sessionId
    )
      .then((data) => {
        if (data.ok) return data.json();
        throw 'newError';
      })
      .then((arrData) => {
        const data = arrData[0];
        if (!data.id) {
          sessionStorage.removeItem(sessionId);
          setDisplay(1);
          return;
        }
        return arrData.map((x: any) => {
          return {
            url: x.presigned_url,
            width: x.img_width,
            height: x.img_height,
            page: x.page_no,
          };
        });
      })
      .catch(() => {
        sessionStorage.removeItem(sessionId);
        setDisplay(1);
        return;
      });
    const apilabels = await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/labels/' + sessionId
    ).then((data) => data.json());
    const boundingBoxes = await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/extractions/' + sessionId
    ).then((data) => data.json());
    const labelDataSet = [
      ...labels,
      ...apilabels.map((x, index) => {
        return {
          id: 2 + index,
          text: x.label,
          color: x.colour,
        };
      }),
    ];
    if (boundingBoxes.length > 0) {
      const newBoundingBoxes = boundingBoxes.map((x: any, index: number) => {
        return {
          rect: {
            x: x.left,
            y: x.top,
            width: x.width,
            height: x.height,
          },
          id: index + 1,
          label: x.label,
          extractedText: x.extractedText,
          userText: x.userText,
          comment: x.comments,
        };
      });
      setBoundingBoxes(newBoundingBoxes);
    }
    if (apilabels.length > 0) {
      setLabels(labelDataSet);
    }
    setDocument(documentData);
    setDisplay(2);
  };
  const uploadComplete = (id: string) => {
    sessionStorage.setItem(lumenSessionId, id);
    // fetchData(id);
    fetchFromBE(id);
  };
  const showUpload = () => {
    sessionStorage.removeItem(lumenSessionId);
    setShowContact(false);
    setDisplay(1);
  };

  const reset = () => {
    sessionStorage.removeItem(lumenSessionId);
    setDisplay(1);
  };

  return (
    <>
      <TopNavBar reset={reset}></TopNavBar>
      <Container fluid={true} className="p-0">
        {display === 0 && <LoadingComponent></LoadingComponent>}
        {display === 1 && (
          <UploadComponent
            showContact={showContact}
            uploadComplete={uploadComplete}
            contactComplete={() => setShowContact(false)}
          ></UploadComponent>
        )}
        {display === 2 && (
          <Workspace
            labels={labels}
            sessionId={sessionStorage.getItem(lumenSessionId)}
            boundingBoxes={boundingBoxes}
            images={document}
          ></Workspace>
        )}
      </Container>
    </>
  );
}

export default App;
