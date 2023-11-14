import { Button, Modal } from 'react-bootstrap';

function SuccessModal(props: any) {
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Evaluate and Submit for Model Training
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Thank you for submitting your details , we will notify you once your
        model is ready
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => window.close()}>
          Exit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
