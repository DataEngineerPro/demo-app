import { Edit, Save, XCircle, Settings } from 'react-feather';
import { useCanvasContext } from '../canvas/context/context';
import { IExtraction, IRect } from '../canvas/context/contextType';
import { useState } from 'react';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

function TableRow(props: any) {
  const x: IExtraction = props.item;

  const [edit, setEdit] = useState(false);
  const [ocrValue, setOcrValue] = useState(
    x?.id.indexOf('temp') > -1 ? 'updating...' : x.userText || x.extractedText
  );
  const { data, updateValues } = useCanvasContext();

  const openSettings = (item: IExtraction) => {
    const pageId = data.document?.find((x) => x.url === item.document)?.page;
    console.log('Page==>', pageId);
    props.pageChange(pageId);
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
      setOcrValue(x.userText || x.extractedText);
      setEdit(false);
    }
    const updatingRect = {
      ...x,
      userText: 'updating',
    };
    updateValues(updatingRect);
    setEdit(false);
    const body = JSON.stringify({
      ...x,
      userText: ocrValue.trim(),
    });
    await fetch(
      import.meta.env.VITE_API_PREFIX +
        '/api/extractions/' +
        props.sessionId +
        '/' +
        x.id,
      {
        method: 'PUT',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: body,
      }
    )
      .then((d) => (d.ok ? d.json() : new Error('expired Session')))
      .then((d) => {
        updateValues({
          ...x,
          ...d.Attributes.extractions[x.id],
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
            data?.labels?.find((l) => x.label == l.id)?.color + '19',
          whiteSpace: 'nowrap',
        }}
      >
        {data?.labels?.find((l) => x.label == l.id)?.text}
      </td>
      <td>
        <div className="text-container">
          <div className="d-flex w-100">
            {!edit && (
              <div className="d-flex flex-row justify-content-between w-100">
                {ocrValue}
                {x.id.indexOf('temp') === -1 && (
                  <small
                    className="pointer"
                    onClick={() => enableEdit(ocrValue)}
                  >
                    <Edit className="icon" size={16}></Edit>
                  </small>
                )}
              </div>
            )}
            {edit && (
              <div className="d-flex flex-row justify-content-between w-100 align-items-center">
                {/* <Form.Control
                  type="text"
                  size="sm"
                  placeholder={ocrValue}
                  value={ocrValue}
                  onChange={(e) => setOcrValue(e.target.value)}
                  onKeyDown={handleKeyboard}
                  required
                  
                /> */}
                <TextareaAutosize
                  minRows={3}
                  onChange={(e) => setOcrValue(e.target.value)}
                  onKeyDown={handleKeyboard}
                  value={ocrValue}
                  className="form-control form-control-sm"
                  required
                />
                <div>
                  <small className="pointer" onClick={handleSave}>
                    <Save className="icon" size={18}></Save>
                  </small>
                  <small
                    className="pointer"
                    onClick={() => {
                      setOcrValue(x.userText || x.extractedText);
                      setEdit(false);
                    }}
                  >
                    <XCircle className="icon" size={18}></XCircle>
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
      <td>
        <div className="text-container">
          <div>{x.comments}</div>
          {x.id.indexOf('temp') === -1 && (
            <small className="pointer" onClick={() => openSettings(x)}>
              <Settings className="icon" />
            </small>
          )}
        </div>
      </td>
    </tr>
  );
}

export default TableRow;
