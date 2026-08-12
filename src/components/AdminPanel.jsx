import React, { useState, useEffect } from 'react';
import slugify from 'slugify'; // Импортируем библиотеку для автоматической генерации ссылок
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const CATEGORIES = [
  { key: 'PRE_PETR_COINS', label: 'Допетровские монеты (Чешуя)' },
  { key: 'NICHOLAS_II_COINS', label: 'Монеты Николая II' },
  { key: 'NICHOLAS_II_MEDALS', label: 'Медали Николая II' },
  { key: 'WEAPONS', label: 'Антикварное оружие' },
  { key: 'VOSTOK', label: 'Восток' }
];

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'PRE_PETR_COINS' });
  const [files, setFiles] = useState([]);

  const api = `${import.meta.env.VITE_API_BASE_URL}/products`;

  const fetchProducts = async () => {
    try {
      const res = await fetch(api);
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error("Ошибка получения товаров:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleMode = (prod = null) => {
    setSelected(prod);
    setForm({
      title: prod?.title || '',
      description: prod?.description || '',
      price: prod?.price ?? '',
      category: prod?.category || 'PRE_PETR_COINS'
    });
    setFiles([]);
    if (document.getElementById('fileInput')) {
      document.getElementById('fileInput').value = '';
    }
  };

  const handleAction = async (method, url, isDelete = false) => {
    if (isDelete && !window.confirm('Вы уверены, что хотите полностью удалить этот товар?')) return;

    let body = null;
    if (!isDelete) {
      body = new FormData();

      // Переносим все стандартные поля формы в FormData
      Object.entries(form).forEach(([key, val]) => body.append(key, val));

      // АВТОМАТИЧЕСКАЯ ГЕНЕРАЦИЯ SLUG: Переводим заголовок в красивую латинскую ссылку
      const generatedSlug = slugify(form.title, {
        replacement: '-',  // Заменять пробелы на дефисы
        lower: true,       // Приводить к нижнему регистру
        strict: true,      // Удалять спецсимволы, оставляя латиницу и цифры
        locale: 'ru'       // Нативно транслитерировать кириллицу
      });

      // Добавляем готовый slug в тело запроса для отправки в Java бэкенд
      body.append('slug', generatedSlug);

      files.forEach(f => body.append('file', f));
    }

    try {
      const res = await fetch(url, { method, body });
      if (res.ok) {
        alert('Операция выполнена успешно!');
        handleMode();
        fetchProducts();
      } else {
        alert('Ошибка сервера');
      }
    } catch (err) {
      console.error(err);
      alert('Сетевая ошибка');
    }
  };

  const deleteImg = async (url) => {
    if (!window.confirm('Удалить эту фотографию из облака?')) return;
    try {
      const res = await fetch(`${api}/${selected.id}/images?imgUrl=${encodeURIComponent(url)}`, { method: 'DELETE' });
      if (res.ok) {
        setSelected({ ...selected, imageUrls: selected.imageUrls.filter(src => src !== url) });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
      <div className="row g-4">
        {/* Слева: Список товаров */}
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm p-3 bg-white" style={{ minHeight: '70vh' }}>
            <button className={`btn w-100 mb-3 fw-bold ${!selected ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleMode()}>
              + Новый товар
            </button>
            <h6 className="text-muted fw-bold border-bottom pb-2">Товары ({products.length})</h6>
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-success"></div></div>
            ) : (
              <div className="list-group overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {products.map(p => (
                  <button key={p.id} onClick={() => handleMode(p)} className={`list-group-item list-group-item-action border-0 rounded-2 mb-2 p-3 d-flex align-items-center justify-content-between ${selected?.id === p.id ? 'bg-success text-white fw-bold' : 'bg-light'}`} type="button">
                    <div className="text-truncate me-2" style={{ maxWidth: '75%' }}>#{p.id} {p.title}</div>
                    {p.imageUrls?.[0] && <img src={p.imageUrls[0]} alt="" className="rounded shadow-sm" style={{ width: '38px', height: '38px', objectFit: 'cover' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Справа: Форма добавления / изменения */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm p-4 bg-white">
            <h3 className="fw-bold mb-4">{selected ? `Редактирование товара #${selected.id}` : 'Добавление товара в магазин'}</h3>
            <form
              key={selected ? selected.id : 'new'}
              onSubmit={(e) => {
                e.preventDefault();
                handleAction(selected ? 'PUT' : 'POST', selected ? `${api}/${selected.id}` : api);
              }}
            >
              <div className="row mb-3">

                <div className="col-md-8">
                  <label className="form-label fw-semibold">Название предмета *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Категория предмета *</label>
                  <select className="form-select border-success fw-medium" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
                    {CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.label}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Описание товара *</label>
                <div className="bg-white border rounded" style={{ minHeight: '200px' }}>
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={value => setForm({ ...form, description: value })}
                    placeholder="Вставьте текст с сохранением списков и жирного шрифта..."
                    modules={{
                      toolbar: [
                        ['bold', 'italic', 'underline'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['clean']
                      ]
                    }}
                  />
                </div>
              </div>

              {selected?.imageUrls?.length > 0 && (
                <div className="mb-3">
                  <label className="form-label fw-semibold text-success">Фотографии в Яндекс Облаке (Клик на [✕] для удаления):</label>
                  <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded">
                    {selected.imageUrls.map((url, idx) => (
                      <div key={idx} className="position-relative" style={{ width: '65px', height: '65px' }}>
                        <img src={url} alt="" className="w-100 h-100 object-fit-cover rounded border" />
                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '18px', height: '18px', fontSize: '10px', marginTop: '-4px', marginRight: '-4px' }} onClick={() => deleteImg(url)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Цена</label>
                  <input type="number" className="form-control" placeholder="Оставьте пустым для цены по запросу" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Фотографии предмета {selected ? '' : '*'}</label>
                  <input id="fileInput" type="file" className="form-control" multiple onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])} required={!selected} />
                </div>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-success fw-bold flex-grow-1 py-2">
                  {selected ? 'Сохранить изменения' : 'Опубликовать на сайт'}
                </button>
                {selected && (
                  <button type="button" className="btn btn-danger fw-bold px-4 py-2" onClick={() => handleAction('DELETE', `${api}/${selected.id}`, true)}>
                    Удалить товар полностью
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
