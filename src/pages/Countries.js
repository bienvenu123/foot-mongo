import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { getCountries, createCountry, updateCountry, deleteCountry } from '../services/countryService';
import './Countries.css';

function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ country_id: '', name: '', code: '', flag_url: '', continent: '' });

  const loadCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCountries();
      setCountries(data);
    } catch (err) {
      setError(err.message || 'Failed to load countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ country_id: '', name: '', code: '', flag_url: '', continent: '' });
    setModalOpen(true);
  };

  const openEdit = (country) => {
    setEditing(country);
    setForm({
      country_id: String(country.country_id),
      name: country.name,
      code: country.code || '',
      flag_url: country.flag_url || '',
      continent: country.continent || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      if (editing) {
        await updateCountry(editing.country_id, {
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          flag_url: form.flag_url.trim() || null,
          continent: form.continent.trim() || null,
        });
      } else {
        const countryId = parseInt(form.country_id, 10);
        if (!countryId || countryId < 1) {
          setError('Country ID must be a positive number');
          return;
        }
        await createCountry({
          country_id: countryId,
          name: form.name.trim(),
          code: form.code.trim().toUpperCase(),
          flag_url: form.flag_url.trim() || null,
          continent: form.continent.trim() || null,
        });
      }
      closeModal();
      loadCountries();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (country) => {
    if (!window.confirm(`Delete ${country.name}?`)) return;
    try {
      setError(null);
      await deleteCountry(country.country_id);
      loadCountries();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  };

  const filtered = countries.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.continent?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="data-page">
      <div className="data-toolbar">
        <div className="data-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search countries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="data-add-btn" onClick={openCreate}>
          <Plus size={18} />
          Add Country
        </button>
      </div>

      {error && (
        <div className="data-error" role="alert">
          {error}
        </div>
      )}

      <div className="data-table-wrapper">
        {loading ? (
          <div className="data-loading">Loading...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Flag</th>
                <th>Name</th>
                <th>Code</th>
                <th>Continent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((country) => (
                <tr key={country.country_id}>
                  <td>{country.country_id}</td>
                  <td>
                    {country.flag_url ? (
                      <img src={country.flag_url} alt="" className="flag-img" />
                    ) : (
                      <span className="flag-placeholder">—</span>
                    )}
                  </td>
                  <td className="data-cell-name">{country.name}</td>
                  <td><code>{country.code}</code></td>
                  <td>{country.continent || '—'}</td>
                  <td>
                    <div className="action-btns">
                      <button className="edit-btn" onClick={() => openEdit(country)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(country)} aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="data-empty">No countries found</div>
        )}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Country' : 'Add Country'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="modal-row">
                <label>Country ID *</label>
                <input
                  type="number"
                  min="1"
                  value={form.country_id}
                  onChange={(e) => setForm({ ...form, country_id: e.target.value })}
                  disabled={!!editing}
                  required
                />
              </div>
              <div className="modal-row">
                <label>Name *</label>
                <input
                  type="text"
                  maxLength="100"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="modal-row">
                <label>Code *</label>
                <input
                  type="text"
                  maxLength="3"
                  placeholder="e.g. FR"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              <div className="modal-row">
                <label>Flag URL</label>
                <input
                  type="url"
                  maxLength="255"
                  placeholder="https://..."
                  value={form.flag_url}
                  onChange={(e) => setForm({ ...form, flag_url: e.target.value })}
                />
              </div>
              <div className="modal-row">
                <label>Continent</label>
                <input
                  type="text"
                  maxLength="50"
                  placeholder="e.g. Europe"
                  value={form.continent}
                  onChange={(e) => setForm({ ...form, continent: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-submit">
                  {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Countries;
