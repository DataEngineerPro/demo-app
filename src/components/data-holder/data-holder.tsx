import { Button, Table } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';
import { Settings } from 'react-feather';

import './data-holder.scss';
import { IRect } from '../canvas/context/contextType';
import SuccessModal from '../modal/success';
import { useState } from 'react';
import TableRow from './row';

function DataHolder(props: any) {
  const { data } = useCanvasContext();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {
        // data.rects && data.rects.filter((x) => x.label !== -1).length > 0 && (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Label</th>
                <th className="w-50">Predicted Value</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody>
              {data.rects &&
                data.rects
                  .filter((x) => x.label !== -1)
                  .sort((x, y) => x.id - y.id)
                  .map((x: any) => {
                    return (
                      <TableRow
                        sessionId={props.sessionId}
                        item={x}
                        showContextMenu={props.showContextMenu}
                        key={x.id}
                      ></TableRow>
                    );
                  })}
            </tbody>
          </Table>
          {data.rects &&
            data.rects.filter((x) => x.label !== -1).length > 0 && (
              <Button variant="success" onClick={() => setShowModal(true)}>
                Submit for Model Training
              </Button>
            )}
          <SuccessModal
            onSuccess={props.showUpload}
            show={showModal}
            onHide={() => setShowModal(false)}
          />
        </>
      }
      {/* {data.rects && data.rects.filter((x) => x.label !== -1).length === 0 && (
        <div className="message small">
          Please start identifying labels by drawing over the document.
        </div>
      )} */}
    </>
  );
}

export default DataHolder;
