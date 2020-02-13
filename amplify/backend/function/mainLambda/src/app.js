/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION

Amplify Params - DO NOT EDIT */

var express = require("express");
var bodyParser = require("body-parser");
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());
const stripe = require("stripe")("sk_test_oUTMQgFDLdWg0ZZEixh6ZaX200BVO5Q0VC");
// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/items", function(req, res) {
  const people = [{ name: "charles" }, { name: "tullio" }];
  res.json({ success: "get call succeed!", url: req.url, people });
});

app.get("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "get call succeed!", url: req.url });
});

/****************************
 * Example post method *
 ****************************/

app.post("/checkout", async function(req, res) {
  let error;
  let status;
  try {
    const customer = await stripe.customers.create({
      email: req.body.token.email,
      source: req.body.token.id
    });

    const idempotency_key = req.body.token.id;
    const charge = await stripe.charges.create(
      {
        amount: req.body.total * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: req.body.token.email,
        description: `Purchased the bagel`,
        shipping: {
          name: req.body.token.card.name,
          address: {
            line1: req.body.token.card.address_line1,
            line2: req.body.token.card.address_line2,
            city: req.body.token.card.address_city,
            country: req.body.token.card.address_country,
            postal_code: req.body.token.card.address_zip
          }
        }
      },
      {
        idempotency_key
      }
    );
    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

app.post("/items/*", function(req, res) {
  // Add your code here
  res.json({
    success: "post call succeed!",
    url: req.url,
    body: req.body,
    error,
    status
  });
});

app.post("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "post call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example put method *
 ****************************/

app.put("/items", function(req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

app.put("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "put call succeed!", url: req.url, body: req.body });
});

/****************************
 * Example delete method *
 ****************************/

app.delete("/items", function(req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.delete("/items/*", function(req, res) {
  // Add your code here
  res.json({ success: "delete call succeed!", url: req.url });
});

app.listen(3001, function() {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
