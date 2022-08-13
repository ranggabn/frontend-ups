import React, { useState, useEffect, useContext } from "react";
import { Container, Button, Table, Input } from "reactstrap";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommasString } from "../../Utils/Koma";
import { api } from "../../Utils/Api";

 

export default function ListPenjualan() {
  const { state } = useContext(AuthContext);
  const [jual, setjual] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    axios.get(api + "/tampilPenjualan").then((res) => {
      setjual(res.data.values);
    });
  }, []);

  function remove(id_penjualan) {
    // console.log(id);
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

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <h2>LIST PENJUALAN</h2>
      <hr />
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
                <b>Rincian Penjualan</b>
              </h5>
            </th>
          </tr>
          <tr>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Total Harga</th>
            <th>Tanggal</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          {jual.filter((jual) => {
              if (searchTerm == "") {
                return jual;
              } else if (jual.nama.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return jual;
              }
            }).map((jual) => (
            <tr key={jual.id_penjualan}>
              <td>{jual.nama}</td>
              <td>{jual.jumlah}</td>
              <td>Rp. {numberWithCommasString(jual.total)}</td>
              <td>{moment(jual.tanggal).format("DD-MM-YYYY")}</td>
              <td>
                <Button color="danger" onClick={() => remove(jual.id_penjualan)}>
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
