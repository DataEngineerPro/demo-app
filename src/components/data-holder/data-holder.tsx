import { Table } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';
import { Settings } from 'react-feather';

import './data-holder.scss';
import { IRect } from '../canvas/context/contextType';

function DataHolder(props: any) {
  const { data, selectRect } = useCanvasContext();
  const openSettings = (item: IRect) => {
    props.showContextMenu(item.id);
  };
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Label</th>
          <th>Predicted Value</th>
        </tr>
      </thead>
      <tbody>
        {data.rects
          .filter((x) => x.label !== -1)
          .map((x: any) => {
            return (
              <tr key={x.id}>
                <td
                  style={{
                    backgroundColor:
                      data?.labels?.find((l) => x.label === l.id)?.color + '19',
                  }}
                >
                  {data?.labels?.find((l) => x.label === l.id)?.text}
                </td>
                <td>
                  <div className="text-container">
                    {x.text}
                    <small className="pointer" onClick={() => openSettings(x)}>
                      <Settings className="icon" />
                    </small>
                  </div>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
}

export default DataHolder;
