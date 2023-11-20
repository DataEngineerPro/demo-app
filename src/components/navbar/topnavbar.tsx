import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

function TopNavBar(props) {
  const clearSession = (e) => {
    e.preventDefault();
    props.reset();
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary shadow rounded">
      <Container fluid={true}>
        <Navbar.Brand href="/" onClick={clearSession}>
          <img
            src="assets/logo-blue.png"
            width="250"
            height="60"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" onClick={clearSession}></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavBar;
