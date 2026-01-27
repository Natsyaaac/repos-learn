import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductGridSectOne.css'


const PoductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data.data);
        console.log('Data produk diterima :', response.data.data.length, 'item');
      } catch (err) {
        setError('Gagal memuat produk. Pastikan backend berjalan!');
        console.error('Error fetch: ', err);
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
    }).format(price)
  };


  const getstockStatus = (stock) => {
    if (stock > 70) return { text: 'Banyak', class: 'high' };
    if (stock > 55) return { text: 'Sedang', class: 'medium' };
    return { text: 'Sedikit', class: 'low' };
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <h3>Memuat produk...</h3>
        <p>Mengambil data dari: <code>GET /api/products</code></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-icon">⚠️</div>
        <h2>Oops! Ada masalah!</h2>
        <p>{error}</p>
        <div className="debug-info">
          <p><strong>Debug Info:</strong></p>
          <p>Backend URL: <code>http://localhost:5000/api/products</code></p>
          <p>Pastikan server backend berjalan</p>
        </div>

        <button
          className='retry-btn'
          onClick={() => window.location.reload()}
        >
          🔄 Muat Ulang
        </button>
      </div>
    );
  }

  return (
    <div className="product-grid-container">
      <header className="main-header">
        <p className="subtititle">Menampilkan data dari Postgresql dengan React Grid</p>
        <div className="controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List Mode
            </button>
          </div>

          <div className="stats">
            <span className="stat-item">📦 {products.length} Produk</span>
            <span className="stat-item">💰 Total: {formatPrice(
              products.reduce((sum, p) => sum + (p.price * p.stock), 0)
            )}</span>
          </div>
        </div>
      </header>
      {/* ========== INFO PANEL ========== */}
      <div className="info-panel">
        <div className="info-card">
          <h3>📊 Data Flow</h3>
          <ol>
            <li>Ract fetch → <code>/api/products</code></li>
            <li>Backend query → PostgreSQl</li>
            <li>Data diterima → Ditampilkan di Grid</li>
          </ol>
        </div>

        <div className="info-card">
          <h3>🎯 Fitur CSS</h3>
          <ul>
            <li>Flexbox untuk layout</li>
            <li>Grid untuk tata letak produk</li>
            <li>Media Query untuk responsif</li>
            <li>Hover effects & transitions</li>
          </ul>
        </div>
      </div>
      {/* ========== PRODUK GRID/LIST ========== */}
      <div className={`products-container ${viewMode}`}>
        {products.length > 0 ? (
          products.map((produk) => (
            <div className="product-card" key={produk.product_id}>
              <div className="product-header">
                <div className="product-badge">
                  #{produk.product_id}
                </div>
                <div className="category-tag">
                  KAT-{produk.category_id}
                </div>
              </div>

              <div className="product-body">
                <h3 className='product-title'>{produk.product_name}</h3>

                {produk.description && (
                  <p className="product-desc">
                    {produk.description.length > 100 ? produk.description.substring(0, 100) + '...' : produk.description}
                  </p>
                )}

                <div className="product-details">
                  <div className="detail-row">
                    <span className="detail-label">Harga</span>
                    <span className="detail-value price">{formatPrice(produk.price)}</span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Stok:</span>
                    <span className={`stock-bagde ${getstockStatus(produk.stock).class}`}>
                      {produk.stock} unit ({getstockStatus(produk.stock).text})
                    </span>
                  </div>

                  <div className="detail-row">
                    <span className="detail-label">Nilai:</span>
                    <span className="detail-value">
                      {formatPrice(produk.price * produk.stock)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="product-footer">
                <button className="action-btn view-btn">
                  👁️ Lihat Detail
                </button>
                <button className="action-btn cart-btn">
                  🛒 Tambah
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>Tidak ada produk</h3>
            <p>Database kosonh atau terjadi error</p>
          </div>
        )}
      </div>
      {/* ========== FOOTER ========== */}
      <footer className="main-footer">
        <div className="footer-content">
          <h3>🎓 Belajar React + PostgreSQL</h3>
          <div className="tech-stack">
            <span className="tech-badge">⚛️ React</span>
            <span className="tech-badge">🚀 Express.js</span>
            <span className="tech-badge">🐘 PostgreSQL</span>
            <span className="tech-badge">🎨 CSS Flex/Grid</span>
          </div>
          <p className="footer-note">
            Data diambil dari endpoint: <code>GET /api/products</code><br />
            Backend menjalankan query: <code>SELECT * FROM products</code>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PoductGrid;