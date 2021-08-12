import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container
} from "reactstrap";

const NavbarComp = (props) => {
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
                <NavLink href="/">Toko</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listbarang">Barang</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listhutang">Hutang</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listpihutang">Pihutang</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listjual">Penjualan</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/listbeli">Pembelian</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComp;
