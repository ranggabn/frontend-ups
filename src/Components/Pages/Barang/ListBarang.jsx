import React, { useEffect, useState, useContext } from "react";
import { Container, Button, Table, Input, Row, Col } from "reactstrap";
import { Pagination } from "antd";
import axios from "axios";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommas } from "../../Utils/Koma";
import { api } from "../../Utils/Api";
import SweetAlert from "react-bootstrap-sweetalert";

export default function ListBarang(props) {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [currentPagination, setCurrentPagination] = useState(1);

  useEffect(() => {
    axios.get(api + "/tampilBarang").then((res) => {
      setbarang(res.data.values);
    });
  }, []);
  const arr = [];
  barang.map((lb) => arr.push({ value: lb, key: lb.nama }));

  function remove(kode) {
    const data = qs.stringify({ kode: kode });
    setAlert(false);
    axios
      .delete(api + "/hapusBarang", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        console.log(res.data.values);
        const newData = barang.filter((barang) => barang.kode !== kode);
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

  function update(kode) {
    props.history.push("/editbarang/" + kode);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <>
      {alert}
      <Container className="mt-5">
        <h2>DAFTAR BARANG</h2>
        <hr />
        <Input
          type="text"
          placeholder="Search..."
          onChange={(event) => {
            setsearchTerm(event.target.value);
          }}
        />
        <Row className="mb-5">
          <Col xs={12} className="over-auto">
            <Table className="table-bordered mt-3">
              <thead style={{ backgroundColor: "#dee2e6" }}>
                <tr className="text-center">
                  <th>Kode</th>
                  <th>Nama Barang</th>
                  <th>Stok</th>
                  <th>Pricelist</th>
                  <th>Diskon</th>
                  <th>Harga Modal</th>
                  <th>Harga Normal</th>
                  <th>Harga Bengkel</th>
                  <th>Keterangan</th>
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
                      <td
                        style={{ maxWidth: "100px", verticalAlign: "middle" }}
                      >
                        {barang.kode}
                      </td>
                      <td
                        style={{ minWidth: "200px", verticalAlign: "middle" }}
                      >
                        {barang.nama}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {barang.stok}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommas(barang.pricelist)}
                      </td>
                      <td
                        className="text-center"
                        style={{ verticalAlign: "middle" }}
                      >
                        {barang.diskon}%
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommas(barang.modal)}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommas(barang.jual)}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommas(barang.bengkel)}
                      </td>
                      <td
                        style={{ minWidth: "180px", verticalAlign: "middle" }}
                        className="text-center"
                      >
                        {" "}
                        <Button
                          color="secondary"
                          onClick={() => update(barang.kode)}
                        >
                          Edit
                        </Button>
                        <span> </span>
                        <Button
                          color="danger"
                          onClick={() => confirmAction(barang.kode)}
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
