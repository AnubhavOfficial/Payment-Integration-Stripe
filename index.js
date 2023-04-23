var cors = require("cors");
const express = require("express");
const stripe = require("stripe")(
  "sk_test_51LgMdfSESJI0uOFOAObhJNScXxTqdVf7nZxPW790mpjpBfl58njg2Onbscoljx9U6nyY7bAUz7fV1hKrRhob0kVX00PBXtO9mM"
);
const uuid = require("uuid").v4;
const app = express();
var whitelist = [
  "https://amazon-clone-anubhav.netlify.app",
  "https://amazon-clone-anubhav.netlify.app/Cart",
  "https://amazon-clone-anubhav.netlify.app/products/1/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/2/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/3/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/4/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/5/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/6/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/7/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/8/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/9/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/10/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/11/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/12/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/13/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/14/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/15/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/16/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/17/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/18/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/19/AddedToCart",
  "https://amazon-clone-anubhav.netlify.app/products/20/AddedToCart",
]; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "device-remember-token",
    "Access-Control-Allow-Origin",
    "Origin",
    "Accept",
  ],
};

app.use(cors(corsOptions));

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());

//routes

app.get("/", (req, res) => {
  res.send("It works");
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
  console.log("gotcha");
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
    success_url: "https://amazon-clone-anubhav.netlify.app/Checkout-success",
    cancel_url: "https://amazon-clone-anubhav.netlify.app/Cart",
  });

  res.send(session);
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Listening at port 5000")
);
