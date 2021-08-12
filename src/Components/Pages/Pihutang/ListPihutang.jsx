import React, {useState,useEffect, useContext} from "react";
import { Container, Button, Table, Input } from "reactstrap";
import axios from "axios";
import moment from "moment";
import qs from "querystring";
import { AuthContext } from "../../../App";
import { Redirect } from "react-router";
import { numberWithCommas } from "../../Utils/Koma";

const api = "http://localhost:3001";

export default function ListPihutang(props) {
  const { state } = useContext(AuthContext);
  const [pihutang, setpihutang] = useState([]);
  const [searchTerm, setsearchTerm] = useState("");

  useEffect(() => {
    axios.get(api + "/tampilPihutang").then((res) => {
      setpihutang(res.data.values);
    });
  }, []);

  function remove(id_pihutang) {
    // console.log(id);
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

  function update(id_pihutang) {
    console.log(id_pihutang);
    props.history.push("/editpihutang/"+id_pihutang)
  }

  if (!state.isAuthenticated) {
    return <Redirect to="/masuk" />;
  }
  return (
    <Container className="mt-5">
      <h2>PIHUTANG</h2>
      <hr />
      <Button
        color="success"
        href="/tambahpihutang"
        className="mt-1 mb-3 float-right"
      >
        Tambah Catatan Pihutang
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
                <b>Rincian Pihutang</b>
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
          {pihutang.filter((pihutang) => {
              if (searchTerm == "") {
                return pihutang;
              } else if (pihutang.nama_toko.toLowerCase().includes(searchTerm.toLowerCase())
              ) {
                return pihutang;
              }
            }).map((pihutang) => (
            <tr key={pihutang.id_pihutang}>
              <td>{pihutang.nama_toko}</td>
              <td>Rp. {numberWithCommas(pihutang.jumlah)}</td>
              <td>{pihutang.barang}</td>
              <td>{moment(pihutang.tanggal).format("DD-MM-YYYY")}</td>
              <td>{pihutang.nama_status}</td>
              <td>
                <Button
                  color="secondary"
                  onClick={() => update(pihutang.id_pihutang)}
                >
                  Edit
                </Button>
                <span> </span>
                <Button
                  color="danger"
                  onClick={() => remove(pihutang.id_pihutang)}
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
