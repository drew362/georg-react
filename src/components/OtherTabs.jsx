import React, { useState } from 'react';

export function BuybackTab() {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      alert("Пожалуйста, прикрепите хотя бы одно фото для оценки предметов!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('comment', form.comment);
    files.forEach(f => formData.append('file', f)); // Ключ 'file' строго совпадает с Java-контроллером

    try {
      const res = await fetch('http://localhost:8086/api/appraisal', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        alert('Заявка отправлена! Эксперт антикварного магазина «Аквилон» свяжется с вами в течение 15 минут.');
        setForm({ name: '', phone: '', comment: '' });
        setFiles([]);
        document.getElementById('appraisalFiles').value = '';
      } else {
        alert('Ошибка сервера при отправке заявки.');
      }
    } catch (err) {
      alert('Нет связи с сервером Spring Boot');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 p-md-5 shadow-sm border-0 rounded-3 bg-white mx-auto" style={{ maxWidth: '1100px' }}>
      <h2 className="fw-bold text-dark mb-2 text-center">Скупка, Оценка и Экспертиза</h2>
      <p className="text-secondary fs-5 text-center mb-5">Бесплатно оценим ваши ордена, медали, знаки отличия и антиквариат по фотографиям.</p>
      
      <div className="row g-4 align-items-center">
        {/* Левая колонка: Информация и гарантии */}
        <div className="col-lg-5">
          <div className="alert alert-success border-0 rounded-3 p-4 mb-4">
            <h5 className="fw-bold mb-2">🚀 Экспресс-оценка</h5>
            <p className="mb-0 text-secondary" style={{ fontSize: '15px' }}>
              Заполните форму справа, прикрепите четкие фотографии, и наш эксперт назовет стоимость.
            </p>
          </div>
          <div className="p-3 bg-light rounded-3 border-start border-success border-3">
            <h6 className="fw-bold text-dark mb-1">🔒 100% Конфиденциальность</h6>
            <p className="mb-0 text-muted" style={{ fontSize: '14px' }}>
              Все сделки проходят строго анонимно. Мы не передаем информацию о ваших коллекциях и наградах третьим лицам.
            </p>
          </div>
        </div>

        {/* Правая колонка: Интерактивная форма */}
        <div className="col-lg-7">
          <form onSubmit={handleSubmit} className="p-4 bg-light rounded-3 shadow-inner">
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Ваше имя *</label>
              <input type="text" className="form-control border-0 py-2" placeholder="Как к вам обращаться" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Номер телефона *</label>
              <input type="tel" className="form-control border-0 py-2" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary">Что вы хотите оценить? (необязательно)</label>
              <textarea className="form-control border-0" rows="3" placeholder="Укажите известные детали: состояние, дефекты, историю награждения..." value={form.comment} onChange={e => setForm({...form, comment: e.target.value})}></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary">Фотографии предметов *</label>
              <input id="appraisalFiles" type="file" accept="image/*" className="form-control border-0 py-2" multiple onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])} required />
              {files.length > 0 && (
                <div className="form-text text-success fw-medium mt-1">Выбрано файлов для отправки: {files.length} шт.</div>
              )}
            </div>

            <button type="submit" className="btn btn-success w-100 fw-bold py-2.5 rounded-3 fs-5 shadow-sm" disabled={loading}>
              {loading ? 'Отправка файлов в Telegram...' : 'Отправить на бесплатную оценку'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function ContactsTab() {
  const realEmail = "kozinandrey@mail.ru";
  const visibleEmail = "info@aquilon-antique.ru"; 
  const emailSubject = encodeURIComponent("Запрос с сайта Аквилон");

  return (
    <div className="card p-5 shadow-sm border-0 rounded-3 bg-white mx-auto" style={{ maxWidth: '1100px' }}>
      <h2 className="fw-bold text-dark mb-4">Контактная информация</h2>
      
      <div className="row g-4 text-secondary fs-5">
        <div className="col-md-4">
          <h5 className="fw-bold text-dark mb-2">Адрес офиса:</h5>
          <p className="text-dark">г. Москва, Армянский пер, д. 10</p>
        </div>
        
        <div className="col-md-4">
          <h5 className="fw-bold text-dark mb-2">Телефон:</h5>
          <p className="text-dark fw-semibold">+7 (916) 703-57-55 (telegram, max)</p>
        </div>

        <div className="col-md-4">
          <h5 className="fw-bold text-dark mb-2">Электронная почта:</h5>
          <div className="d-flex align-items-center gap-2">
            <a 
              href={`mailto:${realEmail}?subject=${emailSubject}`}
              className="btn btn-outline-success d-flex align-items-center justify-content-center rounded-circle p-0 text-decoration-none"
              style={{ width: '42px', height: '42px', transition: '0.2s' }}
              title="Написать нам письмо"
            >
              <i className="bi bi-envelope-fill fs-5"></i>
            </a>

            <a 
              href={`mailto:${realEmail}?subject=${emailSubject}`}
              className="text-dark text-decoration-none link-success" 
              style={{ fontSize: '18px', transition: '0.2s' }}
            >
              {visibleEmail}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
