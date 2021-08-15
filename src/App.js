import React, {useReducer, createContext} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import ListHutang from "./Components/Pages/Hutang/ListHutang";
import Toko from "./Components/Pages/Toko/Toko";
import TambahHutang from "./Components/Pages/Hutang/TambahHutang";
import TambahPihutang from "./Components/Pages/Pihutang/TambahPihutang";
import ListBarang from "./Components/Pages/Barang/ListBarang";
import ListPenjualan from "./Components/Pages/Penjualan/ListPenjualan";
import ListPembelian from "./Components/Pages/Pembelian/ListPembelian";
import ListPihutang from "./Components/Pages/Pihutang/ListPihutang";
import BarangBaru from "./Components/Pages/Pembelian/BarangBaru";
import EditBarang from "./Components/Pages/Barang/EditBarang";
import EditHutang from "./Components/Pages/Hutang/EditHutang";
import EditPihutang from "./Components/Pages/Pihutang/EditPihutang";
import BarangLama from "./Components/Pages/Pembelian/BarangLama";
import Home from "./Components/Pages/Home/Home";
import MenuComp from "./Components/Pages/Menu/MenuComp";
import Masuk from "./Components/Pages/Masuk/Masuk";
import TokoBengkel from "./Components/Pages/Toko Bengkel/TokoBengkel";
import Profil from "./Components/Pages/Profil/Profil";

export const AuthContext = createContext();

const initialState = {
  isAuthenticated: localStorage.getItem("token"),
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
  tokenExpires: 0,
  role: localStorage.getItem("role"),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", action.payload.user);
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
        tokenExpires: action.payload.expires,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <BrowserRouter>
      <Switch>
        <AuthContext.Provider value={{ state, dispatch }}>
          <MenuComp />
          <Route exact path="/" component={Home} />
          <Route exact path="/profil" component={Profil} />
          <Route exact path="/toko" component={Toko} />
          <Route exact path="/tokobengkel" component={TokoBengkel} />
          <Route exact path="/masuk" component={Masuk} />
          <Route exact path="/listhutang" component={ListHutang} />
          <Route exact path="/listpihutang" component={ListPihutang} />
          <Route exact path="/listbarang" component={ListBarang} />
          <Route exact path="/listjual" component={ListPenjualan} />
          <Route exact path="/listbeli" component={ListPembelian} />
          <Route exact path="/tambahhutang" component={TambahHutang} />
          <Route exact path="/barangbaru" component={BarangBaru} />
          <Route exact path="/baranglama" component={BarangLama} />
          <Route exact path="/editbarang/:kode" component={EditBarang} />
          <Route exact path="/edithutang/:id_hutang" component={EditHutang} />
          <Route exact path="/editpihutang/:id_pihutang" component={EditPihutang}/>
          <Route exact path="/tambahpihutang" component={TambahPihutang} />
        </AuthContext.Provider>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
