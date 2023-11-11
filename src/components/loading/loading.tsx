import { Spinner } from 'react-bootstrap';

function LoadingComponent() {
  return (
    <div className="vh-100 d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <h6 className="mx-3">Loading...</h6>
    </div>
  );
}

export default LoadingComponent;
