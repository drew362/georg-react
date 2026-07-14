import React, { useState, useEffect } from 'react';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // null = создание
  const [form, setForm] = useState({ title: '', description: '', price: '' });
  const [files, setFiles] = useState([]); // Изначально пустой массив вместо null

  const api = 'http://localhost:8086/api/products';

  const fetchProducts = async () => {
    const res = await fetch(api);
    if (res.ok) setProducts(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleMode = (prod = null) => {
    setSelected(prod);
    setForm({ title: prod?.title || '', description: prod?.description || '', price: prod?.price || '' });
    setFiles([]);
    if (document.getElementById('fileInput')) document.getElementById('fileInput').value = '';
  };

  const handleAction = async (method, url, isDelete = false) => {
    if (isDelete && !window.confirm('Вы уверены?')) return;

    let body = null;
    if (!isDelete) {
      body = new FormData();
      Object.keys(form).forEach(k => form[k] && body.append(k, form[k])); // Защита от отправки пустых полей
      if (files && files.length > 0) files.forEach(f => body.append('file', f));
    }

    const res = await fetch(url, { method, body });
    if (res.ok) {
      alert('Успешно!');
      handleMode();
      fetchProducts();
    } else alert('Ошибка сервера');
  };

  const deleteImg = async (url) => {
    if (!window.confirm('Удалить фото?')) return;
    const res = await fetch(`${api}/${selected.id}/images?imgUrl=${encodeURIComponent(url)}`, { method: 'DELETE' });
    if (res.ok) {
      // ИСПРАВЛЕНО: Создаем новый массив, чтобы React мгновенно убрал картинку с экрана
      const updatedImages = Array.from(selected.imageUrls).filter(src => src !== url);
      setSelected({ ...selected, imageUrls: updatedImages });
      fetchProducts(); // Синхронизируем список на заднем плане
    } else alert('Ошибка удаления фото');
  };

  return (
    <div className="container-fluid py-4" style={{ maxWidth: '1400px' }}>
      <div className="row g-4">
        {/* Слева: Список */}
        <div className="col-md-4 col-lg-3">
          <div className="card shadow-sm p-3 bg-white" style={{ minHeight: '70vh' }}>
            <button className={`btn w-100 mb-3 fw-bold ${!selected ? 'btn-success' : 'btn-outline-success'}`} onClick={() => handleMode()}>+ Новый товар</button>
            <h6 className="text-muted fw-bold border-bottom pb-2">Товары ({products.length})</h6>
            {loading ? <div className="text-center py-4"><div className="spinner-border spinner-border-sm text-success"></div></div> :
              <div className="list-group overflow-y-auto" style={{ maxHeight: '60vh' }}>
                {products.map(p => (
                  <button key={p.id} onClick={() => handleMode(p)} className={`list-group-item list-group-item-action border-0 rounded-2 mb-2 p-2 text-start d-flex align-items-center justify-content-between ${selected?.id === p.id ? 'bg-success text-white fw-bold' : 'bg-light'}`}>
                    <div className="text-truncate">#{p.id} {p.title}</div>
                    {p.imageUrls?.[0] && <img src={p.imageUrls[0]} alt="" className="rounded" style={{ width: '35px', height: '35px', objectFit: 'cover' }} />}
                  </button>
                ))}
              </div>}
          </div>
        </div>

        {/* Справа: Форма */}
        <div className="col-md-8 col-lg-9">
          <div className="card shadow-sm p-4 bg-white">
            <h3 className="fw-bold mb-4">{selected ? `Редактирование #${selected.id}` : 'Добавление товара'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleAction(selected ? 'PUT' : 'POST', selected ? `${api}/${selected.id}` : api); }}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Название *</label>
                <input type="text" className="form-control" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Описание *</label>
                <textarea className="form-control" rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea>
              </div>

              {/* Облачные фото */}
              {selected?.imageUrls?.length > 0 && (
                <div className="mb-3">
                  <label className="form-label fw-semibold text-success">Фото в облаке (Клик на [х] для удаления):</label>
                  <div className="d-flex flex-wrap gap-2 p-2 bg-light rounded">
                    {selected.imageUrls.map((url, idx) => (
                      <div key={idx} className="position-relative" style={{ width: '60px', height: '60px' }}>
                        <img src={url} alt="" className="w-100 h-100 object-fit-cover rounded border" />
                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0 p-0 d-flex align-items-center justify-content-center rounded-circle" style={{ width: '18px', height: '18px', fontSize: '10px', marginTop: '-4px', marginRight: '-4px' }} onClick={() => deleteImg(url)}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="row mb-4">
                <div className="col-md-6"><label className="form-label fw-semibold">Цена</label><input type="number" className="form-control" value={form.price} onChange={e => setForm({...form, price: e.target.value})} /></div>
                {/* ИСПРАВЛЕНО: Перевод FileList в массив в момент выбора файлов */}
                <div className="col-md-6"><label className="form-label fw-semibold">Фото {selected ? '' : '*'}</label><input id="fileInput" type="file" className="form-control" multiple onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])} required={!selected} /></div>
              </div>

              <div className="d-flex gap-3">
                <button type="submit" className="btn btn-success fw-bold flex-grow-1">Сохранить</button>
                {selected && <button type="button" className="btn btn-danger fw-bold px-4" onClick={() => handleAction('DELETE', `${api}/${selected.id}`, true)}>Удалить товар</button>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
