import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // null = создание
  const [form, setForm] = useState({ title: '', description: '', price: '' });
  const [files, setFiles] = useState([]); 

  const api = 'https://aquilon-antique.ru/api/products';

  const fetchProducts = async () => {
    try {
      const res = await fetch(api);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Ошибка при получении товаров:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleMode = (prod = null) => {
    setSelected(prod);
    setForm({ 
      title: prod?.title || '', 
      description: prod?.description || '', 
      price: prod?.price !== null && prod?.price !== undefined ? prod.price : '' 
    });
    setFiles([]);
    if (document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
  };

  const handleAction = async (method, url, isDelete = false) => {
    if (isDelete && !window.confirm('Вы уверены, что хотите полностью удалить этот товар?')) return;

    let body = null;
    if (!isDelete) {
      body = new FormData();
      body.append('title', form.title);
      body.append('description', form.description);
      // Передаем цену, даже если она пустая, чтобы не ломать валидацию структуры на бэкенде
      body.append('price', form.price !== '' ? form.price : '');
      
      if (files && files.length > 0) {
        files.forEach(f => body.append('file', f));
      }
    }

    try {
      const res = await fetch(url, { method, body });
      if (res.ok) {
        alert('Операция выполнена успешно!');
        handleMode();
        fetchProducts();
      } else {
        alert('Ошибка сервера при выполнении операции');
      }
    } catch (err) {
      console.error(err);
      alert('Сетевая ошибка запроса');
    }
  };

  const deleteImg = async (url) => {
    if (!window.confirm('Удалить эту фотографию из облака?')) return;
    try {
      const res = await fetch(`${api}/${selected.id}/images?imgUrl=${encodeURIComponent(url)}`, { method: 'DELETE' });
      if (res.ok) {
        const updatedImages = Array.from(selected.imageUrls).filter(src => src !== url);
        setSelected({ ...selected, imageUrls: updatedImages });
        fetchProducts(); 
      } else {
        alert('Ошибка удаления фото на бэкенде');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при связи с сервером');
    }
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
      <div className="row g-4">
        {/* Слева: Список товаров */}
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm p-3 bg-white" style={{ minHeight: '70vh' }}>
            <button 
              className={`btn w-100 mb-3 fw-bold ${!selected ? 'btn-success' : 'btn-outline-success'}`} 
              onClick={() => handleMode()}
            >
              + Новый товар
            </button>
            <h6 className="text-muted fw-bold border-bottom pb-2">Товары ({products.length})</h6>
            
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-success"></div></div>
            ) : (
              <div className="list-group overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {products.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => handleMode(p)} 
                    className={`list-group-item list-group-item-action border-0 rounded-2 mb-2 p-3 text-start d-flex align-items-center justify-content-between overflow-hidden ${selected?.id === p.id ? 'bg-success text-white fw-bold' : 'bg-light'}`}
                    type="button"
                  >
                    <div className="text-truncate me-2" style={{ maxWidth: '75%' }}>
                      <span className="fw-bold d-inline-block me-1">#{p.id}</span> {p.title}
                    </div>
                    {p.imageUrls && p.imageUrls.length > 0 && (
                      <img src={p.imageUrls[0]} alt="" className="rounded shadow-sm flex-shrink-0" style={{ width: '38px', height: '38px', objectFit: 'cover' }} />
                    )}
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
            
            <form onSubmit={(e) => { 
              e.preventDefault(); 
              handleAction(selected ? 'PUT' : 'POST', selected ? `${api}/${selected.id}` : api); 
            }}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Название предмета *</label>
                <input type="text" className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Описание товара *</label>
                <textarea className="form-control" rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea>
              </div>

              {/* Облачные фото */}
              {selected?.imageUrls && selected.imageUrls.length > 0 && (
                <div className="mb-3">
                  <label className="form-label fw-semibold text-success">Фотографии в Яндекс Облаке (Клик на [✕] для удаления):</label>
                  <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded">
                    {selected.imageUrls.map((url, idx) => (
                      <div key={idx} className="position-relative" style={{ width: '65px', height: '65px' }}>
                        <img src={url} alt="" className="w-100 h-100 object-fit-cover rounded border" />
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center rounded-circle" 
                          style={{ width: '18px', height: '18px', fontSize: '10px', marginTop: '-4px', marginRight: '-4px' }} 
                          onClick={() => deleteImg(url)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Цена</label>
                  <input type="number" className="form-control" placeholder="Оставьте пустым для цены по запросу" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Фотографии предмета {selected ? '' : '*'}</label>
                  <input 
                    id="fileInput" 
                    type="file" 
                    className="form-control" 
                    multiple 
                    onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])} 
                    required={!selected} 
                  />
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
