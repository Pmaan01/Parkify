export const handleStripePayment = async (spot) => {
  try {
    localStorage.setItem("pendingStripeSpot", JSON.stringify(spot)); // <- Save before redirect

    const res = await fetch("https://parkify-web-app-backend.onrender.com/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spotName: spot.name,
        price: spot.paid ? Number(spot.rate) || 2 : 2,
      }),
    });

    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to initiate payment");
    }
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    alert("Something went wrong during payment");
  }
};
