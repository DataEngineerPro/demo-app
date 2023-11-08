import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { useCanvasContext } from '../canvas/context/context';
import { useEffect, useState } from 'react';
import './card.scss';
import { Circle } from 'react-feather';
import { CardBody, CardText } from 'react-bootstrap';

function ActionCard(props: any) {
  if (!props || !props.rect) return;
  const { data, updateValues } = useCanvasContext();
  const { removeRect } = useCanvasContext();
  const [textValue, setTextValue] = useState<string>(props?.rect?.text);
  const [labelValue, setLabelValue] = useState(props.rect?.label);
  const update = () => {
    updateValues({
      rect: { ...props.rect, text: textValue, label: parseInt(labelValue, 10) },
    });
    props.close();
  };
  const deleteRect = () => {
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
            <Form.Label htmlFor="inputPassword5">Text</Form.Label>
            <Form.Control
              type="text"
              id="inputPassword5"
              value={props.rect.label === 0 ? 'Processing...' : textValue}
              onChange={(e) => setTextValue(e.target.value)}
              disabled={props.rect.label === 0}
            />
            <Form.Label htmlFor="select">Label</Form.Label>
            <Form.Select
              id="select"
              aria-label="Please select label"
              defaultValue={labelValue}
              onChange={labelChange}
              disabled={props.rect.label === 0}
            >
              {data.labels
                .filter((x) => x.id === -1 || x.id > 1)
                .map((x) => {
                  return (
                    <option key={x.id} value={x.id}>
                      {x.text}
                    </option>
                  );
                })}
            </Form.Select>
          </Card.Text>
          <Button
            variant="primary"
            onClick={update}
            disabled={props.rect.label === 0}
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
