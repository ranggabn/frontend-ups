import React, { useState, useEffect, useContext } from "react";
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
import Select from "react-select";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";

const api = "http://localhost:3001";

export default function BarangLama() {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [data, setdata] = useState({
    kode: "",
    nama: "",
    stok: "",
    tanggal_beli: "",
    stoklama: "",
    stokbaru: ""
  });
  const [databaru, setdatabaru] = useState({
    kode: "",
    nama: "",
    stok: "",    
  })
  const [listbarang, setlistbarang] = useState([]);

  useEffect(() => {
    axios.get(api + "/tampilBarang").then((res) => {
      setlistbarang(res.data.values);
    });
  }, []);
  const arr = [];
  listbarang.map((lb) =>
    arr.push({ value: lb.nama, label: lb.nama, kode: lb.kode, stok: lb.stok})
  );

  function submit(e) {
    axios
      .put(api + "/ubahBarang2", databaru)
    axios
      .post(api + "/tambahPembelian2", data)
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
          tanggal_beli: "",
        });
      })
      .catch((error) => console.log(error));
    e.preventDefault();
  }

  const handleChange = (e) => {    
    setdata({
      nama: e.value,
      kode: e.kode,
      stoklama: e.stok
    });
    setdatabaru({
      kode: e.kode,
      nama: e.value,
    })
  };

  let newstok;
  function handle(e) {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    newstok = parseInt(newData.stok) + parseInt(data.stoklama)
    setdata({...newData, stokbaru:newstok})
    setdatabaru({...newData, stok:newstok})
    console.log(databaru.stok);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h3 className="text-center mb-5">
            <b>FORMULIR BARANG LAMA</b>
          </h3>
        </Col>
      </Row>
      <Card className="container mb-5">
        <Form className="form mt-3 mb-3" onSubmit={(e) => submit(e)}>
          <FormGroup>
            <Row>
              <Col>
                <Label for="nama">Nama Barang</Label>
                <Select
                  name="nama"
                  onChange={(e) => handleChange(e)}
                  options={arr}
                />
              </Col>
            </Row>
          </FormGroup>
          <FormGroup>
            <Label for="stoklama">Stok Lama</Label>
            <Input
              type="number"
              name="stoklama"
              id="stoklama"
              value={data.stoklama}
              onChange={(e) => handle(e)}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label for="stokbaru">Stok Baru</Label>
            <Input
              type="number"
              name="stokbaru"
              id="stokbaru"
              value={data.stokbaru}
              onChange={(e) => handle(e)}
              disabled
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
