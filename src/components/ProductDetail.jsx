import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Добавляем состояние для активной (выбранной) картинки
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8086/api/products/${id}`);
        if (!response.ok) throw new Error('Товар не найден');
        const data = await response.json();
        setProduct(data);
        
        // Устанавливаем первую картинку как активную по умолчанию
        if (data.imageUrls && data.imageUrls.length > 0) {
          setActiveImage(data.imageUrls[0]);
        }
      } catch (err) {
        setError('Не удалось загрузить информацию о товаре.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-2 text-muted">Загружаем информацию о предмете...</p>
      </div>
    );
  }

  if (error || !product) {
    return <div className="alert alert-danger border-0 shadow-sm mx-auto" style={{ maxWidth: '800px' }}>{error || 'Товар не найден'}</div>;
  }

  // Дефолтная заглушка, если картинок вообще нет
  const defaultImage = "https://unsplash.com";

  return (
    <div className="container py-4 mx-auto" style={{ maxWidth: '1000px' }}>
      <Link to="/shop" className="btn btn-outline-secondary mb-4 fw-semibold shadow-sm">
        &larr; Вернуться в магазин
      </Link>

      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
        <div className="row g-4">
          
          {/* ЛЕВАЯ КОЛОНКА: Главное фото + Галерея миниатюр */}
          <div className="col-md-6">
            {/* Большое активное фото */}
            <div className="position-relative bg-light rounded-3 overflow-hidden shadow-sm" style={{ height: '400px' }}>
              <img 
                src={activeImage || defaultImage} 
                className="w-100 h-100 object-fit-contain" 
                alt={product.title}
              />
            </div>

            {/* Блок миниатюр (отображается только если картинок больше 1) */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
                {product.imageUrls.map((url, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveImage(url)} // При клике меняем главное фото
                    className={`rounded-2 overflow-hidden border cursor-pointer shadow-sm ${activeImage === url ? 'border-success border-2' : 'border-secondary-subtle'}`}
                    style={{ width: '70px', height: '70px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    <img 
                      src={url} 
                      alt={`Миниатюра ${index + 1}`} 
                      className="w-100 h-100 object-fit-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ПРАВАЯ КОЛОНКА: Описание и контакты */}
          <div className="col-md-6 d-flex flex-column justify-content-between">
            <div>
              <h2 className="fw-bold text-dark mb-3 border-bottom pb-2">{product.title}</h2>
              <h4 className="text-muted fw-bold mb-4" style={{ fontSize: '1.4rem' }}>Цена по запросу</h4>
              <p className="text-secondary card-text mb-4" style={{ lineHeight: '1.7', fontSize: '1.05rem', textJustify: 'inter-word', whiteSpace: 'pre-line' }}>
                {product.description}
              </p>
            </div>

            <div className="alert alert-success border-0 rounded-3 p-3 mt-auto">
              <h6 className="fw-bold mb-1">Узнать стоимость предмета:</h6>
              <p className="small text-muted mb-0">
                Свяжитесь с нами через раздел <Link to="/contacts" className="text-success fw-bold">Контакты</Link>, указав название или ID предмета (#{product.id}).
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
