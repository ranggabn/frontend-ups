import React, { useEffect, useState, useContext } from "react";
import { Container, Button, Table, Input } from "reactstrap";
import axios from "axios";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommas } from "../../Utils/Koma";


const api = "http://localhost:3001";

export default function ListBarang(props) {
  const { state } = useContext(AuthContext);
  const [barang, setbarang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    axios.get(api + "/tampilBarang").then((res) => {
      setbarang(res.data.values);
    });
  }, []);
  const arr = [];
  barang.map((lb) => arr.push({ value: lb, key: lb.nama }));

  function remove(kode) {
    const data = qs.stringify({ kode: kode });
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

  function update(kode) {
    props.history.push("/editbarang/" + kode);
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <h2>LIST BARANG</h2>
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
            <th colSpan="9" className="text-center" bgcolor="#BABABA">
              <h5>
                <b>Rincian Barang</b>
              </h5>
            </th>
          </tr>
          <tr>
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
          {barang.filter((barang) => {
            if(searchTerm === ""){
              return barang
            }else if(barang.nama.toLowerCase().includes(searchTerm.toLowerCase())) {
              return barang
            }
          }).map((barang) => (
            <tr key={barang.kode}>
              <td>{barang.kode}</td>
              <td>{barang.nama}</td>
              <td>{barang.stok}</td>
              <td>Rp. {numberWithCommas(barang.pricelist)}</td>
              <td>{barang.diskon} %</td>
              <td>Rp. {numberWithCommas(barang.modal)}</td>
              <td>Rp. {numberWithCommas(barang.jual)}</td>
              <td>Rp. {numberWithCommas(barang.bengkel)}</td>
              <td>
                <Button color="secondary" onClick={() => update(barang.kode)}>
                  Edit
                </Button>
                <span> </span>
                <Button color="danger" onClick={() => remove(barang.kode)}>
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
