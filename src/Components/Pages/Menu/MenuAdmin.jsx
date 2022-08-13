import React, { useState, useContext } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Button,
  NavbarText
} from "reactstrap";
import { AuthContext } from "../../../App";

const NavbarComp = () => {
  const { dispatch } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <Container>
          <NavbarBrand href="/">UPS</NavbarBrand>
          <NavbarBrand>|</NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/toko">Kasir Normal</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/tokobengkel">Kasir Bengkel</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listbarang">Barang</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listhutang">Hutang</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listpihutang">Piutang</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listjual">Penjualan</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listbeli">Pembelian</NavLink>
              </NavItem>
            </Nav>
            <NavbarText>
            <Button className="mr-3" href="/profil">Ubah Password</Button>
            <Button onClick={() => dispatch({ type: "LOGOUT" })} href="/masuk">Keluar</Button>
          </NavbarText>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
