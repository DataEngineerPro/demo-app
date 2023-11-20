import { Button, Table } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';
import { Settings } from 'react-feather';

import './data-holder.scss';
import { IRect } from '../canvas/context/contextType';
import SuccessModal from '../modal/success';
import { useState } from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

function DataHolder(props: any) {
  const { data } = useCanvasContext();
  const [showModal, setShowModal] = useState(false);
  const columns: GridColDef[] = [
    {
      field: 'label',
      headerName: 'Label',
      valueGetter: (params: GridValueGetterParams) => {
        console.log(params.row);
        return data?.labels?.find((l) => l.id === params.row.label)?.text;
      },
    },
    { field: 'text', headerName: 'Predicted Value', flex: 1 },
    { field: 'comment', headerName: 'Comments', flex: 1 },
  ];
  const openSettings = (item: IRect) => {
    props.showContextMenu(item.id);
  };
  console.log('Data holder=>', data.rects);
  return (
    <>
      {
        // data.rects && data.rects.filter((x) => x.label !== -1).length > 0 && (
        <>
          <DataGrid rows={data.rects} columns={columns} hideFooter={true} />
          {/* <Table striped bordered hover>
            <thead>
              <tr>
                <th>Label</th>
                <th>Predicted Value</th>
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
                      <tr key={x.id}>
                        <td
                          style={{
                            backgroundColor:
                              data?.labels?.find((l) => x.label === l.id)
                                ?.color + '19',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {data?.labels?.find((l) => x.label === l.id)?.text}
                        </td>
                        <td>
                          <div className="text-container">
                            <div>{x.text}</div>
                          </div>
                        </td>
                        <td>
                          <div className="text-container">
                            <div>{x.comment}</div>
                            <small
                              className="pointer"
                              onClick={() => openSettings(x)}
                            >
                              <Settings className="icon" />
                            </small>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table> */}

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
