import React, { useContext, useEffect } from "react";

import Container from "@material-ui/core/Container";
import { updateProduct } from "../graphql/mutations";
import { data } from "../graphql/mutations";
import { Auth } from "aws-amplify";
import StripeCheckout from "react-stripe-checkout";
import axios from "axios";
import { Store } from "../App";
import API, { graphqlOperation } from "@aws-amplify/api";

export default function Cart() {
  const handleRemove = c => {
    console.log(c);
    removeFromCart(c);
  };
  async function removeFromCart(p) {
    const myCart = await API.graphql(
      graphqlOperation(updateProduct, {
        input: {
          id: p.id,
          productMyCartId: null
        }
      })
    );
    dispatch({ type: "REMOVE_FROM_CART", payload: p });
    console.log(myCart);
  }
  useEffect(() => {
    getData();
  }, []);
  async function getData() {
    try {
      const response = await API.get("restApi", "/items");
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  const { state, user, dispatch } = useContext(Store);

  let cart = false;
  let total = 0;

  if (state.cartItems) {
    cart = state.cartItems;

    for (let product of cart) {
      Number((total = product.price + total));
    }
  }

  if (state.user) {
    console.log(state.user.idToken);
  }
  async function handleToken(token, addresses) {
    const params = {
      body: { token, total }
    };
    try {
      const response = await API.post("restApi", "/checkout", params);
      console.log("data from Lambda REST API: ", response);
    } catch (err) {
      console.log("error fetching data..", err);
    }
    // console.log(token);
    //   const response = await axios.post(
    //     "https://jxj0r.sse.codesandbox.io/checkout",
    //     { token, total }
    //   );
    //   const { status } = response.data;
    //   console.log("Response:", response.data);
  }

  return (
    <div>
      {cart ? (
        <Container maxWidth="sm" fixed={true}>
          <div>
            {cart.map(c => (
              <p key={c.id}>
                {c.name}, Price: ${c.price}
                <button onClick={() => handleRemove(c)}>
                  Remove from cart
                </button>
                <button onClick={() => test}>test</button>
              </p>
            ))}
            <div>
              <h3>Total: ${total}</h3>{" "}
              <StripeCheckout
                stripeKey="pk_test_pdLubZ8zZF0ZMDRM9c5lFhIe00TBfYS71B"
                token={handleToken}
                amount={total.price * 100}
                name="Bagel Checkout"
                billingAddress
                shippingAddress
              />
            </div>
          </div>
        </Container>
      ) : (
        "loading"
      )}
    </div>
  );
}
