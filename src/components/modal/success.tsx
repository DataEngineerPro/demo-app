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
          Download Labels
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu lorem
        vitae odio ultricies ullamcorper eget eu mauris. Nulla ultricies purus
        non ornare tempor. Nam dignissim nibh et eleifend placerat. Cras tempus
        magna arcu, id congue sapien rutrum ac. Nunc commodo mattis enim, sit
        amet volutpat mi volutpat non. Nulla sit amet fringilla massa, in
        ultrices dui. Aenean gravida pellentesque fermentum. Ut egestas, mi ut
        suscipit laoreet, lorem orci euismod risus, maximus malesuada lacus est
        at purus. Nunc eu tellus justo. Mauris ultrices auctor viverra. Vivamus
        sit amet ligula metus. Ut molestie auctor consectetur.
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
        <Button onClick={props.onSuccess}>Download & Exit</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
