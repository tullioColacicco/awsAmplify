import React, { useEffect, useReducer } from "react";

import { withAuthenticator } from "aws-amplify-react";
import { Auth } from "aws-amplify";
import NavBar from "./components/Navbar";
import Products from "./components/Products";
import Cart from "./components/Cart";
import history from "./utils/history";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Router, Route, Switch } from "react-router-dom";
import { listProducts } from "./graphql/queries";
import { getCart } from "./graphql/queries";
import { getProduct } from "./graphql/queries";
// import { createCart } from "./graphql/mutations";
import { updateProduct } from "./graphql/mutations";
import API, { graphqlOperation } from "@aws-amplify/api";

const initialState = {
  user: null,
  products: [],
  cart: {},
  cartItems: []
};

const MyTheme = {
  // googleSignInButton: { backgroundColor: "red", borderColor: "red" },
  button: { backgroundColor: "green", borderColor: "red" },
  signInButtonIcon: { display: "none" }
};
export const Store = React.createContext(initialState);

function reducer(state, action) {
  switch (action.type) {
    case "GET_PRODUCTS":
      return { ...state, products: action.payload };
    case "GET_USER":
      return { ...state, user: action.payload };
    case "CREATE_BAGEL":
      return { ...state, products: [...state.products, action.payload] };
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_CART_ITEMS":
      return { ...state, cartItems: action.payload };
    case "REMOVE_FROM_CART":
      const newCartItems = state.cartItems.filter(
        c => c.id !== action.payload.id
      );
      return { ...state, cartItems: newCartItems };
    case "ADD_TO_CART":
      return { ...state, cartItems: [...state.cartItems, action.payload] };

    case "SETINPUT":
      return { ...state, [action.key]: action.value };
    default:
      return state;
  }
}
function App() {
  // const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(state);

  useEffect(() => {
    getUser();
    getProducts();
    getMycart();
    getmyProduct();
    // addToCart();
  }, []);

  async function getUser() {
    const result = await Auth.currentSession();
    dispatch({ type: "GET_USER", payload: result });
  }
  async function getProducts() {
    const allProducts = await API.graphql(graphqlOperation(listProducts));

    dispatch({
      type: "GET_PRODUCTS",
      payload: allProducts.data.listProducts.items
    });
    // setProducts(allProducts.data.listProducts.items);
  }
  // function to create a cart
  // async function createMycart() {
  //   const myCart = await API.graphql(
  //     graphqlOperation(createCart, { input: {} })
  //   );
  //   console.log(myCart);
  // }
  async function addToCart() {
    const myCart = await API.graphql(
      graphqlOperation(updateProduct, {
        input: {
          id: "fee3cc6e-0a2e-47c1-8e4f-38db954a19be",
          productMyCartId: "193d07c0-19cb-4ed0-a97b-110e364a0d8c"
        }
      })
    );
    console.log(myCart);
  }
  async function getMycart() {
    const allcarts = await API.graphql(
      graphqlOperation(getCart, { id: "193d07c0-19cb-4ed0-a97b-110e364a0d8c" })
    );
    console.log(allcarts.data.getCart.products.items, "hello");
    dispatch({
      type: "SET_CART",
      payload: allcarts.data.getCart
    });
    dispatch({
      type: "SET_CART_ITEMS",
      payload: allcarts.data.getCart.products.items
    });
    // setProducts(allProducts.data.listProducts.items);
  }
  async function getmyProduct() {
    const allcarts = await API.graphql(
      graphqlOperation(getProduct, {
        id: "fee3cc6e-0a2e-47c1-8e4f-38db954a19be"
      })
    );
    // console.log(allcarts);
    // dispatch({
    //   type: "GET_PRODUCTS",
    //   payload: allProducts.data.listProducts.items
    // });
    // setProducts(allProducts.data.listProducts.items);
  }
  // Auth.currentSession()
  //   .then(data => console.log(data))
  //   .catch(err => console.log(err));
  return (
    <Store.Provider value={{ state, dispatch }}>
      <Router history={history}>
        <div className="App">
          <NavBar />
          <Switch>
            <div>
              <Grid container>
                <Grid container spacing={3}>
                  <Grid item xs>
                    {/* <Paper>xs</Paper> */}
                  </Grid>
                  <Grid item xs={6}>
                    <Paper>
                      <Route path="/" exact component={Products} />
                      <Route path="/myCart" exact component={Cart} />
                    </Paper>
                  </Grid>
                  <Grid item xs>
                    {/* <Paper>xs</Paper> */}
                  </Grid>
                </Grid>
              </Grid>
            </div>

            <Route path="/myCart" />
          </Switch>
          <header className="App-header"></header>
        </div>
      </Router>
    </Store.Provider>
  );
}

export default withAuthenticator(
  App,
  { includeGreetings: true, theme: { MyTheme } },
  [],
  null,
  MyTheme
);
