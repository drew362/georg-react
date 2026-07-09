import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Импортируем Link для переходов

const ShopTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8086/api/products');
        if (!response.ok) throw new Error('Ошибка при загрузке товаров');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Не удалось загрузить каталог товаров. Проверьте запуск бэкенда.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}></div>
        <p className="mt-3 text-muted fw-medium">Загружаем витрину магазина...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger border-0 shadow-sm rounded-3 p-3">{error}</div>;

  return (
    <div className="w-100 mx-auto" style={{ maxWidth: '1200px' }}>
      <h2 className="fw-bold text-dark mb-4 text-center text-md-start">Антикварный Магазин</h2>
      
      {products.length === 0 ? (
        <div className="alert alert-warning border-0 shadow-sm rounded-3 p-3">В данный момент товаров нет в наличии.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map((item) => (
            <div className="col" key={item.id}>
              {/* Оборачиваем карточку в Link, чтобы в неё можно было "провалиться" */}
              <Link to={`/shop/${item.id}`} className="text-decoration-none h-100 d-block card-link">
                <div className="card h-100 shadow-sm border-0 rounded-3 bg-white overflow-hidden d-flex flex-column evaluate-card" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}>
                 
                  <img 
                    src={item.imageUrls && item.imageUrls.length > 0 
                      ? item.imageUrls[0] 
                      : "https://unsplash.com"} 
                    alt={item.title} 
                    className="w-100 object-fit-cover"
                    style={{ height: '220px' }}
                  />           

                  <div className="card-body d-flex flex-column p-4">
                    <h5 className="card-title fw-bold text-dark mb-2">{item.title}</h5>
                    <p className="card-text text-secondary small flex-grow-1 text-truncate-2" style={{ lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {item.description}
                    </p>
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <span className="fs-5 fw-bold text-muted">Цена по запросу</span>
                      <span className="text-success small fw-bold">Подробнее &rarr;</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopTab;
