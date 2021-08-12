import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Table, Input } from "reactstrap";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommas } from "../../Utils/Koma";

const api = "http://localhost:3001";

export default function ListHutang(props) {
  const { state } = useContext(AuthContext);
  const [hutang, sethutang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    axios.get(api + "/tampilHutang").then((res) => {
      sethutang(res.data.values);
    });
  }, []);

  function remove(id_hutang) {
    // console.log(id);
    const data = qs.stringify({ id_hutang: id_hutang });
    axios
      .delete(api + "/hapusHutang", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        console.log(res.data.values);
        const newData = hutang.filter(
          (hutang) => hutang.id_hutang !== id_hutang
        );
        sethutang(newData);
      })
      .catch((err) => console.error(err));
  }

  function update(id_hutang) {
    console.log(id_hutang);
    props.history.push("/edithutang/" + id_hutang);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <h2>HUTANG</h2>
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
      <Table className="table-bordered mt-3">
        <thead>
          <tr>
            <th colSpan="6" className="text-center" bgcolor="#BABABA">
              <h5>
                <b>Rincian Hutang</b>
              </h5>
            </th>
          </tr>
          <tr>
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
              if (searchTerm == "") {
                return hutang;
              } else if (hutang.nama_toko.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return hutang;
              }
            })
            .map((hutang) => (
              <tr key={hutang.id_hutang}>
                <td>{hutang.nama_toko}</td>
                <td>Rp. {numberWithCommas(hutang.jumlah)}</td>
                <td>{hutang.barang}</td>
                <td>{moment(hutang.tanggal).format("DD-MM-YYYY")}</td>
                <td>{hutang.nama_status}</td>
                <td>
                  <Button
                    color="secondary"
                    onClick={() => update(hutang.id_hutang)}
                  >
                    Edit
                  </Button>
                  <span> </span>
                  <Button
                    color="danger"
                    onClick={() => remove(hutang.id_hutang)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}
