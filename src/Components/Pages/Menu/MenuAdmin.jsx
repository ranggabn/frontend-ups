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
import { NavLink as RRNavLink } from "react-router-dom";

const NavbarComp = () => {
  const { dispatch } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <div>
      <Navbar color="dark" dark expand="md">
        <Container>
          <NavbarBrand href="/">UPS </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink tag={RRNavLink} to="/toko" activeClassName="active">
                  Kasir Normal
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RRNavLink}
                  activeClassName="active"
                  to="/tokobengkel"
                >
                  Kasir Bengkel
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RRNavLink}
                  activeClassName="active"
                  to="/listbarang"
                >
                  Barang
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RRNavLink}
                  activeClassName="active"
                  to="/listhutang"
                >
                  Hutang
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RRNavLink}
                  activeClassName="active"
                  to="/listpihutang"
                >
                  Piutang
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RRNavLink}
                  activeClassName="active"
                  to="/listjual"
                >
                  Penjualan
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  tag={RRNavLink}
                  activeClassName="active"
                  to="/listbeli"
                >
                  Pembelian
                </NavLink>
              </NavItem>
            </Nav>
            <NavbarText>
              <Button className="mr-3 flex-display" href="/profil">
                Ubah Password
              </Button>
              <Button
                onClick={() => dispatch({ type: "LOGOUT" })}
                href="/masuk"
                className="flex-display"
              >
                Keluar
              </Button>
            </NavbarText>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
