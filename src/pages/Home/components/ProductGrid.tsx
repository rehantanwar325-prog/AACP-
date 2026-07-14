import React from 'react';
import { ShoppingCart, Scale, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const ProductGrid: React.FC = () => {
  const { products, cart, setCart, getProductPrice, getOriginalPrice, activeOffer } = useAppContext();

  const handleAddToCart = (productId: string) => {
    setCart({ ...cart, [productId]: 1 });
  };

  const incrementQty = (productId: string) => {
    setCart({ ...cart, [productId]: (cart[productId] || 0) + 1 });
  };

  const decrementQty = (productId: string) => {
    const currentQty = cart[productId] || 0;
    if (currentQty > 1) {
      setCart({ ...cart, [productId]: currentQty - 1 });
    } else {
      const newCart = { ...cart };
      delete newCart[productId];
      setCart(newCart);
    }
  };

  return (
    <section id="products" className="products-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-tag">Our Products</span>
          <h2 className="section-title">Our Premium Selection</h2>
          <p className="section-subtitle">Chilled, cleanly cut, and ready to cook. Available in custom retail and wholesale packaging.</p>
        </div>

        <div className="products-grid">
          {products.map(p => {
            const calculatedPrice = getProductPrice(p);
            const originalPrice = getOriginalPrice(p);
            const hasDiscount = activeOffer.enabled && activeOffer.percent > 0 && originalPrice !== calculatedPrice;
            const qty = cart[p.id] || 0;

            return (
              <div className="product-card card-hover" key={p.id}>
                <div className="product-img-container" style={{ position: 'relative' }}>
                  <img src={p.image} alt={p.title} className="product-img" loading="lazy" />
                  {p.tag && <span className="product-tag font-alt">{p.tag}</span>}
                  {hasDiscount && (
                    <span style={{
                      position: 'absolute', top: '8px', right: '8px', background: 'linear-gradient(135deg,#ef4444,#f97316)',
                      color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px',
                      borderRadius: '20px', zIndex: 2
                    }}>{activeOffer.percent}% OFF</span>
                  )}
                </div>
                <div className="product-info">
                  <div className="product-title-row">
                    <h3 className="product-title">{p.title}</h3>
                    <span className="product-card-price">
                      {hasDiscount ? (
                        <>
                          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '4px' }}>
                            ₹{originalPrice}
                          </span>
                          ₹{calculatedPrice}
                        </>
                      ) : (
                        `₹${calculatedPrice}`
                      )}
                    </span>
                  </div>
                  <p className="product-desc">{p.desc}</p>
                  <div className="product-meta">
                    <span className="meta-item"><Scale size={16} style={{ marginRight: '4px' }} /> {p.weight}</span>
                    <span className="meta-item"><CheckCircle2 size={16} style={{ marginRight: '4px' }} /> {p.type}</span>
                  </div>

                  {qty > 0 ? (
                    <div className="product-actions-qty">
                      <div className="qty-btn-container">
                        <button className="qty-btn" onClick={() => decrementQty(p.id)} aria-label="Decrease quantity">-</button>
                        <span className="qty-count">{qty}</span>
                        <button className="qty-btn" onClick={() => incrementQty(p.id)} aria-label="Increase quantity">+</button>
                      </div>
                    </div>
                  ) : (
                    <div className="product-actions">
                      <button className="btn btn-outline btn-full" onClick={() => handleAddToCart(p.id)}>
                        <ShoppingCart size={18} style={{ marginRight: '6px' }} /> Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
