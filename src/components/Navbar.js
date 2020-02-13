import React, { useContext, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import Container from "@material-ui/core/Container";

import { Link } from "react-router-dom";
import { Store } from "../App";

export default function Navbar() {
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (window.location.pathname === "/myCart") {
      setValue(1);
    }
  }, []);

  const { state, user, dispatch } = useContext(Store);

  let cartLength = 0;
  let cart = false;

  if (state.cartItems) {
    cartLength = state.cartItems.length;
    cart = state.cartItems;
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div>
      <Grid container>
        <Grid container spacing={3}>
          <Grid item xs>
            {/* <Paper>xs</Paper> */}
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Products" component={Link} to={"/"}></Tab>
                <Tab
                  label={`Cart(${cartLength})`}
                  component={Link}
                  to={"/myCart"}
                />
              </Tabs>
            </Paper>
          </Grid>
          <Grid item xs>
            {/* <Paper>xs</Paper> */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
