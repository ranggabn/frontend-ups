import React, { useEffect, useState, useContext } from "react";
import { Container, Button, Table, Input, Row, Col } from "reactstrap";
import { Pagination } from "antd";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { api } from "../../Utils/Api";
import SweetAlert from "react-bootstrap-sweetalert";

export default function ListPembelian() {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [currentPagination, setCurrentPagination] = useState(1);

  useEffect(() => {
    axios.get(api + "/tampilPembelian").then((res) => {
      setbarang(res.data.values);
    });
  }, []);

  function remove(id_pembelian) {
    setAlert(false);
    const data = qs.stringify({ id_pembelian: id_pembelian });
    axios
      .delete(api + "/hapusPembelian", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        console.log(res.data.values);
        const newData = barang.filter(
          (barang) => barang.id_pembelian !== id_pembelian
        );
        setbarang(newData);
      })
      .catch((err) => console.error(err));
  }

  const confirmAction = (data) => {
    setAlert(
      <SweetAlert
        type="danger"
        showCancel
        cancelBtnText="Kembali"
        confirmBtnText="Ya, hapus"
        confirmBtnBsStyle="danger"
        title="Hapus Barang?"
        onConfirm={() => {
          remove(data);
        }}
        onCancel={() => setAlert(null)}
      >
        Barang yang telah dihapus tidak dapat dikembalikan
      </SweetAlert>
    );
  };

  const words = searchTerm.toLowerCase().split(" ");

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <>
      {alert}
      <Container className="mt-5">
        <h2>DAFTAR PEMBELIAN</h2>
        <hr />
        <Button
          color="success"
          href="/baranglama"
          className="mt-1 mb-3 float-right"
        >
          Barang Lama
        </Button>
        <Button
          color="success"
          href="/barangbaru"
          className="mt-1 mb-3 mr-3 float-right"
        >
          Barang Baru
        </Button>
        <Input
          type="text"
          placeholder="Search..."
          onChange={(event) => {
            setsearchTerm(event.target.value);
          }}
        />
        <Row>
          <Col className="over-auto">
            <Table className="table-bordered mt-3">
              <thead style={{ backgroundColor: "#dee2e6" }}>
                <tr className="text-center">
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Tanggal Pembelian</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {barang
                  .filter((barang) => {
                    if (searchTerm == "") {
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
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        {barang.nama}
                      </td>
                      <td
                        style={{ verticalAlign: "middle", textAlign: "center" }}
                      >
                        {barang.stok}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        {moment(barang.tanggal_beli).format("DD-MM-YYYY")}
                      </td>
                      <td
                        style={{
                          minWidth: "80px",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          color="danger"
                          onClick={() => confirmAction(barang.id_pembelian)}
                        >
                          Hapus
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
      </Container>
    </>
  );
}
