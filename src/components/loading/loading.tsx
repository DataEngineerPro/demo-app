import { Spinner } from 'react-bootstrap';

import './loading.scss';
function LoadingComponent() {
  return (
    <div className="loading-container d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <h6 className="mx-3">Loading...</h6>
    </div>
  );
}

export default LoadingComponent;
