import './database.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Table = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/products');
            // Sesuaikan dengan response dari backend
            setProducts(response.data.data || response.data || []);
            setError(null);
        } catch (err) {
            setError('Gagal mengambil data produk');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
        setCurrentPage(1); // Reset ke halaman 1 saat sorting
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
                                <tr key={product.product_id}>
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
                    <button className="export-csv">
                        📥 Export CSV
                    </button>
                    <button className="print-btn">
                        🖨️ Print
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Table;