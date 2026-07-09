import React from 'react';

export function BuybackTab() {
  return (
    <div className="card p-5 shadow-sm border-0 rounded-3 bg-white mx-auto" style={{ maxWidth: '1100px' }}>
      <h2 className="fw-bold text-dark mb-4 text-center">Скупка, Оценка и Экспертиза</h2>
      <p className="text-secondary fs-5 text-center mb-4">Бесплатно оценим ваши ордена, медали, знаки отличия и антиквариат по фотографиям.</p>
      <div className="alert alert-success border-0 rounded-3 p-4 text-center">
        <h5 className="fw-bold mb-2">Как отправить заявку?</h5>
        <p className="mb-0">Присылайте четкие фотографии наград с двух сторон в любой удобный мессенджер из раздела "Контакты".</p>
      </div>
    </div>
  );
}

export function ContactsTab() {
  return (
    <div className="card p-5 shadow-sm border-0 rounded-3 bg-white mx-auto" style={{ maxWidth: '1100px' }}>
      <h2 className="fw-bold text-dark mb-4">Контактная информация</h2>
      <div className="row g-4 text-secondary fs-5">
        <div className="col-md-6">
          <h5 className="fw-bold text-dark mb-2">Адрес офиса:</h5>
          <p>г. Москва, ул. Арбат, д. 12</p>
        </div>
        <div className="col-md-6">
          <h5 className="fw-bold text-dark mb-2">Телефон:</h5>
          <p>+7 (999) 123-45-67</p>
        </div>
      </div>
    </div>
  );
}
