const cart = [];

function bukaLogin() {
  document.getElementById("loginModal").style.display = "block";
}

function tutupLogin() {
  document.getElementById("loginModal").style.display = "none";
}

function loginSimulasi() {
  alert("Login berhasil!");
  tutupLogin();
  return false;
}

window.onclick = function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

function filterProduk() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  console.log("Input:", input); // Debugging
  const produkList = document.querySelectorAll(".produk");

  produkList.forEach(produk => {
    const title = produk.querySelector("h3").textContent.toLowerCase();
    const description = produk.querySelector("p").textContent.toLowerCase();
    console.log("Title:", title, "Description:", description); // Debugging

    if (title.includes(input) || description.includes(input)) {
      produk.style.visibility = "visible"; // Tetap terlihat
      produk.style.position = "relative"; // Pastikan posisi tetap
    } else {
      produk.style.visibility = "hidden"; // Disembunyikan tanpa mengganggu tata letak
      produk.style.position = "absolute"; // Hilangkan dari tata letak
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 1800);
}

function tambahKeKeranjang(title, price, image, kategori) {
  const existingProduct = cart.find(item => item.title === title);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ title, price, image, quantity: 1, kategori }); // tambahkan kategori!
  }
  showToast("Produk ditambahkan ke keranjang!");
}

function increaseQuantity(title) {
  const product = cart.find(item => item.title === title);
  if (product) {
    product.quantity += 1;
    bukaKeranjang();
  }
}

function decreaseQuantity(title) {
  const product = cart.find(item => item.title === title);
  if (product) {
    product.quantity -= 1;
    if (product.quantity === 0) {
      const index = cart.indexOf(product);
      cart.splice(index, 1);
    }
    bukaKeranjang();
  }
}

function bukaKeranjang() {
  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  let totalHarga = 0;
  if (cart.length === 0) {
    cartItems.innerHTML = `<div style="padding:40px 0;color:#888;font-size:18px;">Keranjang masih kosong</div>`;
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <p>${item.title}<br>Rp ${item.price.toLocaleString()}</p>
        <div>
          <button onclick="decreaseQuantity('${item.title}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity('${item.title}')">+</button>
        </div>
      `;

      cartItems.appendChild(cartItem);
      totalHarga += item.price * item.quantity;
    });

    const totalElement = document.createElement("div");
    totalElement.classList.add("total");
    totalElement.innerHTML = `<strong>Total Harga: Rp ${totalHarga.toLocaleString()}</strong>`;
    cartItems.appendChild(totalElement);
  }

  cartModal.style.display = "block";
}

function tutupKeranjang() {
  document.getElementById("cartModal").style.display = "none";
}

function checkout() {
  if (cart.length === 0) {
    alert("Keranjang Anda kosong!");
    return;
  }
  // Tampilkan pilihan ukuran sesuai kategori produk terakhir
  const lastProduct = cart[cart.length - 1];
  if (lastProduct && typeof showSizeOptions === "function") {
    showSizeOptions(lastProduct.kategori || "");
  }
  document.getElementById('paymentModal').style.display = 'block';
  tutupKeranjang();
 // ...kode event listener tombol bayar tetap...
}

  // Agar tidak double event, hapus event listener lama
  const payButton = document.getElementById('payButton');
  const newPayButton = payButton.cloneNode(true);
  payButton.parentNode.replaceChild(newPayButton, payButton);

  newPayButton.addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    if (!name || !address || !phone || !paymentMethod) {
      alert("Silakan lengkapi semua informasi!");
      return;
    }
    // Simulasi pembayaran sukses
    alert("Pembayaran berhasil!\nTerima kasih sudah berbelanja.");
    cart.length = 0; // Kosongkan keranjang
    closePaymentModal();
  });


function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}
function openProductModal(name, price, image, description, kategori) {
  document.getElementById("modalName").innerText = name;
  document.getElementById("modalPrice").innerText = "Harga: Rp " + price.toLocaleString();
  document.getElementById("modalImage").src = image;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("productModal").style.display = "block";
  window._modalProduct = { name, price, image, description, kategori };
  if (typeof showSizeOptions === "function") showSizeOptions(kategori);
}
function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
}

function addToCartFromModal() {
  const p = window._modalProduct;
  if (p) tambahKeKeranjang(p.name, p.price, p.image, p.kategori);
  closeProductModal();
}

function beliLangsung() {
  const p = window._modalProduct;
  if (p) {
    tambahKeKeranjang(p.name, p.price, p.image, p.kategori);
    closeProductModal();
    checkout(); // langsung buka modal checkout
  }
}

 function showSizeOptions(kategori) {
  const sizeGroup = document.getElementById('sizeGroup');
  const sizeSelect = document.getElementById('size');
  let options = [];
  if (kategori && kategori.toLowerCase() === "sepatu") {
    options = ["36","37","38","39","40","41","42","43","44"];
  } else if (kategori && (
    kategori.toLowerCase() === "kaos" ||
    kategori.toLowerCase() === "jaket" ||
    kategori.toLowerCase() === "hoodie" ||
    kategori.toLowerCase() === "t-shirt"
  )) {
    options = ["S","M","L","XL","XXL"];
  } else if (kategori && (
    kategori.toLowerCase() === "topi" ||
    kategori.toLowerCase() === "aksesoris" ||
    kategori.toLowerCase() === "tas" ||
    kategori.toLowerCase() === "kaos kaki" ||
    kategori.toLowerCase() === "sandal"
  )) {
    options = ["All Size"];
  }

  if (options.length > 0) {
    sizeGroup.style.display = "block";
    sizeSelect.innerHTML = `<option value="">Pilih Ukuran</option>` + options.map(opt => `<option value="${opt}">${opt}</option>`).join("");
    sizeSelect.required = true;
  } else {
    sizeGroup.style.display = "none";
    sizeSelect.required = false;
  }
}
  
