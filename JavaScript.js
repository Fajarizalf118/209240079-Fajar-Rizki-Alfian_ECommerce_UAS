// Variabel global untuk menyimpan item di keranjang belanja
const cart = [];

// --- FUNGSI UNTUK MODAL LOGIN ---

// Fungsi untuk menampilkan modal login
function bukaLogin() {
  document.getElementById("loginModal").style.display = "block";
}

// Fungsi untuk menyembunyikan modal login
function tutupLogin() {
  document.getElementById("loginModal").style.display = "none";
}

// Fungsi untuk simulasi proses login
function loginSimulasi() {
  alert("Login berhasil!"); // Menampilkan notifikasi
  tutupLogin(); // Menutup modal setelah login
  return false; // Mencegah form dari submit default
}

// Menutup modal login jika pengguna mengklik di luar area modal
window.onclick = function (event) {
  const modal = document.getElementById("loginModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// --- FUNGSI PENCARIAN & NOTIFIKASI ---

// Fungsi untuk memfilter produk berdasarkan input pencarian
function filterProduk() {
  const input = document.getElementById("searchInput").value.toLowerCase(); // Ambil & ubah input ke huruf kecil
  const produkList = document.querySelectorAll(".produk"); // Ambil semua elemen produk

  produkList.forEach(produk => {
    const title = produk.querySelector("h3").textContent.toLowerCase(); // Ambil judul produk
    const description = produk.querySelector("p").textContent.toLowerCase(); // Ambil deskripsi produk

    // Cek apakah input ada di judul atau deskripsi
    if (title.includes(input) || description.includes(input)) {
      produk.style.display = "flex"; // Tampilkan produk jika cocok
    } else {
      produk.style.display = "none"; // Sembunyikan jika tidak cocok
    }
  });
}

// Fungsi untuk menampilkan notifikasi singkat (toast)
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg; // Atur pesan notifikasi
  toast.style.display = "block"; // Tampilkan notifikasi
  // Sembunyikan notifikasi setelah 1.8 detik
  setTimeout(() => { toast.style.display = "none"; }, 1800);
}

// --- FUNGSI MANAJEMEN KERANJANG ---

// Fungsi untuk menambahkan produk ke dalam variabel 'cart'
function tambahKeKeranjang(title, price, image, kategori) {
  // Cek apakah produk sudah ada di keranjang
  const existingProduct = cart.find(item => item.title === title);
  if (existingProduct) {
    existingProduct.quantity += 1; // Jika ada, tambah jumlahnya
  } else {
    // Jika belum ada, tambahkan produk baru ke keranjang
    cart.push({ title, price, image, quantity: 1, kategori });
  }
  showToast("Produk ditambahkan ke keranjang!"); // Tampilkan notifikasi
}

// Fungsi untuk menambah jumlah (quantity) item di keranjang
function increaseQuantity(title) {
  const product = cart.find(item => item.title === title);
  if (product) {
    product.quantity += 1;
    bukaKeranjang(); // Perbarui tampilan keranjang
  }
}

// Fungsi untuk mengurangi jumlah (quantity) item di keranjang
function decreaseQuantity(title) {
  const product = cart.find(item => item.title === title);
  if (product) {
    product.quantity -= 1;
    // Jika jumlah jadi 0, hapus item dari keranjang
    if (product.quantity === 0) {
      const index = cart.indexOf(product);
      cart.splice(index, 1);
    }
    bukaKeranjang(); // Perbarui tampilan keranjang
  }
}

// --- FUNGSI MODAL KERANJANG & CHECKOUT ---

// Fungsi untuk membuka dan merender isi modal keranjang
function bukaKeranjang() {
  const cartModal = document.getElementById("cartModal");
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = ""; // Kosongkan isi keranjang sebelumnya

  let totalHarga = 0;
  // Jika keranjang kosong, tampilkan pesan
  if (cart.length === 0) {
    cartItems.innerHTML = `<div style="padding:40px 0;color:#888;font-size:18px;">Keranjang masih kosong</div>`;
  } else {
    // Jika ada isinya, render setiap item
    cart.forEach(item => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      // Template HTML untuk setiap item di keranjang
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
      totalHarga += item.price * item.quantity; // Hitung total harga
    });

    // Buat dan tampilkan elemen total harga
    const totalElement = document.createElement("div");
    totalElement.classList.add("total");
    totalElement.innerHTML = `<strong>Total Harga: Rp ${totalHarga.toLocaleString()}</strong>`;
    cartItems.appendChild(totalElement);
  }

  cartModal.style.display = "block"; // Tampilkan modal keranjang
}

