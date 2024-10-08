// Utility functions
function getBasePrice() {
    const priceElement = document.getElementById('price');
    return parseFloat(priceElement.innerText.replace('$', ''));
}

function updatePrice() {
    const basePrice = getBasePrice();
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = (basePrice * quantity).toFixed(2);
    document.getElementById('price').innerText = `$${totalPrice}`;
}

function getPriceInINR() {
    const priceElement = document.getElementById('price');
    const priceInUSD = parseFloat(priceElement.innerText.replace('$', ''));
    const usdToInrRate = 83; 
    return Math.round(priceInUSD * usdToInrRate * 100); 
}

// Razorpay Integration
function initRazorpay() {
    var options = {
        "key": "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Razorpay Key ID
        "amount": getPriceInINR(),
        "currency": "INR",
        "name": "NightOwl Store",
        "description": "Taylor Swift Eras Tour Bookmarks",
        "image": "../image/logo.png",
        "handler": function (response) {
            alert("Payment successful! Razorpay Payment ID: " + response.razorpay_payment_id);
            // Here you should verify the payment on your server before confirming the order
        },
        "prefill": {
            "email": "customer@example.com",
            "contact": "+919900000000",
        },
        "theme": {
            "color": "#3399cc"
        }
    };

    var rzp = new Razorpay(options);
    rzp.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
    });

    document.getElementById('rzp-button1').onclick = function(e){
        options.amount = getPriceInINR();
        rzp = new Razorpay(options);
        rzp.open();
        e.preventDefault();
    }
}

// PayPal Integration
function initPayPal() {
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: document.getElementById('price').innerText.replace('$', '')
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                alert('Transaction completed by ' + details.payer.name.given_name);
                // Call your server to save the transaction
            });
        }
    }).render('#paypal-button-container');
}

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    updatePrice();
    initRazorpay();
    initPayPal();

    // Add change event listener to the quantity select
    document.getElementById('quantity').addEventListener('change', function() {
        updatePrice();
        // Re-render PayPal buttons with new price
        document.getElementById('paypal-button-container').innerHTML = '';
        initPayPal();
    });
});