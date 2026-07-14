import React, { useState } from 'react';
import { Plus, Pen, Trash2, UploadCloud } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { Product } from '../../../types';

const CatalogTab: React.FC = () => {
  const { products, setProducts, getOriginalPrice } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('/assets/images/whole_chicken.png');
  const [tag, setTag] = useState('');
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('');
  const [priceType, setPriceType] = useState<'dynamic' | 'fixed'>('dynamic');
  const [multiplier, setMultiplier] = useState('1.0');
  const [fixedPrice, setFixedPrice] = useState('');

  const [usePreset, setUsePreset] = useState(false);

  const openModal = (product?: Product) => {
    if (product) {
      setEditId(product.id);
      setTitle(product.title);
      setDesc(product.desc);
      setImage(product.image);
      setTag(product.tag || '');
      setWeight(product.weight);
      setType(product.type);
      setPriceType(product.priceType);
      setMultiplier(product.multiplier.toString());
      setFixedPrice(product.fixedPrice ? product.fixedPrice.toString() : '');
      setUsePreset(false);
    } else {
      setEditId(null);
      setTitle('');
      setDesc('');
      setImage('/assets/images/whole_chicken.png');
      setTag('');
      setWeight('');
      setType('');
      setPriceType('dynamic');
      setMultiplier('1.0');
      setFixedPrice('');
      setUsePreset(false);
    }
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: editId || `prod-${Date.now()}`,
      title,
      desc,
      image,
      tag,
      weight,
      type,
      priceType,
      multiplier: parseFloat(multiplier) || 1.0,
      fixedPrice: parseInt(fixedPrice) || 0
    };

    if (editId) {
      setProducts(products.map(p => p.id === editId ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image file is too large! Maximum size is 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setImage(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="tab-content active" id="tab-catalog">
      <div className="dashboard-card">
        <div className="card-header flex-header">
          <h3>Product Catalog Items</h3>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={18} style={{ marginRight: '6px' }} /> Add New Product
          </button>
        </div>
        <div className="card-body scroll-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Pricing Model</th>
                <th>Calculated Price</th>
                <th>Weight Pack</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={6} className="text-center" style={{ color: 'var(--text-muted)', padding: '30px' }}>Catalog is empty. Add a product to get started.</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p.id}>
                    <td><img src={p.image} className="table-img" alt={p.title} /></td>
                    <td><strong>{p.title}</strong><br /><small style={{ color: 'var(--text-muted)', display: 'inline-block', maxWidth: '250px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{p.desc}</small></td>
                    <td><span style={{ fontSize: '0.85rem' }}>{p.priceType === 'fixed' ? 'Fixed Price' : `Dynamic (${p.multiplier}x Base)`}</span></td>
                    <td><strong>₹{getOriginalPrice(p)}</strong></td>
                    <td>{p.weight}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" onClick={() => openModal(p)} title="Edit details"><Pen size={16} /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(p.id)} title="Delete product"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay" style={{ display: 'flex' }}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? 'Edit Product Details' : 'Add New Catalog Product'}</h3>
              <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            
            <form className="admin-form" onSubmit={handleSave}>
              <div className="modal-body scroll-modal-body">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="checkbox-toggle" style={{ marginBottom: '10px' }}>
                      <input type="checkbox" checked={usePreset} onChange={e => setUsePreset(e.target.checked)} />
                      <span className="toggle-slider"></span>
                      <span>Use Image Presets / Assets</span>
                    </label>
                    
                    {usePreset && (
                      <select className="form-control" value={image} onChange={e => setImage(e.target.value)}>
                        <option value="/assets/images/whole_chicken.png">Whole Chicken Asset</option>
                        <option value="/assets/images/chicken_breast.png">Chicken Breast Asset</option>
                        <option value="/assets/images/chicken_legs.png">Chicken Legs Asset</option>
                        <option value="/assets/images/chicken_wings.png">Chicken Wings Asset</option>
                        <option value="/assets/images/boneless_chicken.png">Boneless Cubes Asset</option>
                        <option value="/assets/images/chicken_mince.png">Chicken Mince Asset</option>
                      </select>
                    )}
                  </div>

                  {!usePreset && (
                    <div className="form-group full-width">
                      <label>Product Image Upload</label>
                      <div className="upload-dropzone" onClick={() => document.getElementById('prod-image-file')?.click()}>
                        {image && !image.startsWith('/assets') ? (
                          <img src={image} className="image-preview" style={{ display: 'block' }} alt="Preview" />
                        ) : (
                          <div className="upload-placeholder">
                            <UploadCloud size={32} />
                            <span>Click to browse</span>
                            <small>JPG, PNG, WEBP (Max 2MB)</small>
                          </div>
                        )}
                        <input type="file" id="prod-image-file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Product Title *</label>
                    <input type="text" className="form-control" required value={title} onChange={e => setTitle(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Promo / Best Tag</label>
                    <input type="text" className="form-control" value={tag} onChange={e => setTag(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Weight Packaging Pack *</label>
                    <input type="text" className="form-control" required value={weight} onChange={e => setWeight(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Product Category Type *</label>
                    <input type="text" className="form-control" required value={type} onChange={e => setType(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Pricing Model Type *</label>
                    <select className="form-control" required value={priceType} onChange={e => setPriceType(e.target.value as any)}>
                      <option value="dynamic">Dynamic (Base rate scale multiplier)</option>
                      <option value="fixed">Fixed (Set manual price)</option>
                    </select>
                  </div>

                  {priceType === 'dynamic' ? (
                    <div className="form-group">
                      <label>Price Multiplier Index *</label>
                      <input type="number" step="0.1" min="0.1" className="form-control" required value={multiplier} onChange={e => setMultiplier(e.target.value)} />
                    </div>
                  ) : (
                    <div className="form-group">
                      <label>Fixed Pricing Value (₹) *</label>
                      <input type="number" min="1" className="form-control" required value={fixedPrice} onChange={e => setFixedPrice(e.target.value)} />
                    </div>
                  )}

                  <div className="form-group full-width">
                    <label>Product Description *</label>
                    <textarea className="form-control" rows={3} required value={desc} onChange={e => setDesc(e.target.value)}></textarea>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default CatalogTab;
