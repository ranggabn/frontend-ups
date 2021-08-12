import React, { useState, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
} from "reactstrap";
import axios from "axios";
import swal from "sweetalert";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";

const api = "http://localhost:3001";

export default function BarangBaru() {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [data, setdata] = useState({
    kode: "",
    nama: "",
    stok: "",
    pricelist: "",
    diskon: "",
    modal: "",
    jual: "",
    tanggal_beli: "",
  });

  function submit(e) {
    axios.post(api + "/tambahPembelian", data)
    axios
      .post(api + "/tambahBarang", data)
      .then((res) => {
        swal({
          title: "BERHASIL!",
          text: "Data Barang Berhasil Ditambahkan!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        const myData = [...barang, res.data.values];
        setbarang(myData);
        setdata({
          kode: "",
          nama: "",
          stok: "",
          pricelist: "",
          diskon: "",
          modal: "",
          jual: "",
          tanggal_beli: "",
        });
      })
      .catch((error) => console.log(error));
    e.preventDefault();
  }

  let newmodal;
  function handle(e) {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    newmodal =
      parseInt(newData.pricelist, 10) -
      parseInt(newData.pricelist, 10) * (parseInt(newData.diskon, 10) / 100);
    setdata({ ...newData, modal: newmodal });
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h3 className="text-center mb-5">
            <b>FORMULIR BARANG BARU</b>
          </h3>
        </Col>
      </Row>
      <Card className="container mb-5">
        <Form className="form mt-3 mb-3" onSubmit={(e) => submit(e)}>
          <FormGroup>
            <Label for="kode">Kode</Label>
            <Input
              type="text"
              name="kode"
              id="kode"
              value={data.kode}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="nama">Nama</Label>
            <Input
              type="textarea"
              name="nama"
              id="nama"
              value={data.nama}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="stok">Jumlah Pembelian</Label>
            <Input
              type="number"
              name="stok"
              id="stok"
              value={data.stok}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="Pricelist">Pricelist</Label>
            <Input
              type="number"
              name="pricelist"
              id="pricelist"
              value={data.pricelist}
              placeholder="Rp. "
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="diskon">Diskon</Label>
            <Input
              type="number"
              name="diskon"
              id="diskon"
              value={data.diskon}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="modal">Harga Modal</Label>
            <Input
              type="number"
              name="modal"
              id="modal"
              value={data.modal}
              placeholder="Rp. "
              onChange={(e) => handle(e)}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label for="jual">Harga Jual</Label>
            <Input
              type="number"
              name="jual"
              id="jual"
              value={data.jual}
              placeholder="Rp. "
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="tanggal_beli">Tanggal Pembelian</Label>
            <Input
              type="date"
              name="tanggal_beli"
              id="tanggal_beli"
              value={data.tanggal_beli}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Row>
              <Col>
                <FormGroup>
                  <Row>
                    <Col>
                      <Button className="mt-3" type="button" href="/listbeli">
                        {" "}
                        Kembali{" "}
                      </Button>
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
              <Col>
                <Button
                  color="primary"
                  className="mt-3 float-right"
                  type="submit"
                >
                  {" "}
                  Simpan{" "}
                </Button>
              </Col>
            </Row>
          </FormGroup>
        </Form>
      </Card>
    </Container>
  );
}
