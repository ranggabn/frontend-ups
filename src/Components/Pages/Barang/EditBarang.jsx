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
import { AuthContext } from "../../../App";
import swal from "sweetalert";
import { api } from "../../Utils/Api";

 

export default function EditBarang(props) {
  const { state } = useContext(AuthContext);
  let { kode } = useParams();
  const [barang, setbarang] = useState([]);
  const [data, setData] = useState({});

  useEffect(() => {
    async function getData() {
      let response = await axios.get(api + "/tampilBarang/" + kode);
      response = response.data.values[0];
      setData(response);
    }
    getData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios
      .put(api + "/ubahBarang", data)
      .then((res) => {
        swal({
          title: "BERHASIL!",
          text: "Data Barang Berhasil Diubah!",
          icon: "success",
          button: false,
          timer: 1200,
        });
      })
      .catch((err) => console.error(err));
    setbarang(data);
    props.history.push("/listbarang");
  };

  let newmodal;
  function handle(e) {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    newmodal = parseInt(newData.pricelist, 10) - parseInt(newData.pricelist, 10) * (parseInt(newData.diskon, 10) / 100);
    setData({...newData, modal:newmodal});
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  if (data) {
    return (
      <Container className="mt-5">
        <h4>Formulir Edit Data Barang</h4>
        <hr />
        <Form className="form" onSubmit={submit}>
          <Col>
            <Label>Kode</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="text"
                    name="kode"
                    value={data.kode}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Nama Barang</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="textarea"
                    name="nama"
                    value={data.nama}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Stok Barang</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="stok"
                    value={data.stok}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Pricelist</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="pricelist"
                    value={data.pricelist}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Diskon</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="diskon"
                    value={data.diskon}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Harga Modal</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="modal"
                    value={data.modal}
                    onChange={(e) => handle(e)}
                    disabled
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Harga Normal</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="jual"
                    value={data.jual}
                    onChange={(e) => handle(e)}
                    required
                  />
                </Col>
              </Row>
            </FormGroup>
            <Label>Harga Bengkel</Label>
            <FormGroup>
              <Row>
                <Col>
                  <Input
                    type="number"
                    name="bengkel"
                    value={data.bengkel}
                    onChange={(e) => handle(e)}
                    required
                  />
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
