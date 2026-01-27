import React, { useState, useEffect } from "react";
import axios from "axios";
import './SimpleTable.css';

const SimpleTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5000/api/products');

      setProducts(response.data.data);
      console.log('Data berhasil diambil: ', response.data.data);
    } catch (err) {
      setError('Gagal mengambil data dari server');
      console.error('Error: ', err)
    } finally {
      setLoading(false)
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price)
  };


  if (loading) {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Memuat data produk...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <h3>⚠️ Error</h3>
        <p>{error}</p>
        <button onClick={fetchData}>Coba Lagi</button>
      </div>
    );
  }


  return (
    <div className="simple-container">
      <div className="header">
        <h1>📋 Data Produk Sederhana</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>


      <div className="info-box">
        <p>Total Produk: <strong>{products.length}</strong></p>
        <p>Data diambil dari <code>GET /api/products</code></p>
      </div>

      <div className="table-wrapper">
        <table className="simple-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
            </tr>
          </thead>

          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.product_id}>
                  <td className="id-cell">
                    #{product.product_id}
                  </td>
                  <td className="nama-cell">
                    {product.product_name}
                  </td>
                  <td className="category-cell">
                    KAT-{product.category_id}
                  </td>
                  <td className="price-cell">
                    {formatPrice(product.price)}
                  </td>
                  <td className="stock-cell">
                    <span className={`stock ${product.stock > 10 ? 'high' : 'low'}`}>
                      {product.stock} unit
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty-cell">
                  Tidak ada data produk
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="footer-info">
        <h3>📊 Informasi Alur Data:</h3>
        <ol>
          <li><strong>Frontend (React)</strong> memanggil: <code>axios.get('http://localhost:5000/api/products')</code></li>
          <li><strong>Backend (Node.js)</strong> menerima request di endpoint <code>/api/products</code></li>
          <li><strong>Backend</strong> menjalankan query SQL ke PostgreSQL</li>
          <li><strong>PostgreSQL</strong> mengembalikan data ke Backend</li>
          <li><strong>Backend</strong> mengirim response JSON ke Frontend</li>
          <li><strong>Frontend</strong> menampilkan data di tabel</li>
        </ol>

        <div className="data-sample">
          <h4>Contoh Response API</h4>
          <pre>
            {`{
  "success": true,
  "data": [
    {
      "product_id": 1,
      "category_id": 5,
      "product_name": "Nasi goreng",
      "price": 12000,
      "stock": 15
    }
  ],
  "total": 1
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SimpleTable