import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-4">
      <div className="container">
        
        {/* ЛОГОТИП САЙТА (Ваша картинка + Текст) */}
        <Link 
          to="/" 
          className="d-flex align-items-center me-4" 
          style={{ textDecoration: 'none', background: 'transparent' }}
        >
          {/* ИСПРАВЛЕНО: Вместо SVG вставляем картинку-герб из корня сайта */}
         <div className="me-2" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/favicon.png" 
              alt="Логотип Аквилон" 
              style={{ 
                width: '32px', 
                height: '32px', 
                objectFit: 'contain',
                // ИСПРАВЛЕНО: Этот фильтр на лету перекрашивает PNG в зеленый цвет #198754
                filter: 'invert(42%) sepia(58%) saturate(541%) hue-rotate(99deg) brightness(93%) contrast(89%)'
              }} 
            />
          </div>
          
          {/* ТЕКСТОВАЯ ЧАСТЬ */}
          <div className="d-flex flex-column text-start">
            <span className="fw-bold fs-4 lh-1" style={{ color: '#198754' }}>
              Аквилон
            </span>
            <span 
              className="fw-semibold text-uppercase" 
              style={{ 
                fontSize: 'calc(0.5rem + 0.3vw)', 
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                color: '#6c757d'
              }}
            >
              Исторический архив и антиквариат
            </span>
          </div>
        </Link>

        {/* Кнопка-бургер для мобильных устройств */}
        <button 
          className="navbar-toggler border-0 p-2" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Переключить навигацию"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Меню навигации */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto text-start mt-2 mt-lg-0">
            
            <li className="nav-item">
              <NavLink 
                to="/" 
                end
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : 'text-secondary'}`}
              >
                Поиск наград
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                to="/shop" 
                end
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : 'text-secondary'}`}
              >
                Магазин
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                to="/buyback" 
                end
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : 'text-secondary'}`}
              >
                Скупка и Оценка
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                to="/contacts" 
                end
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success fw-bold' : 'text-secondary'}`}
              >
                Контакты
              </NavLink>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;
