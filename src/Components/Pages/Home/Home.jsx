import React, { useContext } from "react";
import {
  Col,
  Container,
  Row,
} from "reactstrap";
import logo from "./Images/Logo.jpg";

export default function Home() {
  return (
    <div>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto" className="mb-3">
            <img className="Header-logo" src={logo} alt="Logo" width="400" height="400"/>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h1>
              <b>UPS'S OFFICIAL PRIVATE WEBSITE</b>
            </h1>
          </Col>
        </Row>
        <hr />
        <Row className="justify-content-md-center">
          <Col md="auto">
            <h5>
              UDIN PARTS SHOP
            </h5>
          </Col>
        </Row>
      </Container>
    </div>
  );
}