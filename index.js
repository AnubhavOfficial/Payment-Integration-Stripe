const cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51LgMdfSESJI0uOFOAObhJNScXxTqdVf7nZxPW790mpjpBfl58njg2Onbscoljx9U6nyY7bAUz7fV1hKrRhob0kVX00PBXtO9mM"
);
const uuid = require("uuid").v4;
const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(cors());

//routes

app.get("/", (req, res) => {
  res.send("It works");
});
app.post("/jsonApi", (req, res) => {
  const { jsonObj } = req.body;
  if (jsonObj.username === "Anubhav") {
    res.send({ status: 200 });
  } else {
    res.send({ status: 401 });
  }
});

app.post("/checkout", async (req, res) => {
  const line_items = req.body.cartItems.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: [item.image],
          metadata: {
            id: item.id,
          },
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });
  const email = req.body.email;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "IN"],
    },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "inr",
          },
          display_name: "Free shipping",
          // Delivers between 5-7 business days
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 5,
            },
            maximum: {
              unit: "business_day",
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 8000,
            currency: "inr",
          },
          display_name: "Next day air",
          // Delivers in exactly 1 business day
          delivery_estimate: {
            minimum: {
              unit: "business_day",
              value: 1,
            },
            maximum: {
              unit: "business_day",
              value: 1,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    line_items,
    mode: "payment",
    success_url: "http://localhost:3000/Checkout-success",
    cancel_url: "http://localhost:3000/Cart",
  });

  res.send(session);
});

// app.post("/checkoutNew", cors(), (req, res) => {
//   //   let { amount, id } = req.body;
//   const { product, token } = req.body;
//   // let paymentsIntent = {};
//   try {
//     stripe.customers
//       .create({
//         email: token.email,
//         source: token.id,
//       })
//       .then((customer) => {
//         stripe.paymentIntents.create({
//           amount: product.price * 100,
//           currency: "INR",
//           customer: customer.id,
//           description: "Amazon Replica",
//           payment_method_types: ["card"],
//           payment_method: token.card.id,
//           confirm: true,
//           receipt_email: token.email,
//           shipping: {
//             name: token.card.name,
//             address: {
//               country: token.card.address_country,
//             },
//           },
//         });
//       })
//       .then((result) => res.status(200).json({ result }))
//       .catch((err) => console.log(err));
//   } catch (err) {
//     console.log(err);
//   }
//   console.log("Payment", payment);
//   res.json({
//     message: "Payment succesful",
//     success: true,
//     session: session,
//   });
// } catch (error) {
//   console.log("Error", error);
//   res.json({
//     message: "Payment failed",
//     success: false,
//     session: session,
//   });
// }
// });

// app.post("/checkout", (req, res) => {
//   const { product, token } = req.body;
//   console.log(product);
//   console.log("Product", product);
//   console.log("Price", product.price);

//   const idempontencyKey = uuid();

//   return stripe.customers
//     .create({
//       email: token.email,
//       source: token.id,
//     })
//     .then((customer) => {
//       stripe.charges.create(
//         {
//           amount: product.price * 100,
//           currency: "USD",
//           customer: customer.id,
//           receipt_email: token.email,
//           description: `Purchase of ${product.name}`,
//           shipping: {
//             name: token.card.name,
//             address: {
//               country: token.card.address_country,
//             },
//           },
//         },
//         { idempontencyKey }
//       );
//     })
//     .then((result) => res.status(200).json(result))
//     .catch((err) => console.log(err));
// });

//listen
app.listen(5000, () => console.log("Listening at port 5000"));

// shipping_address_collection: {
//   allowed_countries: ["US", "CA"],
// },
// shipping_options: [
//   {
//     shipping_rate_data: {
//       type: "fixed_amount",
//       fixed_amount: {
//         amount: 0,
//         currency: "inr",
//       },
//       display_name: "Free shipping",
//       // Delivers between 5-7 business days
//       delivery_estimate: {
//         minimum: {
//           unit: "business_day",
//           value: 5,
//         },
//         maximum: {
//           unit: "business_day",
//           value: 7,
//         },
//       },
//     },
//   },
//   {
//     shipping_rate_data: {
//       type: "fixed_amount",
//       fixed_amount: {
//         amount: 1500,
//         currency: "inr",
//       },
//       display_name: "Next day air",
//       // Delivers in exactly 1 business day
//       delivery_estimate: {
//         minimum: {
//           unit: "business_day",
//           value: 1,
//         },
//         maximum: {
//           unit: "business_day",
//           value: 1,
//         },
//       },
//     },
//   },
// ]
