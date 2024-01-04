import { Button, Table } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';

import './data-holder.scss';
import SuccessModal from '../modal/success';
import { useState } from 'react';
import TableRow from './row';

function DataHolder(props: any) {
  const { data } = useCanvasContext();
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {
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
              {data.extractions &&
                data.extractions
                  .filter((x) => x.label !== -1)
                  .map((x: any) => {
                    return (
                      <TableRow
                        sessionId={props.sessionId}
                        item={x}
                        showContextMenu={props.showContextMenu}
                        key={x.id}
                        pageChange={props.pageChange}
                      ></TableRow>
                    );
                  })}
            </tbody>
          </Table>
          {data.extractions &&
            data.extractions.filter((x) => x.label !== -1).length > 0 && (
              <Button variant="success" onClick={() => setShowModal(true)}>
                Submit for Model Training
              </Button>
            )}
          <SuccessModal
            sessionId={props.sessionId}
            show={showModal}
            onHide={() => setShowModal(false)}
          />
        </>
      }
    </>
  );
}

export default DataHolder;
