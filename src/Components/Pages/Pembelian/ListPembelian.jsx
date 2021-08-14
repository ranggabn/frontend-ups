import React, { useEffect, useState, useContext } from "react";
import { Container, Button, Table, Input } from "reactstrap";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";

const api = "http://localhost:3001";

export default function ListPembelian() {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    axios.get(api + "/tampilPembelian").then((res) => {
      setbarang(res.data.values);
    });
  }, []);

  function remove(id_pembelian) {
    // console.log(id);
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

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <h2>LIST PEMBELIAN</h2>
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
      <Table className="table-bordered mt-3">
        <thead>
          <tr>
            <th colSpan="8" className="text-center" bgcolor="#BABABA">
              <h5>
                <b>Rincian Pembelian</b>
              </h5>
            </th>
          </tr>
          <tr>
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
              } else if (
                barang.nama.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return barang;
              }
            })
            .map((barang) => (
              <tr key={barang.kode}>
                <td>{barang.nama}</td>
                <td>{barang.stok}</td>
                <td>{moment(barang.tanggal_beli).format("DD-MM-YYYY")}</td>
                <td>
                  <Button color="danger" onClick={() => remove(barang.id_pembelian)}>
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
