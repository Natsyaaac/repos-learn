import React, { useState, useEffect } from 'react';
import axios, { Axios } from 'axios';
import './MobileFirstProducts.css';


const MobileFirstProducts = () => {
  const [Products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');

        setProducts(response.data.data);
        console.log('Mobile-First: Data diterima', response.data.data.length, 'produk');
      } catch (err) {
        setError(`Gagal Mengambil data produk`);
        console.error('Error: ', err);
      } finally {
        setLoading(false)
      }
    };

    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStockStatus = (stock) => {
    if (stock > 80) return 'high';
    if (stock > 50) return 'medium';
    return 'low';
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p className="loading-text">Memuat Data Produk...</p>
        <p className="loading-subtext">Mengambil dari: /api/products</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="error-screen">
        <h2 className="error-title">⚠️ Terjadi Kesalahan</h2>
        <p className="error-message">{error}</p>
        <button
          className='retry-btn'
          onClick={() => window.location.reload()}
        >
          🔄 Coba Lagi
        </button>
      </div>
    );
  }


  return (
    <div className="mobile-first-container">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Mobile First 📱</h1>
          <p className="app-subtitle">Responsive Design dengan Flexbox & Grid</p>
        </div>

        <div className="header-stats">
          <div className="stat-box">
            <span className="stat-label">Total Produk</span>
            <span className="stat-value">{Products.length}</span>
          </div>

          <div className="stat-box">
            <span className="stat-label">Total Nilai</span>
            <span className="stat-value">
              {formatPrice(
                Products.reduce((sum, p) => sum + (p.price * p.stock), 0)
              )}
            </span>
          </div>
        </div>
      </header>


      {/* ===== INFO SECTION (FLEXBOX) ===== */}

      <section className="info-section">
        <div className="info-card">
          <h3> 🎯Konsep Mobile-First</h3>
          <p>Design dimulai dari mobile, lalu tablet, lalu dekstop</p>
        </div>

        <div className="info-card">
          <h3>📱 Media Query</h3>
          <p>@media (min-width: 768px) untuk tablet</p>
          <p>@media (min-width: 1024px) untuk desktop</p>
        </div>
      </section>

      {/* ===== PRODUCTS GRID (CSS GRID) ===== */}
      <section className="products-grid-section">
        <h2 className="section-title">📦 Daftar Produk</h2>
        <p className="section-subtitle">Menggunakan CSS Grid untuk layout</p>

        {/* ===== PRODUCTS GRID CONTAINER ===== */}
        <div className="products-grid">
          {Products.length > 0 ? (
            Products.map((product) => (
              <div className="product-card" key={product.product_id}>
                <div className="product-header">
                  <span className="product-id">{product.product_id}</span>
                  <span className="product-category">KAT- {product.category_id}</span>
                </div>

                <div className="product-body">
                  <h3 className="product-name">{product.product_name}</h3>

                  {product.description && (
                    <p className="product-description">{product.description.length > 80 ? product.description.substring(0, 80) + '...' : product.description}
                    </p>
                  )}

                  <div className="product-details">
                    <div className="detail-item">
                      <span className="detail-label">Harga:</span>
                      <span className="detail-value">{formatPrice(product.price)}</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Stok:</span>
                      <span className={`stock-badge ${getStockStatus(product.stock)}`}>{product.stock} unit</span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">Total</span>
                      <span className="detail-value">{formatPrice(product.price * product.stock)}</span>
                    </div>
                  </div>
                </div>


                <div className="product-footer">
                  <button className="btn-detail">
                    👁️ Detail
                  </button>
                  <button className="btn-action">
                    🛒 Beli
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>📭Tidak ada data produk</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== FOOTER (FLEXBOX) ===== */}
      <footer className="app-footer">
        <div className="footer-content">
          <h3>Implementasi Resnponsive Design</h3>
          <div className="tech-list">
            <span className="tech-item">📱 Mobile-First</span>
            <span className="tech-item">📏 Flexbox</span>
            <span className="tech-item">🔳 CSS Grid</span>
            <span className="tech-item">🎨 Media Queries</span>
          </div>

          <div className="breakpoints-info">
            <h4>📐 Breakpoints:</h4>
            <ul>
              <li><strong>Mobile:</strong> &lt; 768px (default)</li>
              <li><strong>Tablet:</strong> ≥ 768px</li>
              <li><strong>Desktop:</strong> ≥ 1024px</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MobileFirstProducts;