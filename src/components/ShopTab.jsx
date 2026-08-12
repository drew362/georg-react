import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const CATEGORIES = [
  { key: 'ALL', label: 'Все товары' },
  { key: 'PRE_PETR_COINS', label: 'Допетровские монеты' },
  { key: 'NICHOLAS_II_COINS', label: 'Монеты Николая II' },
  { key: 'WEAPONS', label: 'Антикварное оружие' },
  { key: 'VOSTOK', label: 'Восток' },
  { key: 'NICHOLAS_II_MEDALS', label: 'Медали Николая II' }
];

const ShopTab = () => {
  const [products, setProducts] = useState([]);
  const [{ loading, error }, setStatus] = useState({ loading: true, error: '' });
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'ALL';

  useEffect(() => {
    setStatus({ loading: true, error: '' });
    let apiUrl = `${import.meta.env.VITE_API_BASE_URL}/products`;
    if (currentCategory !== 'ALL') apiUrl += `?category=${currentCategory}`;

    fetch(apiUrl, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache', 'Expires': '0' }
    })
      .then(res => { if (!res.ok) throw new Error('Ошибка загрузки'); return res.json(); })
      .then(data => { setProducts(data); setStatus({ loading: false, error: '' }); })
      .catch(() => setStatus({ loading: false, error: 'Не удалось загрузить каталог товаров. Проверьте запуск бэкенда.' }));
  }, [currentCategory]);

  const handleCategorySelect = (key) => {
    if (key === 'ALL') searchParams.delete('category');
    else searchParams.set('category', key);
    setSearchParams(searchParams);
  };

  if (loading) return (
    <div className="text-center my-5 py-5">
      <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
      <p className="mt-3 text-muted fw-medium">Загружаем витрину магазина...</p>
    </div>
  );

  if (error) return <div className="alert alert-danger border-0 shadow-sm rounded-3 p-3 w-100">{error}</div>;

  return (
    // Убрали maxWidth: '1200px' и жесткий зажим ширины, контейнер теперь резиновый на 100%
    <div className="w-100">
      <div className="row g-4">

        {/* ЛЕВАЯ ПАНЕЛЬ: Категории (занимает col-lg-3 на больших экранах) */}
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card shadow-sm border-0 p-3 bg-white rounded-3 sticky-md-top" style={{ top: '20px', zIndex: 10 }}>
            <h6 className="fw-bold mb-3 text-secondary text-uppercase small" style={{ letterSpacing: '0.5px' }}>Категории</h6>
            <div className="list-group list-group-flush">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`list-group-item list-group-item-action border-0 rounded-2 mb-1 px-3 py-2 text-start small ${currentCategory === cat.key ? 'bg-dark text-white fw-bold' : 'text-dark'
                    }`}
                  onClick={() => handleCategorySelect(cat.key)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: Сетка (занимает col-lg-9) */}
        <div className="col-12 col-md-8 col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-dark m-0 fs-3">
              {CATEGORIES.find(c => c.key === currentCategory)?.label || 'Антикварный Магазин'}
            </h2>
            <span className="badge bg-secondary px-3 py-2 rounded-pill shadow-sm">Лотов: {products.length}</span>
          </div>

          {products.length === 0 ? (
            <div className="alert alert-warning border-0 shadow-sm rounded-3 p-5 bg-white text-center">
              <h5 className="text-muted fw-normal mb-2">В этой категории пока нет товаров</h5>
              <p className="text-secondary small m-0">Загляните позже или выберите другой раздел в меню.</p>
            </div>
          ) : (
            // ИЗМЕНЕНИЕ СЕТКИ: Добавлен класс row-cols-xl-4. Теперь на больших мониторах помещается 4 карточки вместо 3
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
              {products.map((item) => (
                <div className="col" key={item.id}>
                  <Link to={`/shop/${item.slug}`} className="text-decoration-none h-100 d-block">
                    <div className="card h-100 shadow-sm border-0 rounded-3 bg-white overflow-hidden d-flex flex-column" style={{ transition: 'transform 0.2s, box-shadow 0.2s' }}>

                      <img
                        src={item.imageUrls?.length ? item.imageUrls[0] : "https://unsplash.com"}
                        alt={item.title}
                        className="w-100 object-fit-cover"
                        style={{ height: '200px', borderBottom: '1px solid #f0f0f0' }}
                      />

                      <div className="card-body d-flex flex-column p-3">
                        {/* Название предмета */}
                        <h5 className="card-title fw-bold text-dark mb-2 fs-6 text-truncate" title={item.title}>
                          {item.title}
                        </h5>

                        <div
                          className="card-text text-secondary small flex-grow-1 text-start"
                          style={{
                            lineHeight: '1.6',           /* Чуть увеличили расстояние между строками для читаемости */
                            display: '-webkit-box',
                            WebkitLineClamp: 2,          /* Строго обрезать после 2-й строки */
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',          /* Скрывает излишки текста */
                            maxHeight: '44px',           /* ИСПРАВЛЕНО: Безопасный максимум вместо жесткого height */
                            wordBreak: 'break-word',     /* Запрещает разрывать слова */
                            overflowWrap: 'break-word'   /* Дополнительная страховка для переноса слов */
                          }}
                          dangerouslySetInnerHTML={{ __html: item.description || 'Описание отсутствует' }}
                        />

                        {/* Нижняя часть карточки с ценой */}
                        <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                          <span className="fs-6 fw-bold text-dark">
                            {item.price ? `${item.price.toLocaleString('ru-RU')} ₽` : 'Цена по запросу'}
                          </span>
                          <span className="text-success small fw-bold">&rarr;</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ShopTab;
