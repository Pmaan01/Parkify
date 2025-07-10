const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const { spotName, price } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Parking Spot: ${spotName}`,
            },
            unit_amount: price * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/status?success=true",
      cancel_url: "http://localhost:5173/status?canceled=true",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
