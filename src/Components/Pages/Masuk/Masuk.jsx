import React, { Fragment, useContext, useState } from "react";
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
import { api } from "../../Utils/Api";

const qs = require("querystring");
 

export default function Masuk(props) {
  const { dispatch } = useContext(AuthContext);

  const initialState = {
    username: "",
    password: "",
    isSubmitting: false,
    errorMessage: null,
  };

  const [data, setData] = useState(initialState);

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
      isSubmitting: true,
      errorMessage: null,
    });

    const requestBody = {
      username: data.username,
      password: data.password,
    };

    const config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios
      .post(api + "/auth/api/v1/login", qs.stringify(requestBody), config)
      .then((res) => {
        if (res.data.success === true) {
          dispatch({
            type: "LOGIN",
            payload: res.data,
          });

          props.history.push("/toko");
        } else {
          setData({
            ...data,
            isSubmitting: false,
            errorMessage: res.data.Message,
          });
        }

        throw res;
      });
  };

  return (
    <Fragment>
      <Container className="mt-5">
        <Row>
          <Col>
            <h3 className="text-center">
              <b>MASUK</b>
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
                        required
                      />
                    </Col>
                  </Row>
                </FormGroup>
                <Label>Kata Sandi</Label>
                <FormGroup>
                  <Row>
                    <Col>
                      <Input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleInputChange}
                        id="examplePassword"
                        required
                      />
                    </Col>
                  </Row>
                </FormGroup>

                {data.errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {data.errorMessage}
                  </div>
                )}
                <Button color="primary" className="mb-3" disabled={data.isSubmitting}>
                  {data.isSubmitting ? "...loading" : "Masuk"}
                </Button>
              </Form>
            </Col>
          </Row>
        </Card>
      </Container>
    </Fragment>
  );
}
