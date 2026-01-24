import React from "react";
import './Home.css'

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Selamat Datang Di Website Kami</h1>
        <p>Toko online terpercaya untuk kebuthuan Anda</p>
        <button className="cta-button">Jelajahi Sekarang</button>
      </header>

      <section className="features">
        <h2 className="section-title">Fitur Unggulan</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              🚀
            </div>
            <h3>Pengiriman Cepat</h3>
            <p>Pengiriman dlama 24jam ke seluruh Indonesia</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🛡️
            </div>
            <h3>Garansi 100%</h3>
            <p>Garansi uang kembali jika tidak puas</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🌟
            </div>
            <h3>Kualitas Terbaik</h3>
            <p>Produk berkualitas dengan sertifikasi resmi</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              📞
            </div>
            <h3>Dukungan 24/7 jam</h3>
            <p>Costumer Service siap membantu anda</p>
          </div>
        </div>
      </section>


      <section className="products-priview">
        <h2 className="section-title">
          Produk Terbaru
        </h2>
        <div className="products-grid">
          <div className="product-card">
            <div className="product-image">
              🖥️
            </div>

            <h3>Monitor gaming</h3>
            <p className="price">rp. 3.500.000</p>
          </div>

          <div className="product-card">
            <div className="product-image">
              ⌨️
            </div>
            <h3>Keyboard Mechanical</h3>
            <p className="price">
              Rp. 1.200.000
            </p>
          </div>

          <div className="product-card">
            <div className="product-image">
              🎮
            </div>

            <h3>Game Controler</h3>
            <p className="price">Rp 2.100.000</p>
          </div>

          <div className="product-card">
            <div className="product-image">🎧</div>
            <h3>Headset Premium</h3>
            <p className="price">Rp 2.100.000</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2 className="section-title">Testimoni pelanggan</h2>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Pelayanan sangat cepat, produk sesuai gambar!"</p>
            <p className="author">-Budi, Jakarta</p>
          </div>

          <div className="testimonial-card">
            <p>"Kualitas produk bagus, packing aman."</p>
            <p className="author">- Sari, Bandung</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home;