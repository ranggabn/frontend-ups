import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Container,
  ListGroup,
  ListGroupItem,
  Button,
  Badge,
  Table,
  Input,
} from "reactstrap";
import { Pagination } from "antd";
import axios from "axios";
import { numberWithCommas, numberWithCommasString } from "../../Utils/Koma";
import swal from "sweetalert";
import moment from "moment";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import ModalKeranjang from "./ModalKeranjang2";
import { api } from "../../Utils/Api";

export default function TokoBengkel() {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [data, setdata] = useState({
    kode: "",
  });
  const [keranjangs, setkeranjangs] = useState([]);
  const [dataKeranjang, setdataKeranjang] = useState({
    kode: "",
    jumlah: "",
    total: "",
    tanggal: "",
    total_harga: "",
  });
  const [tampilkeranjang, settampilkeranjang] = useState([]);
  const [modal, setmodal] = useState({
    showModal: false,
    jumlah: 0,
    total: 0,
    keterangan: "",
  });
  const [searchTerm, setsearchTerm] = useState("");
  const toggle = () => setmodal(!modal);
  const [currentPagination, setCurrentPagination] = useState(1);

  useEffect(() => {
    axios.get(api + "/tampilBarang").then((res) => {
      setbarang(res.data.values);
    });
    setdataKeranjang({
      tanggal: moment().format(),
    });
    getListKeranjang();
  }, []);

  function keranjang(kode) {
    const newData = { ...data, kode: kode };
    setdata(newData);
    axios.get(api + "/tampilBarang/" + newData.kode).then((res) => {
      const response = res.data.values[0];
      console.log(response);
      axios.get(api + "/tampilKeranjang/" + newData.kode).then((res) => {
        if (res.data.values.length === 0) {
          const dataKer = {
            ...dataKeranjang,
            kode: response.kode,
            jumlah: 1,
            total: response.bengkel,
            tanggal: moment().format(),
          };
          setdataKeranjang(dataKer);
          axios.post(api + "/tambahKeranjang", dataKer).then((res) => {
            swal({
              title: "BERHASIL!",
              text: "Berhasil Masuk Keranjang!",
              icon: "success",
              button: false,
              timer: 1200,
            });
            const myData = [...keranjangs, res.data.values];
            setkeranjangs(myData);
            getListKeranjang();
          });
        } else {
          const dataKer = {
            ...dataKeranjang,
            kode: response.kode,
            total: res.data.values[0].total + response.bengkel,
            jumlah: res.data.values[0].jumlah + 1,
          };
          axios.put(api + "/ubahKeranjang", dataKer).then((res) => {
            swal({
              title: "BERHASIL!",
              text: "Berhasil Masuk Keranjang!",
              icon: "success",
              button: false,
              timer: 1200,
            });
            const myData = [...keranjangs, res.data.values];
            setkeranjangs(myData);
            getListKeranjang();
          });
        }
      });
    });
  }

  function remove() {
    axios
      .delete(api + "/hapusKeranjang", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        getListKeranjang();
      })
      .catch((err) => console.error(err));
  }

  const arr = [];
  tampilkeranjang.map((lb) =>
    arr.push({
      kode: lb.kode,
      stok: lb.stok - lb.jumlah,
    })
  );
  function handleSubmit(e) {
    e.preventDefault();
    tampilkeranjang.map(
      (newData) =>
        axios.post(api + "/tambahPenjualan", newData).then((res) => {}),
      swal({
        title: "BERHASIL!",
        text: "Penjualan Berhasil!",
        icon: "success",
        button: false,
        timer: 1200,
      })
    );
    arr.map((arr) => axios.put(api + "/ubahBarang3", arr));
    remove();
    getListKeranjang();
  }

  const getListKeranjang = () => {
    axios.get(api + "/tampilBarang").then((res) => {
      setbarang(res.data.values);
    });
    axios.get(api + "/tampilKeranjang").then((res) => {
      settampilkeranjang(res.data.values);
    });
    axios.get(api + "/totalHarga").then((res) => {
      const dataKer = {
        ...dataKeranjang,
        total_harga: res.data.values[0].total_harga,
      };
      setdataKeranjang(dataKer);
    });
  };
  const tamker = tampilkeranjang.map((tamker) => tamker);

  const handleShow = (kode) => {
    axios.get(api + "/tampilKeranjang/" + kode).then((res) => {
      setmodal({
        showModal: true,
        keterangan: res.data.values[0],
        jumlah: res.data.values[0].jumlah,
        total: res.data.values[0].total,
      });
    });
  };

  const handleClose = () => {
    setmodal({
      showModal: false,
    });
  };

  const words = searchTerm.toLowerCase().split(" ");

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <div>
      <Container>
        <Row className="mt-5">
          <Col>
            <h4 className="text-center">
              <b>PENJUALAN KHUSUS BENGKEL</b>
            </h4>
          </Col>
        </Row>
      </Container>
      <Row className="m-auto" style={{ justifyContent: "center" }}>
        <Col md={3} xs={12} className="mr-2">
          <hr />
          <h4>
            <strong>Keranjang</strong>
          </h4>
          <hr />
          <ListGroup flush>
            {tamker.map((tamker, key) => (
              <ListGroupItem
                key={key}
                type="button"
                onClick={() => handleShow(tamker.kode)}
                action
              >
                <Row>
                  <Col xs="1.5">
                    <Badge color="success" pill>
                      {tamker.jumlah}
                    </Badge>
                  </Col>
                  <Col>
                    <h5>{tamker.nama}</h5>
                    <p>Rp. {numberWithCommasString(tamker.bengkel)}</p>
                  </Col>
                  <Col xs="4.5">
                    <strong>
                      {" "}
                      <p>Rp. {numberWithCommasString(tamker.total)}</p>
                    </strong>
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
            <ModalKeranjang
              handleClose={handleClose}
              {...modal}
              toggle={toggle}
              getListKeranjang={getListKeranjang}
            />
          </ListGroup>
          <ListGroup>
            <ListGroupItem color="success">
              <Row>
                <Col md={12} xl={4}>
                  <h5>Total : </h5>
                </Col>
                <Col md={12} xl={8}>
                  <h5>
                    {dataKeranjang.total_harga
                      ? "Rp. " +
                        numberWithCommasString(dataKeranjang.total_harga)
                      : ""}
                  </h5>
                </Col>
              </Row>
            </ListGroupItem>
          </ListGroup>
          <Row className="mt-3">
            <Container>
              <Button color="success" onClick={(e) => handleSubmit(e)} block>
                Lanjut Jual
              </Button>
            </Container>
          </Row>
          <Row className="mt-3">
            <Container>
              <Button color="danger" onClick={() => remove()} block>
                Bersihkan Keranjang
              </Button>
            </Container>
          </Row>
        </Col>
        <Col md={8} xs={12}>
          <hr />
          <h4>
            <strong>Daftar Produk</strong>
          </h4>
          <hr />
          <Input
            type="text"
            placeholder="Search..."
            onChange={(event) => {
              setsearchTerm(event.target.value);
            }}
          />
          <Row>
            <Col xs={12} className="over-auto">
              <Table className="table-bordered mr-3 mt-3">
                <thead
                  className="text-center"
                  style={{ backgroundColor: "#DDDDDD", borderColor: "black" }}
                >
                  <tr>
                    <th>Kode</th>
                    <th>Nama Barang</th>
                    <th>Stok</th>
                    <th>Harga Bengkel</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {barang
                    .filter((barang) => {
                      if (searchTerm === "") {
                        return barang;
                      } else {
                        return words.every((word) =>
                          barang.nama.toLowerCase().includes(word)
                        );
                      }
                    })
                    .slice((currentPagination - 1) * 10, 10 * currentPagination)
                    .map((barang) => (
                      <tr key={barang.kode}>
                        <td style={{ maxWidth: "100px" }}>{barang.kode}</td>
                        <td>{barang.nama}</td>
                        <td className="text-center">{barang.stok}</td>
                        <td>Rp. {numberWithCommas(barang.bengkel)}</td>
                        <td>
                          <Button
                            color="primary"
                            onClick={() => keranjang(barang.kode)}
                          >
                            Tambah Keranjang
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <div style={{ marginBottom: "80px" }}>
                <Pagination
                  defaultCurrent={currentPagination}
                  current={currentPagination}
                  total={barang?.length}
                  onShowSizeChange={(e) => console.log(e)}
                  onChange={(e) => setCurrentPagination(e)}
                  showSizeChanger={false}
                  showQuickJumper
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
