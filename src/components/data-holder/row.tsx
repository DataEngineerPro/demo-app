import { Edit, Save, Settings } from 'react-feather';
import { useCanvasContext } from '../canvas/context/context';
import { IRect } from '../canvas/context/contextType';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

function TableRow(props: any) {
  const [edit, setEdit] = useState(false);
  const [ocrValue, setOcrValue] = useState(props.item.text);
  const { data, updateValues } = useCanvasContext();
  const x = props.item;
  const openSettings = (item: IRect) => {
    props.showContextMenu(item.id);
  };
  const handleKeyboard = (e) => {
    if (e.keyCode === 27) {
      setOcrValue(props.item.text);
      setEdit(false);
    }
    if (e.keyCode === 13) {
      updateValues({
        rect: {
          ...props.item,
          text: ocrValue,
        },
      });
      setEdit(false);
    }
  };
  const handleSave = (e) => {
    updateValues({
      rect: {
        ...props.item,
        text: ocrValue,
      },
    });
    setEdit(false);
  };
  return (
    <tr key={x.id}>
      <td
        style={{
          backgroundColor:
            data?.labels?.find((l) => x.label === l.id)?.color + '19',
          whiteSpace: 'nowrap',
        }}
      >
        {data?.labels?.find((l) => x.label === l.id)?.text}
      </td>
      <td>
        <div className="text-container">
          <div className="d-flex w-100">
            {!edit && (
              <div className="d-flex flex-row justify-content-between w-100">
                {x.text}
                <Edit size={16} onClick={() => setEdit(true)}></Edit>
              </div>
            )}
            {edit && (
              <div className="d-flex flex-row justify-content-between w-100 align-items-center">
                <Form.Control
                  type="text"
                  size="sm"
                  placeholder={ocrValue}
                  value={ocrValue}
                  onChange={(e) => setOcrValue(e.target.value)}
                  onKeyDown={handleKeyboard}
                  required
                />
                <Save size={18} onClick={handleSave}></Save>
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        <div className="text-container">
          <div>{x.comment}</div>
          <small className="pointer" onClick={() => openSettings(x)}>
            <Settings className="icon" />
          </small>
        </div>
      </td>
    </tr>
  );
}

export default TableRow;
