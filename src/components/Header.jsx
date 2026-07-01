import React from 'react';
import { NavLink, Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3 sticky-top">
      <div className="container-fluid px-4 px-md-5">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Логотип: Северная звезда (SVG) */}
      <svg 
  className="me-3 text-success" 
  width="36" 
  height="36" 
  viewBox="0 0 100 110" 
  fill="none" 
  stroke="currentColor" 
  strokeWidth="5" 
  strokeLinecap="round" 
  strokeLinejoin="round"
>
  {/* Внешний контур ромба (основа узла Гунгнира) */}
  <path d="M 50,5 L 95,50 L 50,95 L 5,50 Z" />
  
  {/* Пересекающиеся диагональные линии скандинавского плетения */}
  <path d="M 20,50 L 80,50 M 50,20 L 50,80" />
  
  {/* Декоративные «усики» наконечника копья сверху и снизу */}
  <path d="M 30,25 L 15,10 M 70,25 L 85,10" />
  <path d="M 30,75 L 15,90 M 70,75 L 85,90" />
  
  {/* Внутренний центральный ромб */}
  <path d="M 50,30 L 70,50 L 50,70 L 30,50 Z" strokeWidth="4" />
</svg>

          
          {/* Блок с текстом в две строки */}
          <div className="d-flex flex-column lh-sm">
            <span className="fw-bold text-success fs-3">Аквилон</span>
            <span className="text-white-50 fs-6 fw-normal text-uppercase tracking-wider" style={{ fontSize: '0.75rem' }}>
              исторический архив и антиквариат
            </span>
          </div>
        </Link>
        
        <div className="collapse navbar-collapse d-flex justify-content-end">
          <ul className="navbar-nav mb-2 mb-lg-0 fw-semibold">
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 me-2 ${isActive ? 'text-success' : 'text-white-50'}`} to="/">
                Поиск наград
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 me-2 ${isActive ? 'text-success' : 'text-white-50'}`} to="/shop">
                Магазин
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 me-2 ${isActive ? 'text-success' : 'text-white-50'}`} to="/buyback">
                Скупка и Оценка
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={({ isActive }) => `nav-link px-3 ${isActive ? 'text-success' : 'text-white-50'}`} to="/contacts">
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
