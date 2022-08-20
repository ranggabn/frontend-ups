import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Table, Input, Row, Col } from "reactstrap";
import { Pagination } from "antd";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommas } from "../../Utils/Koma";
import { api } from "../../Utils/Api";
import SweetAlert from "react-bootstrap-sweetalert";

export default function ListHutang(props) {
  const { state } = useContext(AuthContext);
  const [hutang, sethutang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [currentPagination, setCurrentPagination] = useState(1);

  useEffect(() => {
    axios.get(api + "/tampilHutang").then((res) => {
      sethutang(res.data.values);
    });
  }, []);

  function remove(id_hutang) {
    setAlert(false);
    const data = qs.stringify({ id_hutang: id_hutang });
    axios
      .delete(api + "/hapusHutang", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        const newData = hutang.filter(
          (hutang) => hutang.id_hutang !== id_hutang
        );
        sethutang(newData);
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

  function update(id_hutang) {
    props.history.push("/edithutang/" + id_hutang);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <>
      {alert}
      <Container className="mt-5">
        <h2>DAFTAR HUTANG</h2>
        <hr />
        <Button
          color="success"
          href="/tambahhutang"
          className="mt-1 mb-3 float-right"
        >
          Tambah Catatan Hutang
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
                  <th>Nama Toko</th>
                  <th>Jumlah Hutang</th>
                  <th>List Barang</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {hutang
                  .filter((hutang) => {
                    if (searchTerm === "") {
                      return hutang;
                    } else {
                      return words.every((word) =>
                        hutang.nama_toko.toLowerCase().includes(word)
                      );
                    }
                  })
                  .slice((currentPagination - 1) * 10, 10 * currentPagination)
                  .map((hutang) => (
                    <tr key={hutang.id_hutang}>
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        {hutang.nama_toko}
                      </td>
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommas(hutang.jumlah)}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {hutang.barang}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        {moment(hutang.tanggal).format("DD-MM-YYYY")}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {hutang.nama_status}
                      </td>
                      <td
                        style={{
                          minWidth: "180px",
                          verticalAlign: "middle",
                        }}
                        className="text-center"
                      >
                        <Button
                          color="secondary"
                          onClick={() => update(hutang.id_hutang)}
                        >
                          Edit
                        </Button>
                        <span> </span>
                        <Button
                          color="danger"
                          onClick={() => confirmAction(hutang.id_hutang)}
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
                total={hutang?.length}
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
