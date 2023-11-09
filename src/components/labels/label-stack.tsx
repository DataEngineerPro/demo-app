import { Badge, Button, Form, InputGroup, Stack } from 'react-bootstrap';
import { useCanvasContext } from '../canvas/context/context';
import { PlusCircle } from 'react-feather';
import { useState } from 'react';

function LabelStack() {
  const [labelText, setLabelText] = useState('');
  const { data, addLabel } = useCanvasContext();
  const labelAdd = (e: any) => {
    e.preventDefault();
    addLabel({ label: { text: labelText } });
    setLabelText('');
  };
  const handleKeyBoard = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      addLabel({ label: { text: labelText } });
      setLabelText('');
    }
  };
  return (
    <Stack direction="horizontal" gap={2} className="flex-wrap">
      {data.labels.map((x) => {
        return (
          <Button
            key={x.id}
            variant="outline-dark"
            style={{ backgroundColor: x.color + '4D' }}
          >
            {x.text}{' '}
            <Badge
              bg="none"
              pill
              style={{ backgroundColor: '#000', color: '#fff' }}
            >
              {data.rects.filter((r) => r.label === x.id).length}
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
