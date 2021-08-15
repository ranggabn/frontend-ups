import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { numberWithCommasString } from "../../Utils/Koma";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import swal from "sweetalert";
import qs from "querystring";

const api = "http://localhost:3001";

export default function ModalKeranjang({
  showModal,
  handleClose,
  toggle,
  jumlah,
  total,
  keterangan,
  getListKeranjang,
}) {
  const [keranjangs, setkeranjangs] = useState([]);
  const [dataKeranjang, setdataKeranjang] = useState({
    kode: "",
    jumlah: "",
    total: "",
    total_harga: "",
  });
  const [data, setdata] = useState({
    jumlah: jumlah,
    total: total,
  });

  useEffect(() => {
    setdata({
      jumlah: jumlah,
      total: total,
    });
  }, [jumlah, total]);

  function handle(e) {
    const newData = { ...data };
    newData[e.target.name] = e.target.value;
    setdata({
      total: keterangan.bengkel * newData.jumlah,
      jumlah: newData.jumlah
    });
  }

  function handlesubmit() {
    const dataKer = {
      ...dataKeranjang,
      kode: keterangan.kode,
      total: data.total,
      jumlah: data.jumlah,
    };
    axios.put(api + "/ubahKeranjang", dataKer).then((res) => {
      swal({
        title: "Sukses Update Keranjang",
        text: "Cek Keranjang Anda!",
        icon: "success",
        button: false,
        timer: 1200,
      });
      const myData = [...keranjangs, res.data.values];
      setkeranjangs(myData);
      getListKeranjang();
      handleClose();
    });
  }

  function remove(id_keranjang) {
    // console.log(id);
    const data = qs.stringify({ id_keranjang: id_keranjang });
    axios
      .delete(api + "/hapusKeranjangId", {
        data: data,
        headers: { "Content-type": "application/x-www-form-urlencoded" },
      })
      .then((res) => {
        swal({
          title: "Sukses Menghapus Barang",
          text: "Cek Keranjang Anda!",
          icon: "success",
          button: false,
          timer: 1200,
        });
        getListKeranjang();
        handleClose();
      })
      .catch((err) => console.error(err));
  }

  if (keterangan) {
    return (
      <div>
        <Modal isOpen={showModal} toggle={toggle}>
          <ModalHeader toggle={toggle}>
            <strong>{keterangan.nama}</strong>
            <h6>Rp. {numberWithCommasString(keterangan.bengkel)}</h6>
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label>Total Harga : </Label>
                <strong>
                  <p>Rp. {numberWithCommasString(data.total)}</p>
                </strong>
              </FormGroup>
              <FormGroup>
                <Label>Jumlah :</Label>
                <br />
                <Input
                  value={data.jumlah}
                  name="jumlah"
                  type="text"
                  onChange={(e) => handle(e)}
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              toggle={toggle}
              onClick={() => remove(keterangan.id_keranjang)}
            >
              <FontAwesomeIcon icon={faTrash} /> Hapus Dari Keranjang
            </Button>{" "}
            <Button
              color="primary"
              toggle={toggle}
              onClick={() => handlesubmit()}
            >
              Simpan
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  } else {
    return (
      <div>
        <Modal isOpen={showModal}>
          <ModalHeader>Kosong</ModalHeader>
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={handleClose}>
              Cancel
            </Button>{" "}
            <Button
              color="primary"
              // onClick={() => handlesubmit()}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
