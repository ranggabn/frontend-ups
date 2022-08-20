import React, {useState,useEffect, useContext} from "react";
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

export default function ListPihutang(props) {
  const { state } = useContext(AuthContext);
  const [pihutang, setpihutang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [currentPagination, setCurrentPagination] = useState(1);

  useEffect(() => {
    axios.get(api + "/tampilPihutang").then((res) => {
      setpihutang(res.data.values);
    });
  }, []);

  function remove(id_pihutang) {
    setAlert(false);
    const data = qs.stringify({ id_pihutang: id_pihutang });
    axios
      .delete(api + "/hapusPihutang", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        console.log(res.data.values);
        const newData = pihutang.filter(
          (pihutang) => pihutang.id_pihutang !== id_pihutang
        );
        setpihutang(newData);
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

  function update(id_pihutang) {
    console.log(id_pihutang);
    props.history.push("/editpihutang/" + id_pihutang);
  }

  const words = searchTerm.toLowerCase().split(" ");

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <>
      {alert}
      <Container className="mt-5">
        <h2>DAFTAR PIUTANG</h2>
        <hr />
        <Button
          color="success"
          href="/tambahpihutang"
          className="mt-1 mb-3 float-right"
        >
          Tambah Catatan Piutang
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
                  <th>Jumlah Piutang</th>
                  <th>List Barang</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {pihutang
                  .filter((pihutang) => {
                    if (searchTerm === "") {
                      return pihutang;
                    } else {
                      return words.every((word) =>
                        pihutang.nama_toko.toLowerCase().includes(word)
                      );
                    }
                  })
                  .slice((currentPagination - 1) * 10, 10 * currentPagination)
                  .map((pihutang) => (
                    <tr key={pihutang.id_pihutang}>
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        {pihutang.nama_toko}
                      </td>
                      <td
                        style={{ minWidth: "150px", verticalAlign: "middle" }}
                      >
                        Rp. {numberWithCommas(pihutang.jumlah)}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {pihutang.barang}
                      </td>
                      <td
                        style={{ minWidth: "120px", verticalAlign: "middle" }}
                      >
                        {moment(pihutang.tanggal).format("DD-MM-YYYY")}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {pihutang.nama_status}
                      </td>
                      <td
                        style={{
                          minWidth: "180px",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <Button
                          color="secondary"
                          onClick={() => update(pihutang.id_pihutang)}
                        >
                          Edit
                        </Button>
                        <span> </span>
                        <Button
                          color="danger"
                          onClick={() => confirmAction(pihutang.id_pihutang)}
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
                total={pihutang?.length}
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
