import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useCanvasContext } from '../canvas/context/context';
import { useEffect, useState } from 'react';
import './card.scss';
import { CardBody, CardText } from 'react-bootstrap';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

function ActionCard(props: any) {
  console.log('Card props', props);
  if (!props) return;
  const { data, updateValues } = useCanvasContext();
  const { removeRect } = useCanvasContext();
  const [textValue, setTextValue] = useState<string>(
    props.extraction.comments || ''
  );
  const [predictedValue] = useState(
    props.extraction.userText || props.extraction.extractedText || ''
  );
  const [labelValue, setLabelValue] = useState(props.extraction.label);
  const callApi = async (newRect: any, label: string, comment: string) => {
    const itemId = newRect.id.indexOf('temp') === -1 ? newRect.id : null;
    const body = JSON.stringify({
      document: data.document?.filter((x) => x.page === data.page)[0].url,
      left: newRect.left,
      top: newRect.top,
      width: newRect.width,
      height: newRect.height,
      label: label,
      comments: comment,
    });
    const url = `${import.meta.env.VITE_API_PREFIX}/api/extractions/${
      props.sessionId
    }${itemId ? '/' + itemId : ''}`;
    await fetch(url, {
      method: itemId ? 'PUT' : 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: body,
    })
      .then(async (res) => {
        if (!res.ok) {
          removeRect(newRect);
          return;
        }
        const d = await res.json();
        if (newRect.id.indexOf('temp') > -1) {
          newRect.tempId = '' + newRect.id;
          newRect.id = Object.keys(d.Attributes.extractions)[0];
        }
        console.log('Extraction', d);
        updateValues({
          ...props.extraction,
          ...d.Attributes.extractions[newRect.id],
          comments: textValue.trim(),
          label: labelValue,
        });
      })
      .catch(() => {
        props.resetSession();
      });
  };
  const update = async () => {
    updateValues({
      ...props.extraction,
      comments: textValue.trim(),
      label: labelValue,
      text: predictedValue || 'Updating...',
    });
    props.close();
    callApi(props.extraction, labelValue, textValue.trim());
  };
  const deleteRect = () => {
    fetch(
      import.meta.env.VITE_API_PREFIX +
        '/api/extractions/' +
        props.sessionId +
        '/' +
        props.extraction.id,
      {
        method: 'DELETE',
        headers: new Headers({ 'content-type': 'application/json' }),
      }
    ).then(() => {
      removeRect(props.extraction);
      props.close();
    });
  };
  const labelChange = (e: any) => {
    setLabelValue(e.target.value);
  };
  const clickListener = (e: any) => {
    props.close();
  };
  const keyBoardListener = (e: any) => {
    if (e.target.tagName === 'TEXTAREA') {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    if (e.keyCode === 27) props.close();
  };
  useEffect(() => {
    addEventListener('click', clickListener, false);
    addEventListener('keydown', keyBoardListener, false);

    return () => {
      removeEventListener('click', clickListener, false);
      removeEventListener('keydown', keyBoardListener, false);
    };
  }, []);
  const stop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <Card style={{ width: '18rem' }} onClick={stop}>
      {typeof props.extraction.label === 'string' && (
        <Card.Body>
          <Card.Text>
            <Form.Label htmlFor="select">Label</Form.Label>
            <Form.Select
              id="select"
              aria-label="Please select label"
              defaultValue={labelValue}
              onChange={labelChange}
              required
            >
              {data.labels
                .filter((x) => x.id !== 0)
                .map((x) => {
                  const isDisabled =
                    data.extractions.findIndex((e) => e.label === x.id) > -1;
                  return (
                    <option
                      key={x.text}
                      value={x.id}
                      disabled={x.id == 1 || isDisabled}
                    >
                      {x.text}
                      {isDisabled && ' (Used)'}
                    </option>
                  );
                })}
            </Form.Select>
            <Form.Label htmlFor="inputPassword5">Comments</Form.Label>
            <TextareaAutosize
              minRows={2}
              value={textValue}
              maxLength={25}
              onChange={(e) => setTextValue(e.target.value)}
              disabled={labelValue == 0}
              className="form-control"
            />
          </Card.Text>
          <Button
            variant={labelValue == 1 ? 'secondary' : 'primary'}
            onClick={update}
            disabled={labelValue == 1}
          >
            Update
          </Button>
          &nbsp;
          <Button variant="danger" onClick={deleteRect}>
            Delete
          </Button>
        </Card.Body>
      )}
      {props.extraction.label === -1 && (
        <CardBody>
          <CardText>
            This text has been redacted. No operations can be performed on this
            part of document for security purposes.
          </CardText>
        </CardBody>
      )}
    </Card>
  );
}

export default ActionCard;
