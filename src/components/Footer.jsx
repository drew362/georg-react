import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    // Заменили container на container-fluid для полноэкранного футера
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto border-top border-secondary">
      <div className="container-fluid px-4 px-md-5">
        <div className="row text-center text-md-start align-items-center">
          
          <div className="col-md-4 mb-4 mb-md-0">
          
          </div>
          
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="d-flex flex-wrap justify-content-center justify-content-md-start">
              <Link className="text-white-50 text-decoration-none me-4 py-1" to="/shop">Магазин</Link>
              <Link className="text-white-50 text-decoration-none me-4 py-1" to="/search">Поиск наград</Link>
              <Link className="text-white-50 text-decoration-none me-4 py-1" to="/buyback">Скупка и Оценка</Link>
              <Link className="text-white-50 text-decoration-none py-1" to="/contacts">Контакты</Link>
            </div>
          </div>
          
          <div className="col-md-3 text-center text-md-end">
            <p className="mb-0 text-white-50 small">&copy; 2026 Аквилон. Все права защищены.</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