// Fungsi untuk menutup modal keranjang
function tutupKeranjang() {
  document.getElementById("cartModal").style.display = "none";
}

// Fungsi untuk proses checkout
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang Anda kosong!");
    return;
  }
  
  // Menampilkan pilihan ukuran berdasarkan kategori produk terakhir
  const lastProduct = cart[cart.length - 1];
  if (lastProduct && typeof showSizeOptions === "function") {
    showSizeOptions(lastProduct.kategori || "");
  }
  
  document.getElementById('paymentModal').style.display = 'block'; // Tampilkan modal pembayaran
  tutupKeranjang(); // Tutup modal keranjang

  // Trik untuk mencegah event listener terpasang berkali-kali pada tombol 'Bayar'
  const payButton = document.getElementById('payButton');
  const newPayButton = payButton.cloneNode(true); // Kloning tombol
  payButton.parentNode.replaceChild(newPayButton, payButton); // Ganti tombol lama dengan kloningan

  // Tambahkan event listener baru pada tombol kloningan
  newPayButton.addEventListener('click', function() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    // Validasi form pembayaran
    if (!name || !address || !phone || !paymentMethod) {
      alert("Silakan lengkapi semua informasi!");
      return;
    }
    alert("Pembayaran berhasil!\nTerima kasih sudah berbelanja.");
    cart.length = 0; // Kosongkan keranjang setelah berhasil
    closePaymentModal(); // Tutup modal pembayaran
    bukaKeranjang(); // Perbarui tampilan keranjang (yang kini kosong)
  });
}

// Fungsi untuk menutup modal pembayaran
function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

// --- FUNGSI MODAL DETAIL PRODUK ---

// Fungsi untuk menampilkan modal detail produk
function openProductModal(name, price, image, description, kategori) {
  document.getElementById("modalName").innerText = name;
  document.getElementById("modalPrice").innerText = "Harga: Rp " + price.toLocaleString();
  document.getElementById("modalImage").src = image;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("productModal").style.display = "block";
  
  // Simpan detail produk sementara di window untuk digunakan fungsi lain
  window._modalProduct = { name, price, image, description, kategori };

  // Tampilkan opsi ukuran jika ada
  if (typeof showSizeOptions === "function") showSizeOptions(kategori);
}

// Fungsi untuk menutup modal detail produk
function closeProductModal() {
  document.getElementById("productModal").style.display = "none";
}

// Fungsi untuk tombol "Tambah ke Keranjang" dari dalam modal
function addToCartFromModal() {
  const p = window._modalProduct; // Ambil data produk yang disimpan
  if (p) tambahKeKeranjang(p.name, p.price, p.image, p.kategori);
  closeProductModal();
}

// Fungsi untuk tombol "Beli Langsung" dari dalam modal
function beliLangsung() {
  const p = window._modalProduct; // Ambil data produk yang disimpan
  if (p) {
    tambahKeKeranjang(p.name, p.price, p.image, p.kategori); // Tambah ke keranjang
    closeProductModal(); // Tutup modal detail
    checkout(); // Langsung ke proses checkout
  }
}

// --- FUNGSI LAIN-LAIN ---

// Fungsi untuk menampilkan opsi ukuran berdasarkan kategori produk
function showSizeOptions(kategori) {
  const sizeGroup = document.getElementById('sizeGroup');
  const sizeSelect = document.getElementById('size');
  let options = []; // Array untuk menyimpan pilihan ukuran

  // Logika untuk menentukan pilihan ukuran
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

  // Jika ada opsi ukuran, tampilkan dropdown-nya
  if (options.length > 0) {
    sizeGroup.style.display = "block";
    sizeSelect.innerHTML = `<option value="">Pilih Ukuran</option>` + options.map(opt => `<option value="${opt}">${opt}</option>`).join("");
    sizeSelect.required = true; // Jadikan wajib diisi
  } else {
    // Jika tidak ada, sembunyikan dropdown
    sizeGroup.style.display = "none";
    sizeSelect.required = false;
  }
}
