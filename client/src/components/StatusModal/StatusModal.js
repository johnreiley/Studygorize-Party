import { Modal, Button } from 'react-bootstrap';

function StatusModal(props) {

  function closeModal() {
    props.setIsOpen(false);
  }

  return (
    <Modal show={props.isOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default StatusModal;
