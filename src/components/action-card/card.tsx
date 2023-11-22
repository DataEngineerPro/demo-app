import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useCanvasContext } from '../canvas/context/context';
import { useEffect, useState } from 'react';
import './card.scss';
import { CardBody, CardText } from 'react-bootstrap';
import { X } from 'react-feather';

function ActionCard(props: any) {
  if (!props || !props.rect) return;
  console.log(props);
  const { data, updateValues } = useCanvasContext();
  const { removeRect } = useCanvasContext();
  const [textValue, setTextValue] = useState<string>(
    props?.rect?.comment || ''
  );
  const [predictedValue] = useState(props?.rect?.text || '');
  const [labelValue, setLabelValue] = useState(props.rect?.label);
  console.log('CARD==>', data.labels);
  const callApi = async (newRect, label, comment) => {
    const body = JSON.stringify({
      id: props.sessionId,
      coordinates: [
        {
          page_no: '1',
          left: newRect.x,
          top: newRect.y,
          width: newRect.width,
          height: newRect.height,
          label_name: data.labels.filter((x) => x.id == label)[0].text,
          comments: comment,
        },
      ],
    });
    await fetch(import.meta.env.VITE_API_PREFIX + '/api/upload_bbox_info', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: body,
    })
      .then((d) => (d.ok ? d.json() : new Error('expired Session')))
      .then((d) => {
        console.log(d);
        console.log(d.ocr_text);
        updateValues({
          rect: {
            ...props.rect,
            comment: textValue.trim(),
            label: parseInt(labelValue, 10),
            text: d.ocr_text,
          },
        });
      })
      .catch(() => {
        props.resetSession();
      });
  };
  const update = async () => {
    updateValues({
      rect: {
        ...props.rect,
        comment: textValue.trim(),
        label: parseInt(labelValue, 10),
        text: predictedValue || 'Updating...',
      },
    });
    props.close();
    callApi(props.rect.rect, labelValue, textValue.trim());
  };
  const deleteRect = () => {
    const body = {
      id: props.sessionId,
      coordinates: [
        {
          page_no: '1',
          left: props.rect.rect.x,
          top: props.rect.rect.y,
          width: props.rect.rect.width,
          height: props.rect.rect.height,
          label_name: '',
          comments: '',
        },
      ],
    };
    fetch(import.meta.env.VITE_API_PREFIX + '/api/delete_bbox', {
      method: 'DELETE',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(body),
    });
    removeRect({ rect: props.rect });
    props.close();
  };
  const labelChange = (e: any) => {
    setLabelValue(e.target.value);
  };
  const clickListener = (e: any) => {
    props.close();
  };
  const keyBoardListener = (e: any) => {
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
      {props.rect.label > -1 && (
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
                  return (
                    <option key={x.text} value={x.id} disabled={x.id == 1}>
                      {x.text}
                    </option>
                  );
                })}
            </Form.Select>
            <Form.Label htmlFor="inputPassword5">Comments</Form.Label>
            <Form.Control
              type="text"
              id="inputPassword5"
              value={textValue}
              maxLength={25}
              onChange={(e) => setTextValue(e.target.value)}
              disabled={labelValue == 0}
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
      {props.rect.label === -1 && (
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
