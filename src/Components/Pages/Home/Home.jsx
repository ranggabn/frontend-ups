import React from "react";
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
        <Row>
          <Col xs={12} className="title-web mb-3">
            <img
              className="Header-logo"
              src={logo}
              alt="Logo"
              width="400"
              height="400"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="title-web">
            <h1>
              <b>OFFICIAL MANAGEMENT WEBSITE</b>
            </h1>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col xs={12} className="title-web">
            <h5>UDIN PARTS SHOP</h5>
          </Col>
        </Row>
      </Container>
    </div>
  );
}