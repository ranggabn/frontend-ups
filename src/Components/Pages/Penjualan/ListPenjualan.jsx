import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Table, Input, Row, Col } from "reactstrap";
import { Pagination } from "antd";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommasString } from "../../Utils/Koma";
import { api } from "../../Utils/Api";
import SweetAlert from "react-bootstrap-sweetalert";

export default function ListPenjualan() {
  const { state } = useContext(AuthContext);
  const [jual, setjual] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPagination, setCurrentPagination] = useState(1);

  useEffect(() => {
    axios.get(api + "/tampilPenjualan").then((res) => {
      setjual(res.data.values);
    });
  }, []);

  function remove(id_penjualan) {
    setAlert(false);
    const data = qs.stringify({ id_penjualan: id_penjualan });
    axios
      .delete(api + "/hapusPenjualan", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        console.log(res.data.values);
        const newData = jual.filter(
          (jual) => jual.id_penjualan !== id_penjualan
        );
        setjual(newData);
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
        <h2>DAFTAR PENJUALAN</h2>
        <hr />
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
                <tr>
                  <th>Nama Barang</th>
                  <th>Jumlah</th>
                  <th>Total Harga</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {jual
                  .filter((jual) => {
                    if (searchTerm === "") {
                      return jual;
                    } else {
                      return words.every((word) =>
                        jual.nama.toLowerCase().includes(word)
                      );
                    }
                  })
                  .slice((currentPagination - 1) * 10, 10 * currentPagination)
                  .map((jual) => (
                    <tr key={jual.id_penjualan}>
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        {jual.nama}
                      </td>
                      <td
                        style={{ verticalAlign: "middle", textAlign: "center" }}
                      >
                        {jual.jumlah}
                      </td>
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommasString(jual.total)}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        {moment(jual.tanggal).format("DD-MM-YYYY")}
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
                          onClick={() => confirmAction(jual.id_penjualan)}
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
                total={jual?.length}
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
