import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../App";
import MenuAdmin from "./MenuAdmin";
import MenuPublik from "./MenuPublik";

export default function MenuComp() {
  const { state } = useContext(AuthContext);

  const [user, setUser] = useState([]);

  useEffect(() => {
    const loggedInUser = state.user;
    // console.log(loggedInUser);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, [state.user]);

  if (user  && state.role == 1) {
    return <MenuAdmin />;
  } else {
    return <MenuPublik />;
  }
}
