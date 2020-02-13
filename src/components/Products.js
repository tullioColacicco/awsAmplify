import React, { useState, useContext } from "react";
// import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import API, { graphqlOperation } from "@aws-amplify/api";
import awsconfig from "../aws-exports";
import { createProduct } from "../graphql/mutations";
import { updateProduct } from "../graphql/mutations";
// import { listProducts } from "../graphql/queries";
import { Store } from "../App";
API.configure(awsconfig);

export default function Products() {
  const context = useContext(Store);
  console.log(context.state.products);
  const [value, setValue] = useState({
    name: "",
    price: 10
  });

  const handleClick = () => {
    console.log(1);
  };
  const handleAddToCart = p => {
    console.log(p);
    addToCart(p);
  };
  async function addToCart(p) {
    const myCart = await API.graphql(
      graphqlOperation(updateProduct, {
        input: {
          id: p.id,
          productMyCartId: "193d07c0-19cb-4ed0-a97b-110e364a0d8c"
        }
      })
    );
    context.dispatch({ type: "ADD_TO_CART", payload: p });
    console.log(p);
  }

  const handleChange = e => {
    setValue({ ...value, [e.target.name]: e.target.value });
  };
  const handleSubmit = e => {
    e.preventDefault();
    createNewProduct();
    setValue({ name: "", price: 10 });
  };
  async function createNewProduct() {
    const product = { name: value.name, price: 10 };
    await API.graphql(graphqlOperation(createProduct, { input: product }));
    context.dispatch({ type: "CREATE_BAGEL", payload: product });
    console.log(product);
  }

  // useEffect(() => {
  //   getProducts();
  // }, []);

  return (
    <Container>
      <h3>Bagels</h3>
      {context.state.products
        ? context.state.products.map((p, i) => (
            <p key={i}>
              <button onClick={() => handleAddToCart(p)}>Add to cart</button>
              {p.name} price: ${p.price}
            </p>
          ))
        : "loading"}
      <hr />

      <div>
        <h4>create your bagel</h4>
        <form>
          <input
            type={"text"}
            name="name"
            placeholder={"your order"}
            value={value.name}
            onChange={handleChange}
          ></input>
          <input
            type={"text"}
            name={"price"}
            placeholder={"price"}
            onChange={handleChange}
            value={value.price}
          ></input>
          <br />
          <button onClick={handleSubmit}>create bagel</button>
        </form>
      </div>
    </Container>
  );
}
