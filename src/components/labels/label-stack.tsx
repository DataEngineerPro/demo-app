import { Badge, Button, Form, InputGroup, Stack } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';
import { PlusCircle } from 'react-feather';
import { useState } from 'react';

function LabelStack(props: any) {
  const [labelText, setLabelText] = useState('');
  const { data, addLabel } = useCanvasContext();
  const labelAdd = (e: any) => {
    e.preventDefault();
    pushLabel();
  };
  const handleKeyBoard = (e: KeyboardEvent) => {
    if (e.keyCode === 13 && labelText.trim().length > 0) {
      pushLabel();
    }
  };
  const pushLabel = () => {
    if (!labelText || labelText.trim().length === 0) return;
    if (data.labels.filter((x) => x.text === labelText).length > 0) {
      setLabelText('');
      return;
    }
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    fetch(import.meta.env.VITE_API_PREFIX + '/api/labels', {
      method: 'POST',
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify({
        id: props.sessionId,
        labels: [{ label: labelText.trim(), colour: '#' + randomColor }],
      }),
    });
    addLabel({ label: { text: labelText.trim(), color: '#' + randomColor } });
    setLabelText('');
  };
  return (
    <Stack direction="horizontal" gap={2} className="flex-wrap">
      {data.labels
        .filter((x) => x.id !== -1 && x.id !== 0 && x.id !== 1)
        .map((x) => {
          return (
            <Button
              key={x.text}
              variant="outline-dark"
              style={{ backgroundColor: x.color + '4D' }}
            >
              {x.text}{' '}
              <Badge
                bg="none"
                pill
                style={{ backgroundColor: '#000', color: '#fff' }}
              >
                {data.rects &&
                  data.rects.filter((r) => r.label === x.id).length}
              </Badge>
            </Button>
          );
        })}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Add New Label"
          aria-label="Add New Label"
          aria-describedby="basic-addon2"
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          onKeyDown={handleKeyBoard}
        />
        <Button variant="primary" id="button-addon2" onClick={labelAdd}>
          <PlusCircle size="24px"></PlusCircle>
        </Button>
      </InputGroup>
    </Stack>
  );
}

export default LabelStack;
