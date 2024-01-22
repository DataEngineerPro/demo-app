import { TextareaAutosize } from '@mui/material';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

function SuccessModal(props: any) {
  const [ocrValue, setOcrValue] = useState('');
  const [error, setError] = useState(false);
  const submit = async () => {
    if (ocrValue.trim().length === 0) {
      setError(true);
      return;
    }
    const body = JSON.stringify({
      feedback: ocrValue,
    });
    await fetch(
      import.meta.env.VITE_API_PREFIX + '/api/customer/' + props.sessionId,
      {
        method: 'PUT',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: body,
      }
    )
      .then((d) => (d.ok ? d.json() : new Error('expired Session')))
      .then((d) => {
        window.close();
      });
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Submit for Model Training
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Thank you for submitting your details , Please provide feedback on the
        user experience and we will contact you shortly.
        <br />
        <TextareaAutosize
          minRows={5}
          onChange={(e) => {
            setError(false);
            setOcrValue(e.target.value);
          }}
          value={ocrValue}
          className={`form-control ${error ? 'is-invalid' : ''}`}
          required
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={submit}>
          Submit & Exit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
