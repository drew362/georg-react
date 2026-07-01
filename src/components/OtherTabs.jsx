import React from 'react';

export function ShopTab() {
  return (
    <div className="card p-5 shadow-sm border-0 rounded-3 text-center bg-white">
      <h2 className="fw-bold text-dark mb-3">Антикварный... Магазин</h2>
      <p className="text-muted fs-5">Каталог старинных наград, монет и предметов коллекционирования находится в процессе наполнения.</p>
      <div className="mt-4"><span className="fs-1">📦</span></div>
    </div>
  );
}

export function BuybackTab() {
  return (
    <div className="card p-5 shadow-sm border-0 rounded-3 bg-white">
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
    <div className="card p-5 shadow-sm border-0 rounded-3 bg-white">
      <h2 className="fw-bold text-dark mb-4">Контактная информация</h2>
      <div className="row g-4 text-secondary fs-5">
        <div className="col-md-6">
          <h5 className="fw-bold text-dark mb-2">Адрес :</h5>
          <p>г. Москва,Армянский пер д. 10</p>
        </div>
        <div className="col-md-6">
          <h5 className="fw-bold text-dark mb-2">Телефон:</h5>
          <p>+7 (916) 703-57-55</p>
        </div>
      </div>
    </div>
  );
}
