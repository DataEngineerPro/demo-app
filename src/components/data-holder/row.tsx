import { Edit, Save, Settings } from 'react-feather';
import { useCanvasContext } from '../canvas/context/context';
import { IRect } from '../canvas/context/contextType';
import { useState } from 'react';
import { Form } from 'react-bootstrap';

function TableRow(props: any) {
  const x: IRect = props.item;

  const [edit, setEdit] = useState(false);
  const [ocrValue, setOcrValue] = useState(x.text);
  const { data, updateValues } = useCanvasContext();

  const openSettings = (item: IRect) => {
    props.showContextMenu(item.id);
  };
  const handleKeyboard = (e) => {
    if (e.keyCode === 27) {
      setOcrValue(props.item.text);
      setEdit(false);
    }
    if (e.keyCode === 13) {
      updateRect();
    }
  };
  const handleSave = (e) => {
    updateRect();
  };
  const updateRect = async () => {
    if (ocrValue.trim().length === 0) {
      setOcrValue(x.text);
      setEdit(false);
    }
    const updatingRect = {
      ...x,
      text: 'updating',
    };
    updateValues({ rect: updatingRect });
    setEdit(false);
    const body = JSON.stringify({
      id: props.sessionId,
      coordinates: [
        {
          page_no: '1',
          left: x.rect.x,
          top: x.rect.y,
          width: x.rect.width,
          height: x.rect.height,
          label_name: data.labels.find((l) => l.id == x.label)?.text,
          comments: x.comment,
          ocr_text: ocrValue.trim(),
        },
      ],
    });
    await fetch(import.meta.env.VITE_API_PREFIX + '/api/upload_bbox_info', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: body,
    })
      .then((d) => (d.ok ? d.json() : new Error('expired Session')))
      .then(() => {
        console.log('updating values');
        updateValues({
          rect: {
            ...x,
            text: ocrValue.trim(),
          },
        });
      })
      .catch(() => {
        // props.resetSession();
      });
  };
  const enableEdit = (str: string) => {
    setOcrValue(str);
    setEdit(true);
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
                <Edit size={16} onClick={() => enableEdit(x.text)}></Edit>
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
