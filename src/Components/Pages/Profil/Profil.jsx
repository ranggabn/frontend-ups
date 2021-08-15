import React, { Fragment, useEffect, useContext, useState } from "react";
import axios from "axios";
import {
  Container,
  Label,
  FormGroup,
  Input,
  Row,
  Col,
  Card,
  Button,
  Form,
} from "reactstrap";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";

const qs = require("querystring");
const api = "http://localhost:3001";

export default function Profil() {
  const { state } = useContext(AuthContext);

  const initialState = {
    username: state.user,
    currpassword: "",
    newpassword: "",
    errorMessage: null,
    successMessage: null,
  };

  const [data, setData] = useState(initialState);

  useEffect(() => {
      setData({
          username: state.user
      })
  }, [])

  const handleInputChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setData({
      ...data,
      errorMessage: null,
      successMessage: null,
    });

    const requestBody = {
      username: state.user,
      currpassword: data.currpassword,
      newpassword: data.newpassword,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(
        api + "/auth/api/v1/ubahpassword",
        qs.stringify(requestBody),
        config
      )
      .then((res) => {
        if (res.data.success === true) {
          setData({
            currpassword: "",
            newpassword: "",
            successMessage: res.data.message,
            errorMessage: null,
          });
        } else {
          setData({
            ...data,
            errorMessage: res.data.message,
            successMessage: null,
          });
        }
        throw res;
      });
  };

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Fragment>
      <Container className="mt-5">
        <Row>
          <Col>
            <h3 className="text-center">
              <b>Ubah Password</b>
            </h3>
          </Col>
        </Row>
        <Card className="container mt-3">
          <Row className="justify-content-md-center">
            <Col xs={6}>
              <Form className="mt-4" onSubmit={handleFormSubmit}>
                <Label>Username</Label>
                <FormGroup>
                  <Row>
                    <Col>
                      <Input
                        type="text"
                        name="username"
                        value={data.username}
                        onChange={handleInputChange}
                        id="exampleUsername"
                        disabled
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <Label>Password Lama</Label>
                <FormGroup>
                  <Row>
                    <Col>
                      <Input
                        type="password"
                        name="currpassword"
                        value={data.currpassword}
                        onChange={handleInputChange}
                        id="exampleCurrpassword"
                        required
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <Label>Password Baru</Label>
                <FormGroup>
                  <Row>
                    <Col>
                      <Input
                        type="password"
                        name="newpassword"
                        value={data.newpassword}
                        onChange={handleInputChange}
                        id="exampleNewpassword"
                        required
                      />
                    </Col>
                  </Row>
                </FormGroup>
                {data.successMessage && (
                  <div className="alert alert-success" role="alert">
                    {data.successMessage}
                  </div>
                )}
                {data.errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {data.errorMessage}
                  </div>
                )}
                <Button color="primary" className="mb-3" type="submit">
                  Simpan
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </Fragment>
  );
}
