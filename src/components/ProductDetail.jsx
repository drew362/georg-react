import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { slug } = useParams();
  const [{ product, loading, error }, setStatus] = useState({ product: null, loading: true, error: '' });
  const [activeImage, setActiveImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${slug}`)
      .then(res => { if (!res.ok) throw new Error('Товар не найден'); return res.json(); })
      .then(data => {
        setStatus({ product: data, loading: false, error: '' });
        // ИСПРАВЛЕНО: Берем первый элемент [0] массива, а не весь массив сразу
        if (data.imageUrls?.length) setActiveImage(data.imageUrls[0]);
      })
      .catch(err => setStatus({ product: null, loading: false, error: 'Не удалось загрузить информацию.' }));
  }, [slug]);

  const images = product?.imageUrls || [];
  const hasMultiple = images.length > 1;

  const navigateImage = (direction, e) => {
    e?.stopPropagation();
    const idx = images.indexOf(activeImage);
    const nextIdx = direction === 'next' ? (idx + 1) % images.length : (idx - 1 + images.length) % images.length;
    setActiveImage(images[nextIdx]);
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isModalOpen, activeImage]);

  if (loading) return <div className="text-center my-5"><div className="spinner-border text-success" /></div>;
  if (error || !product) return <div className="alert alert-danger mx-auto" style={{ maxWidth: '800px' }}>{error || 'Товар не найден'}</div>;

  return (
    // ОБНОВЛЕНО: Сделали карточку товара шире, убрав ограничение 1000px
    <div className="container-fluid py-4 mx-auto" style={{ maxWidth: '1400px' }}>
      <Link to="/shop" className="btn btn-outline-secondary mb-4 fw-semibold shadow-sm">&larr; Вернуться в магазин</Link>
      <div className="card shadow-sm border-0 rounded-3 p-4 bg-white">
        <div className="row g-4">

          {/* Левая колонка: Главное фото и миниатюры */}
          <div className="col-md-7">
            <div className="position-relative bg-light rounded-3 overflow-hidden shadow-sm d-flex align-items-center justify-content-center" style={{ height: '500px', cursor: 'zoom-in' }} onClick={() => setIsModalOpen(true)}>
              <img src={activeImage || "https://unsplash.com"} className="w-100 h-100 object-fit-contain" alt={product.title} />
            </div>
            {hasMultiple && (
              <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
                {images.map((url, idx) => (
                  <div key={idx} onClick={() => setActiveImage(url)} className={`rounded-2 overflow-hidden border shadow-sm ${activeImage === url ? 'border-success border-2' : 'border-secondary-subtle'}`} style={{ width: '75px', height: '75px', cursor: 'pointer' }}>
                    <img src={url} alt="" className="w-100 h-100 object-fit-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Правая колонка: Название, цена, описание */}
          <div className="col-md-5 d-flex flex-column justify-content-between">
            <div>
              <h2 className="fw-bold text-dark mb-3 border-bottom pb-2">{product.title}</h2>
              <h4 className="text-muted fw-bold mb-4" style={{ fontSize: '1.4rem' }}>Цена по запросу</h4>


              <div
                className="text-secondary mb-4 product-description-container"
                style={{
                  lineHeight: '1.7',
                  fontSize: '1.05rem',
                  textAlign: 'left',
                  whiteSpace: 'normal',
                  wordBreak: 'keep-all',
                  overflowWrap: 'break-word'
                }}
                // АВТО-ОЧИСТКА: На лету заменяем все скрытые &nbsp; на обычные пробелы перед выводом
                dangerouslySetInnerHTML={{
                  __html: (product.description || 'Описание отсутствует').replaceAll('&nbsp;', ' ')
                }}
              />

            </div>

            <div className="alert alert-success border-0 rounded-3 p-3 mt-auto">
              <h6 className="fw-bold mb-1">Узнать стоимость предмета:</h6>
              <p className="small text-muted mb-0">Свяжитесь с нами через <Link to="/contacts" className="text-success fw-bold">Контакты</Link>, указав название предмета («{product.title}»).</p>
            </div>
          </div>

        </div>
      </div>

      {/* Полноэкранный слайдер-модалка */}
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(6px)', zIndex: 9999, cursor: 'zoom-out' }}>
          <button onClick={() => setIsModalOpen(false)} className="position-absolute border-0 text-white bg-transparent" style={{ top: '20px', right: '30px', fontSize: '40px', zIndex: 10000 }}>&times;</button>

          {hasMultiple && (
            <button onClick={(e) => navigateImage('prev', e)} className="position-absolute text-white border-0 rounded-circle d-flex align-items-center justify-content-center modal-btn" style={{ left: '20px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', fontSize: '24px', zIndex: 10000 }}>❮</button>
          )}

          <img src={activeImage} alt="" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '85%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '4px', zIndex: 9998 }} />

          {hasMultiple && (
            <button onClick={(e) => navigateImage('next', e)} className="position-absolute text-white border-0 rounded-circle d-flex align-items-center justify-content-center modal-btn" style={{ right: '20px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.1)', fontSize: '24px', zIndex: 10000 }}>❯</button>
          )}
        </div>
      )}
    </div>
  );
};

const style = document.createElement('style');
style.innerHTML = `
  .product-description-container ul, .product-description-container ol {
    padding-left: 25px !important;
    margin-bottom: 1rem !important;
  }
  .product-description-container ul {
    list-style-type: disc !important;
  }
  .product-description-container ol {
    list-style-type: decimal !important;
  }
`;
document.head.appendChild(style);

export default ProductDetail;
