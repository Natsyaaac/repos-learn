import './database.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data.data || response.data || []);
            setError(null);
        } catch (err) {
            setError('Gagal mengambil data produk');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductDetail = async (productId) => {
        try {
            setDetailLoading(true);
            const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
            setSelectedProduct(response.data.data);
            setShowDetail(true);
        } catch (err) {
            setError('Gagal mengambil detail produk');
            console.error(err);
        } finally {
            setDetailLoading(false);
        }
    };

    const closeDetail = () => {
        setShowDetail(false);
        setSelectedProduct(null);
    };

    // Filter data berdasarkan search
    const filteredData = products.filter(product => 
        product.product_name?.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()) ||
        product.category_id?.toString().includes(search.toLowerCase())
    );

    // Sorting
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle perbandingan angka dan string
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || '').toLowerCase();
        const bStr = String(bValue || '').toLowerCase();
        
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleRefresh = () => {
        fetchData();
        setSearch('');
        setCurrentPage(1);
        setSortConfig({ key: null, direction: 'asc' });
    };

    // Format currency
    const formatCurrency = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Get stock badge class
    const getStockBadgeClass = (stock) => {
        if (stock > 50) return 'high';
        if (stock > 10) return 'medium';
        return 'low';
    };

    // Export to CSV
    const exportToCSV = () => {
        try {
            // Header CSV
            const headers = ['ID Produk', 'Kategori', 'Nama Produk', 'Harga', 'Stok', 'Deskripsi'];
            
            // Data CSV
            const csvData = filteredData.map(product => [
                product.product_id,
                `KAT-${product.category_id}`,
                product.product_name,
                product.price,
                product.stock,
                product.description || ''
            ]);
            
            // Gabungkan header dan data
            const csvContent = [
                headers.join(','),
                ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');
            
            // Buat blob dan download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            
            link.setAttribute('href', url);
            link.setAttribute('download', `produk_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Notifikasi sukses
            setError(null);
            setTimeout(() => {
                alert('✅ Data berhasil diexport ke CSV!');
            }, 100);
            
        } catch (err) {
            setError('Gagal mengexport data ke CSV');
            console.error(err);
        }
    };

    // Print table
    const printTable = () => {
        const printContent = document.querySelector('.table-wrapper').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Data Produk - ${new Date().toLocaleDateString()}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #4f46e5; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    .header { text-align: center; margin-bottom: 20px; }
                    .timestamp { color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📦 Data Produk</h1>
                    <p class="timestamp">Dicetak pada: ${new Date().toLocaleString()}</p>
                    <p>Total: ${filteredData.length} produk</p>
                </div>
                ${printContent}
            </body>
            </html>
        `;
        
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Memuat data produk...</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-header">
                <h1>📦 Data Produk</h1>
                <div className="table-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Cari nama produk, deskripsi, atau kategori..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <span className="search-count">
                            {filteredData.length} produk ditemukan
                        </span>
                    </div>
                    
                    <button onClick={handleRefresh} className="refresh-btn">
                        🔄 Refresh Data
                    </button>
                </div>
            </div>

            {error && (
                <div className="error-alert">
                    ⚠️ {error}
                    <button onClick={fetchData}>Coba Lagi</button>
                </div>
            )}

            <div className="table-wrapper">
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('product_id')}>
                                ID Produk {sortConfig.key === 'product_id' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th onClick={() => handleSort('category_id')}>
                                Kategori {sortConfig.key === 'category_id' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th onClick={() => handleSort('product_name')}>
                                Nama Produk {sortConfig.key === 'product_name' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th onClick={() => handleSort('price')}>
                                Harga {sortConfig.key === 'price' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th onClick={() => handleSort('stock')}>
                                Stok {sortConfig.key === 'stock' && (
                                    sortConfig.direction === 'asc' ? '↑' : '↓'
                                )}
                            </th>
                            <th>Deskripsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((product) => (
                                <tr 
                                    key={product.product_id}
                                    className="clickable-row"
                                    onClick={() => fetchProductDetail(product.product_id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className="id-cell">#{product.product_id}</td>
                                    <td className="category-cell">
                                        <span className="category-badge">
                                            KAT-{product.category_id}
                                        </span>
                                    </td>
                                    <td className="name-cell">
                                        <div className="product-avatar">
                                            {product.product_name?.charAt(0).toUpperCase()}
                                        </div>
                                        {product.product_name}
                                    </td>
                                    <td className="price-cell">
                                        {formatCurrency(product.price)}
                                    </td>
                                    <td>
                                        <span className={`stock-badge ${getStockBadgeClass(product.stock)}`}>
                                            {product.stock} unit
                                        </span>
                                    </td>
                                    <td className="description-cell">
                                        {product.description ? (
                                            <div className="description-text">
                                                {product.description.length > 50 
                                                    ? `${product.description.substring(0, 50)}...`
                                                    : product.description
                                                }
                                            </div>
                                        ) : (
                                            <span className="no-description">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-cell">
                                    📭 {search ? 'Produk tidak ditemukan' : 'Tidak ada data produk'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Detail Produk */}
            {showDetail && (
                <div className="modal-overlay" onClick={closeDetail}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📋 Detail Produk</h2>
                            <button className="close-btn" onClick={closeDetail}>
                                ✕
                            </button>
                        </div>
                        
                        {detailLoading ? (
                            <div className="detail-loading">
                                <div className="spinner"></div>
                                <p>Memuat detail produk...</p>
                            </div>
                        ) : selectedProduct ? (
                            <div className="modal-content">
                                <div className="product-header">
                                    <div className="detail-avatar">
                                        {selectedProduct.product_name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3>{selectedProduct.product_name}</h3>
                                        <p className="product-id">ID: #{selectedProduct.product_id}</p>
                                    </div>
                                </div>
                                
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Kategori</span>
                                        <span className="detail-value">
                                            <span className="category-badge">
                                                KAT-{selectedProduct.category_id}
                                            </span>
                                        </span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Harga</span>
                                        <span className="detail-value price-highlight">
                                            {formatCurrency(selectedProduct.price)}
                                        </span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Stok Tersedia</span>
                                        <span className="detail-value">
                                            <span className={`stock-badge-large ${getStockBadgeClass(selectedProduct.stock)}`}>
                                                {selectedProduct.stock} unit
                                            </span>
                                        </span>
                                    </div>
                                    
                                    <div className="detail-item">
                                        <span className="detail-label">Nilai Inventori</span>
                                        <span className="detail-value">
                                            {formatCurrency(selectedProduct.price * selectedProduct.stock)}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="description-section">
                                    <h4>Deskripsi Produk</h4>
                                    <div className="description-full">
                                        {selectedProduct.description || 
                                         <span className="no-description">Tidak ada deskripsi</span>}
                                    </div>
                                </div>
                                
                                <div className="modal-actions">
                                    <button className="btn-edit">
                                        ✏️ Edit Produk
                                    </button>
                                    <button className="btn-delete">
                                        🗑️ Hapus Produk
                                    </button>
                                    <button className="btn-close" onClick={closeDetail}>
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="error-detail">
                                <p>Produk tidak ditemukan</p>
                                <button onClick={closeDetail}>Tutup</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        ◀️ Sebelumnya
                    </button>
                    
                    <div className="page-numbers">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Selanjutnya ▶️
                    </button>
                </div>
            )}

            <div className="table-footer">
                <div className="stats">
                    <span>📊 Total Produk: {products.length}</span>
                    <span>👁️ Ditampilkan: {currentItems.length}</span>
                    <span>📄 Halaman: {currentPage} dari {totalPages}</span>
                    <span>💰 Total Nilai: {formatCurrency(
                        products.reduce((sum, product) => sum + (product.price * product.stock), 0)
                    )}</span>
                </div>
                <div className="export-btn">
                    <button className="export-csv" onClick={exportToCSV}>
                        📥 Export CSV
                    </button>
                    <button className="print-btn" onClick={printTable}>
                        🖨️ Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;