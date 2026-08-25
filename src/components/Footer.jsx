import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const [isOpen, setIsOpen] = useState(false);
  const seoRef = useRef(null);

  // Закрываем окно при клике в любое другое место экрана
  useEffect(() => {
    function handleClickOutside(event) {
      if (seoRef.current && !seoRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container-fluid px-4 px-md-5">
        <div className="row text-center text-md-start align-items-center">
          
          <div className="col-md-4 mb-4 mb-md-0">
            {/* Левая колонка (пустая) */}
          </div>
          
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
              <Link className="text-white-50 text-decoration-none me-4 py-1" to="/shop">Магазин</Link>
              <Link className="text-white-50 text-decoration-none me-4 py-1" to="/search">Поиск наград</Link>
              <Link className="text-white-50 text-decoration-none me-4 py-1" to="/buyback">Скупка и Оценка</Link>
              <Link className="text-white-50 text-decoration-none py-1" to="/contacts">Контакты</Link>
            </div>
          </div>
          
          {/* Правая колонка: Копирайт сверху, Подробнее снизу */}
          <div className="col-md-3 text-center text-md-end position-relative" ref={seoRef}>
            <div className="d-flex flex-column align-items-center align-items-md-end">
              <p className="mb-0 text-white-50 small">
                &copy; 2026 Аквилон. Все права защищены.
              </p>
              
              {/* Кнопка-ссылка "Подробнее" перенесена на новую строку */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-white-50 small text-decoration-underline border-0 bg-transparent p-0 mt-1" 
                style={{ outline: 'none', cursor: 'pointer' }}
              >
                Подробнее
              </button>
              
              {/* Всплывающий SEO блок */}
              {isOpen && (
                <div 
                  className="p-3 bg-secondary rounded border border-light border-opacity-25 text-light text-start position-absolute" 
                  style={{ 
                    fontSize: '0.85rem', 
                    maxWidth: '450px', 
                    lineHeight: '1.5', 
                    textAlign: 'justify',
                    bottom: '100%',      // Появляется строго над блоком копирайта
                    right: '0',          // Выравнивание по правому краю на десктопах
                    marginBottom: '15px',
                    zIndex: 1050, 
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  <h6 className="text-white mb-2 small fw-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                    Георгиевский архив и антикварный реестр «Аквилон»
                  </h6>
                  <p className="mb-2 text-white-50">
                    Наш исторический портал предоставляет открытый доступ к единой базе данных кавалеров 
                    <strong className="text-white"> Георгиевского креста IV степени</strong>. Интеллектуальная система онлайн-поиска позволяет по номеру или фамилии кавалера 
                    найти подробную информацию о прохождении службы в рядах Российской Императорской Армии, верифицировать архивные приказы и проверить подлинность царской награды.
                  </p>
                  <p className="mb-0 text-white-50">
                    Каталог ценностей «Аквилон» включает экспертную оценку, покупку и продажу предметов старины, монет, редких медалей и антикварного оружия. 
                    Для бесплатной атрибуции и определения рыночной стоимости лотов свяжитесь с нашими специалистами через раздел Контакты.
                  </p>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
