window.addToCart = addToCart;
window.toggleCartPopup = toggleCartPopup;
window.addEventListener("DOMContentLoaded", () => {
    updateCartUI();
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        updateLoginUI(loggedInUser);
    }
});


// Popup Liên hệ
function openPopup() {
    const width = 600;
    const height = 500;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open("Contact.html", "Popup", `width=${width},height=${height},top=${top},left=${left}`);
}

// Popup Sản phẩm
function openProductPopup(title, description, imageUrl) {
    const popup = document.getElementById("productPopup");
    const overlay = document.getElementById("popupOverlay");

    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupDescription").textContent = description;
    document.getElementById("popupImage").src = imageUrl;

    overlay.classList.add("fade-in");
    popup.classList.add("fade-in");
    overlay.style.display = "block";
    popup.style.display = "block";

    requestAnimationFrame(() => {
        popup.classList.remove("hide");
        popup.classList.add("show");
        overlay.classList.add("show");
    });
}

function closePopup() {
    const popup = document.getElementById("productPopup");
    const overlay = document.getElementById("popupOverlay");

    popup.classList.remove("show");
    popup.classList.add("hide");
    overlay.classList.remove("show");

    setTimeout(() => {
        popup.style.display = "none";
        overlay.style.display = "none";
        popup.classList.remove("hide");
        overlay.classList.remove("fade-in");
        popup.classList.remove("fade-in");
    }, 300);
}

// Spinner loading khi vào trang
window.addEventListener("load", () => {
    const loader = document.querySelector(".loading-spinner-container");
    if (loader) {
        loader.classList.add("fade-out");
        setTimeout(() => {
            loader.style.display = "none";
        }, 600);
    }
});

// Auth Popup
function openAuthPopup() {
    const popup = document.getElementById("authPopup");
    const overlay = document.getElementById("authOverlay");

    popup.style.display = "block";
    overlay.style.display = "block";
    requestAnimationFrame(() => {
        popup.classList.remove("hide");
        popup.classList.add("show", "fade-in");
        overlay.classList.add("show", "fade-in");
    });
}

function closeAuthPopup() {
    const popup = document.getElementById("authPopup");
    const overlay = document.getElementById("authOverlay");

    popup.classList.remove("show");
    popup.classList.add("hide");
    overlay.classList.remove("show");

    setTimeout(() => {
        popup.style.display = "none";
        overlay.style.display = "none";
        popup.classList.remove("hide", "fade-in");
        overlay.classList.remove("fade-in");
    }, 300);
}
function switchTab(tab) {
    const loginContainer = document.getElementById("loginFormContainer");
    const registerContainer = document.getElementById("registerFormContainer");
    const tabs = document.querySelectorAll(".auth-tab");

    if (tab === "login") {
        loginContainer.classList.remove("hidden");
        registerContainer.classList.add("hidden");
        tabs[0].classList.add("active");
        tabs[1].classList.remove("active");
    } else {
        registerContainer.classList.remove("hidden");
        loginContainer.classList.add("hidden");
        tabs[0].classList.remove("active");
        tabs[1].classList.add("active");
    }
}


// Cart logic
let cart = JSON.parse(localStorage.getItem('cart')) || []; 

function addToCart(button) {
    const card = button.closest('.reward-card');
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const img = card.dataset.img;

    const product = { name, price, img };

    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}



function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    cartItems.innerHTML = '';

    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.quantity * item.price;
        total += itemTotal;
        count += item.quantity;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-qty-controls" data-index="${index}">
                <button class="qty-minus" aria-label="Giảm số lượng">−</button>
                <span>${item.quantity}</span>
                <button class="qty-plus" aria-label="Tăng số lượng">+</button>
            </div>
            <div>${itemTotal.toLocaleString()}₫</div>
            <button class="cart-remove" data-index="${index}" aria-label="Xóa sản phẩm">X</button>
        `;

        // Gắn sự kiện
        div.querySelector('.qty-minus').addEventListener('click', () => {
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1); // Xóa nếu còn 1
            }
            updateCartUI();
        });

        div.querySelector('.qty-plus').addEventListener('click', () => {
            cart[index].quantity += 1;
            updateCartUI();
        });

        div.querySelector('.cart-remove').addEventListener('click', () => {
            cart.splice(index, 1);
            updateCartUI();
        });

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toLocaleString() + '₫';
    cartCount.textContent = count;
    localStorage.setItem('cart', JSON.stringify(cart));
}
function toggleCartPopup() {
    const popup = document.getElementById("cartPopup");
    const overlay = document.getElementById("cartOverlay");
    const isVisible = popup.classList.contains("show");

    if (!isVisible) {
        popup.style.display = "block";
        overlay.style.display = "block";

        requestAnimationFrame(() => {
            popup.classList.add("fade-in", "show");
            overlay.classList.add("fade-in", "show");
        });
    } else {
        popup.classList.remove("fade-in", "show");
        overlay.classList.remove("fade-in", "show");
        setTimeout(() => {
            popup.style.display = "none";
            overlay.style.display = "none";
        }, 300);
    }
}

function closeCartPopup() {
    const popup = document.getElementById("cartPopup");
    const overlay = document.getElementById("cartOverlay");

    popup.classList.remove("fade-in", "show");
    overlay.classList.remove("fade-in", "show");

    setTimeout(() => {
        popup.style.display = "none";
        overlay.style.display = "none";
    }, 300);
}

function changeQuantity(index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        updateCartUI();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống.");
        return;
    }
    alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm nhất.");
    cart = [];
    localStorage.removeItem("cart");
    updateCartUI();
}

// Xử lý Auth
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value.trim();
    const password = form.password.value;
    const savedUser = JSON.parse(localStorage.getItem("userData"));

    if (!savedUser) {
        alert("Chưa có người dùng nào được đăng ký.");
        return;
    }

    if (username === savedUser.username && password === savedUser.password) {
        alert("Đăng nhập thành công!");
        localStorage.setItem("loggedInUser", username);
        closeAuthPopup();
        updateLoginUI(username);
    } else {
        alert("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
}

function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!username || !email || !password) {
        alert("Vui lòng điền đầy đủ thông tin.");
        return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        alert("Email không hợp lệ.");
        return;
    }
    if (password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    const userData = { username, email, password };
    localStorage.setItem("userData", JSON.stringify(userData));
    alert("Đăng ký thành công!");
    form.reset();
    closeAuthPopup();
}

function updateLoginUI(username) {
    const loginLink = document.getElementById("authLink");
    if (loginLink) {
        loginLink.textContent = `Đăng xuất (${username})`;
        loginLink.setAttribute("onclick", "logout()");
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    alert("Bạn đã đăng xuất!");
    const loginLink = document.getElementById("authLink");
    if (loginLink) {
        loginLink.textContent = "Đăng nhập/Đăng ký";
        loginLink.setAttribute("onclick", "openAuthPopup()");
    }
}
