import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Col,
  Form,
  Button,
  FormGroup,
  Row,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import { useParams, Redirect } from "react-router";
import swal from "sweetalert";
import { AuthContext } from "../../../App";
import { api } from "../../Utils/Api";

 

export default function EditHutang(props) {
  const { state } = useContext(AuthContext);
  let { id_hutang } = useParams();
  const [hutang, sethutang] = useState([]);
  const [data, setData] = useState({});
  const [statusSelect, setStatusSelect] = useState([]);

  useEffect(() => {
    async function getData() {
      let response = await axios.get(api + "/tampilHutang/" + id_hutang);
      response = response.data.values[0];
      setData(response);
    }
    getData();
    axios.get(api + "/tampilStatus").then((res) => {
      setStatusSelect(res.data.values);
    });
  }, []);
  const ss = statusSelect.map((ss) => ss);
  

  const submit = async (e) => {
    e.preventDefault();
    await axios
      .put(api + "/ubahHutang", data)
      .then((res) => {
        swal({
          title: "BERHASIL!",
          text: "Data Hutang Berhasil Diubah!",
          icon: "success",
          button: false,
          timer: 1200,
        });
      })
      .catch((err) => console.error(err));
    sethutang(data);
    props.history.push("/listhutang");
  };

  function handle(e) {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setData(newData);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  if (data) {
    return (
      <Container className="mt-5">
        <h4>Formulir Edit Data Hutang</h4>
        <hr />
        <Form className="form" onSubmit={submit}>
          <Col>
            <Label>Nama Toko</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="text"
                    name="nama_toko"
                    value={data.nama_toko}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Jumlah Hutang</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="jumlah"
                    value={data.jumlah}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>List Barang</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="textarea"
                    name="barang"
                    value={data.barang}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Status</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="select"
                    name="status"
                    value={data.status}
                    defaultValue={data.nama_status}
                    onChange={(e) => handle(e)}
                    required
                  >
                    {ss.map((ss, key) => (
                      <option key={key} value={ss.id_status}>
                        {ss.nama_status}
                      </option>
                    ))}
                  </Input>
                </Col>
              </Row>
            </FormGroup>
            <Row>
              <Col>
                <FormGroup>
                  <Row>
                    <Col>
                      <Button
                        className="fa fa-chevron-left mt-3"
                        type="button"
                        href="/listbarang"
                      >
                        {" "}
                        Kembali{" "}
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Row>
                    <Col>
                      <Button
                        color="primary"
                        className="mt-3 float-right"
                        type="button"
                        onClick={submit}
                      >
                        {" "}
                        Simpan{" "}
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Form>
      </Container>
    );
  }
}
