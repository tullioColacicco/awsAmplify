/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct {
    onCreateProduct {
      id
      name
      price
      myCart {
        id
        products {
          nextToken
        }
        owner
      }
    }
  }
`;
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct {
    onUpdateProduct {
      id
      name
      price
      myCart {
        id
        products {
          nextToken
        }
        owner
      }
    }
  }
`;
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct {
    onDeleteProduct {
      id
      name
      price
      myCart {
        id
        products {
          nextToken
        }
        owner
      }
    }
  }
`;
export const onCreateCart = /* GraphQL */ `
  subscription OnCreateCart($owner: String!) {
    onCreateCart(owner: $owner) {
      id
      products {
        items {
          id
          name
          price
        }
        nextToken
      }
      owner
    }
  }
`;
export const onUpdateCart = /* GraphQL */ `
  subscription OnUpdateCart($owner: String!) {
    onUpdateCart(owner: $owner) {
      id
      products {
        items {
          id
          name
          price
        }
        nextToken
      }
      owner
    }
  }
`;
export const onDeleteCart = /* GraphQL */ `
  subscription OnDeleteCart($owner: String!) {
    onDeleteCart(owner: $owner) {
      id
      products {
        items {
          id
          name
          price
        }
        nextToken
      }
      owner
    }
  }
`;
