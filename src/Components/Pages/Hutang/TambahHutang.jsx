import React, { useEffect, useState, useContext } from "react";
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
import { Redirect } from "react-router";
import { AuthContext } from "../../../App";
import { api } from "../../Utils/Api";

 

export default function TambahHutang(props) {
  const { state } = useContext(AuthContext);
  const [hutang, sethutang] = useState([]);
  const [data, setdata] = useState({
    nama_toko: "",
    jumlah: "",
    barang: "",
    tanggal: "",
    status: "",
  });

  useEffect(() => {
    setdata({
      status: 2,      
    });
  }, []);

  function submit(e) {
    axios
      .post(api + "/tambahHutang", data)
      .then((res) => {
        swal({
          title: "BERHASIL!",
          text: "Data Hutang Berhasil Ditambahkan!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        const myData = [...hutang, res.data.values];
        sethutang(myData);
        setdata({
          nama_toko: "",
          jumlah: "",
          barang: "",
          tanggal: "",
          status: "",
        });
      })
      .catch((error) => console.log(error));
    e.preventDefault();
  }

  function handle(e) {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setdata(newData);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h3 className="text-center mb-5">
            <b>FORMULIR HUTANG</b>
          </h3>
        </Col>
      </Row>
      <Card className="container mb-5">
        <Form className="form mt-3 mb-3" onSubmit={(e) => submit(e)}>
          <FormGroup>
            <Label for="nama_toko">Nama Toko</Label>
            <Input
              type="text"
              name="nama_toko"
              id="nama_toko"
              value={data.nama_toko}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="jumlah">Jumlah Hutang</Label>
            <Input
              type="number"
              name="jumlah"
              id="jumlah"
              placeholder="Rp."
              value={data.jumlah}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="barang">List Barang</Label>
            <Input
              type="textarea"
              name="barang"
              id="barang"
              value={data.barang}
              onChange={(e) => handle(e)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="tanggal">Tanggal</Label>
            <Input
              type="date"
              name="tanggal"
              id="tanggal"
              value={data.tanggal}
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
                      <Button className="mt-3" type="button" href="/listhutang">
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
