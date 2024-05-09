import Spinner from 'react-bootstrap/Spinner';

export default function LoadingBox() {
  return (
    <div className="loading-container">
      <Spinner animation="border" role="status" className="custom-spinner">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
