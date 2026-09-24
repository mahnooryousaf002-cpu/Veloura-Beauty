/* =========================================
   VELOURA BEAUTY - MAIN JAVASCRIPT
   ========================================= */

/* ---------- CART STORAGE ---------- */

function getCart() {
    return JSON.parse(localStorage.getItem("velouraCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("velouraCart", JSON.stringify(cart));
}


/* ---------- ADD TO CART ---------- */

function addToCart(name, price, image) {

    let cart = getCart();

    let existingProduct = cart.find(product => product.name === name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            image: image || "",
            quantity: 1
        });
    }

    saveCart(cart);
    updateCartCount();

    alert(name + " added to cart!");

    /* OPEN CART PAGE AUTOMATICALLY */
    window.location.href = "cart.html";
}


/* ---------- CART COUNT ---------- */

function updateCartCount() {

    let cart = getCart();

    let totalQuantity = cart.reduce(function(total, product) {
        return total + Number(product.quantity || 1);
    }, 0);

    let cartButtons = document.querySelectorAll(".cart-btn");

    cartButtons.forEach(function(button) {
        button.textContent = "Cart (" + totalQuantity + ")";
    });

    /* Also support links/buttons containing Cart */
    let cartLinks = document.querySelectorAll("a[href='cart.html']");

    cartLinks.forEach(function(link) {

        if (
            link.textContent.includes("Cart") ||
            link.classList.contains("cart-btn")
        ) {
            link.textContent = "Cart (" + totalQuantity + ")";
        }

    });
}


/* ---------- RENDER CART ---------- */

function renderCart() {

    let cartContainer = document.getElementById("cartItems");

    if (!cartContainer) {
        return;
    }

    let cart = getCart();

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div style="
                text-align:center;
                padding:60px 20px;
                background:#fff;
                border-radius:20px;
                margin:20px 0;
            ">
                <h2>Your Cart is Empty</h2>
                <p>Add some beautiful products to your cart.</p>

                <a href="makeup.html"
                   style="
                   display:inline-block;
                   margin-top:20px;
                   padding:14px 30px;
                   background:#7b405c;
                   color:white;
                   text-decoration:none;
                   border-radius:8px;
                   ">
                   Continue Shopping
                </a>
            </div>
        `;

        updateCartTotal();
        return;
    }


    cartContainer.innerHTML = cart.map(function(product, index) {

        let imageHTML = "";

        if (product.image) {
            imageHTML = `
                <img src="${product.image}"
                     alt="${product.name}"
                     style="
                     width:90px;
                     height:90px;
                     object-fit:cover;
                     border-radius:10px;
                     ">
            `;
        }

        return `
            <div class="cart-item"
                 style="
                 display:flex;
                 align-items:center;
                 gap:20px;
                 padding:20px;
                 margin-bottom:15px;
                 background:white;
                 border-radius:15px;
                 box-shadow:0 5px 20px rgba(0,0,0,0.05);
                 ">

                ${imageHTML}

                <div style="flex:1;">

                    <h3 style="margin:0 0 8px;">
                        ${product.name}
                    </h3>

                    <p style="margin:0 0 10px;">
                        Rs. ${Number(product.price).toLocaleString()}
                    </p>

                    <div style="
                        display:flex;
                        align-items:center;
                        gap:10px;
                    ">

                        <button
                            onclick="changeQuantity(${index}, -1)"
                            style="
                            padding:6px 12px;
                            cursor:pointer;
                            ">
                            −
                        </button>

                        <strong>
                            ${product.quantity}
                        </strong>

                        <button
                            onclick="changeQuantity(${index}, 1)"
                            style="
                            padding:6px 12px;
                            cursor:pointer;
                            ">
                            +
                        </button>

                    </div>

                </div>

                <button
                    onclick="removeFromCart(${index})"
                    style="
                    background:#7b405c;
                    color:white;
                    border:none;
                    padding:10px 15px;
                    border-radius:7px;
                    cursor:pointer;
                    ">
                    Remove
                </button>

            </div>
        `;

    }).join("");

    updateCartTotal();
}


/* ---------- UPDATE TOTAL ---------- */

function updateCartTotal() {

    let totalElement = document.getElementById("cartTotal");

    if (!totalElement) {
        return;
    }

    let cart = getCart();

    let total = cart.reduce(function(sum, product) {

        return sum +
            Number(product.price) *
            Number(product.quantity || 1);

    }, 0);

    totalElement.textContent =
        "Rs. " + total.toLocaleString();
}


/* ---------- CHANGE QUANTITY ---------- */

function changeQuantity(index, amount) {

    let cart = getCart();

    if (!cart[index]) {
        return;
    }

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);

    renderCart();
    updateCartCount();
}


/* ---------- REMOVE PRODUCT ---------- */

function removeFromCart(index) {

    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    renderCart();
    updateCartCount();
}


/* ---------- CLEAR CART ---------- */

function clearCart() {

    localStorage.removeItem("velouraCart");

    renderCart();
    updateCartCount();
}


/* ---------- CHECKOUT ---------- */

function checkout() {

    let cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "checkout.html";
}


/* ---------- CHECKOUT PAGE ---------- */

function renderCheckout() {

    let checkoutItems =
        document.getElementById("checkoutItems");

    let checkoutTotal =
        document.getElementById("checkoutTotal");

    if (!checkoutItems) {
        return;
    }

    let cart = getCart();

    if (cart.length === 0) {

        checkoutItems.innerHTML =
            "<p>Your cart is empty.</p>";

        if (checkoutTotal) {
            checkoutTotal.textContent = "Rs. 0";
        }

        return;
    }

    let total = 0;

    checkoutItems.innerHTML =
        cart.map(function(product) {

            let productTotal =
                Number(product.price) *
                Number(product.quantity);

            total += productTotal;

            return `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    padding:10px 0;
                    border-bottom:1px solid #eee;
                ">

                    <span>
                        ${product.name}
                        × ${product.quantity}
                    </span>

                    <strong>
                        Rs. ${productTotal.toLocaleString()}
                    </strong>

                </div>
            `;

        }).join("");

    if (checkoutTotal) {
        checkoutTotal.textContent =
            "Rs. " + total.toLocaleString();
    }
}


/* ---------- PLACE ORDER ---------- */

function placeOrder(event) {

    if (event) {
        event.preventDefault();
    }

    let cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(
        "Thank you for your order! Your Veloura Beauty order has been placed successfully."
    );

    localStorage.removeItem("velouraCart");

    window.location.href = "index.html";
}


/* ---------- CONTACT FORM ---------- */

function contactSubmit(event) {

    if (event) {
        event.preventDefault();
    }

    alert(
        "Thank you! Your message has been sent to Veloura Beauty."
    );

    if (event && event.target) {
        event.target.reset();
    }
}


/* ---------- NEWSLETTER ---------- */

function subscribeNewsletter(event) {

    if (event) {
        event.preventDefault();
    }

    alert(
        "Thank you for subscribing to Veloura Beauty!"
    );

    if (event && event.target) {
        event.target.reset();
    }
}


/* ---------- PAGE LOAD ---------- */

document.addEventListener("DOMContentLoaded", function() {

    updateCartCount();

    renderCart();

    renderCheckout();

});