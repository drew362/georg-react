import React, { useState } from 'react';

const AdminPanel = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  // ИСПРАВЛЕНО: Теперь состояние хранит массив выбранных файлов
  const [files, setFiles] = useState([]); 
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Обработчик выбора файлов с компьютера
  const handleFileChange = (e) => {
    if (e.target.files) {
      // Превращаем FileList в стандартный массив JavaScript
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация обязательных текстовых полей
    if (!title || !description) {
      setMessage({ text: 'Название и описание обязательны для заполнения!', type: 'danger' });
      return;
    }
    
    // Валидация: проверяем, что прикреплен хотя бы один файл
    if (files.length === 0) {
      setMessage({ text: 'Пожалуйста, выберите хотя бы одну фотографию предмета!', type: 'danger' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    // Создаем объект FormData для отправки бинарных данных и текста вместе
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (price) formData.append('price', price);
    

    files.forEach((file) => {
      formData.append('file', file);
    });

    try {
      const response = await fetch('http://localhost:8086/api/products', {
        method: 'POST',
        body: formData 
      });

      if (!response.ok) throw new Error('Ошибка сервера при публикации');

      setMessage({ text: `Товар успешно опубликован! Загружено изображений: ${files.length} шт.`, type: 'success' });
      
      // Полная очистка формы при успехе
      setTitle('');
      setDescription('');
      setPrice('');
      setFiles([]);
      // Сбрасываем поле выбора файлов на самом экране
      document.getElementById('fileInput').value = '';

    } catch (err) {
      setMessage({ text: 'Не удалось отправить данные. Проверьте подключение к Spring Boot.', type: 'danger' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-100 py-3" style={{ maxWidth: '800px' }}>
      <div className="card p-4 shadow-sm border-0 rounded-3 bg-white">
        <h3 className="fw-bold text-dark mb-4 text-center">Панель добавления товаров (Магазин)</h3>
        
        {message.text && (
          <div className={`alert alert-${message.type} border-0 rounded-3 p-3`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Название предмета *</label>
            <input 
              type="text" 
              className="form-control bg-light border-0 py-2" 
              placeholder="Например: Георгиевский крест 3 степени"
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold text-secondary">Описание товара *</label>
            <textarea 
              className="form-control bg-light border-0" 
              rows="5" 
              placeholder="Опишите состояние, патину, металл, ленту и исторический контекст..."
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="row mb-4">
            <div className="col-6">
              <label className="form-label fw-semibold text-secondary">Цена (необязательно)</label>
              <input 
                type="number" 
                className="form-control bg-light border-0 py-2" 
                placeholder="В рублях"
                value={price} 
                onChange={(e) => setPrice(e.target.value)} 
              />
            </div>
            <div className="col-6">
              <label className="form-label fw-semibold text-secondary">Фотографии предмета *</label>
              <input 
                id="fileInput"
                type="file" 
                accept="image/*" 
                multiple // 🔥 Позволяет выбирать много картинок сразу через Ctrl или Shift
                className="form-control bg-light border-0 py-2" 
                onChange={handleFileChange}
              />
              {files.length > 0 && (
                <div className="form-text text-success fw-medium mt-1">
                  Выбрано файлов: {files.length}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100 fw-bold py-2 shadow-sm rounded-3 fs-5"
            disabled={loading}
          >
            {loading ? 'Загрузка файлов в Yandex Cloud S3...' : 'Опубликовать на сайт'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
