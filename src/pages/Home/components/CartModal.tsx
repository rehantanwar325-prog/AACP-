import React, { useState } from 'react';
import { ShoppingCart, X, MapPin, Truck, Sparkles, Trash2, MessageSquare } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const CartModal: React.FC = () => {
  const { cart, setCart, products, getProductPrice, settings } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  const cartItems = products.filter(p => cart[p.id] > 0);
  const totalItems = cartItems.reduce((acc, p) => acc + (cart[p.id] || 0), 0);
  let itemsTotal = cartItems.reduce((acc, p) => acc + (getProductPrice(p) * (cart[p.id] || 0)), 0);

  const ratePerKm = parseFloat(settings.deliveryRatePerKm) || 10;
  const minOrderForFree = parseFloat(settings.freeDeliveryMinOrder) || 0;
  const maxDistanceForFree = parseFloat(settings.freeDeliveryMaxDistance) || 0;
  const flatRate = parseInt(settings.deliveryFlatRate) || 20;

  // Simulate calculating distance, in reality you'd parse settings.mapsLink 
  // and use Haversine if lat/lon are set.
  const distance = lat && lon ? 5.0 : 0; // dummy distance for now to avoid long calc in component

  let isFreeDelivery = false;
  let freeDeliveryReason = "";
  let deliveryFee = 0;

  if (itemsTotal > 0 && minOrderForFree > 0 && itemsTotal >= minOrderForFree) {
    isFreeDelivery = true;
    freeDeliveryReason = `Free Delivery (Order above ₹${minOrderForFree})`;
  } else if (lat && lon && maxDistanceForFree > 0 && distance <= maxDistanceForFree) {
    isFreeDelivery = true;
    freeDeliveryReason = `Free Delivery (Within ${maxDistanceForFree} km)`;
  }

  if (orderType === 'delivery') {
    if (!isFreeDelivery) {
      if (lat && lon) {
        deliveryFee = Math.max(ratePerKm, Math.ceil(distance) * ratePerKm);
      } else {
        deliveryFee = flatRate;
      }
    }
  }

  const grandTotal = itemsTotal + deliveryFee;

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

  const removeItem = (productId: string) => {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLat(position.coords.latitude.toString());
          setLon(position.coords.longitude.toString());
          alert("Location captured automatically!");
        },
        () => alert("Unable to get location.")
      );
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalItems === 0) return;

    let text = `*New Order - AACP Chicken*\n\n`;
    text += `*Customer Details:*\n`;
    text += `• *Name:* ${name}\n`;
    text += `• *Order Type:* ${orderType === "pickup" ? "Self-Pickup (Take Away)" : "Home Delivery"}\n`;
    if (orderType === "delivery") {
      text += `• *Address:* ${address}\n`;
      if (lat && lon) {
        text += `• *Delivery Location Pin:* https://www.google.com/maps?q=${lat},${lon}\n`;
      }
    }
    if (notes) {
      text += `• *${orderType === "pickup" ? "Special Notes" : "Delivery Notes"}:* ${notes}\n`;
    }
    text += `\n*Items Ordered:*\n`;
    text += `---------------------------------\n`;

    cartItems.forEach(p => {
      const qty = cart[p.id];
      const price = getProductPrice(p);
      text += `• ${qty} x ${p.title} (@ ₹${price}) = *₹${price * qty}*\n`;
    });

    if (orderType === "delivery") {
      if (isFreeDelivery) {
        text += `• Delivery Charge = *FREE* [Offer: ${freeDeliveryReason}]\n`;
      } else {
        text += `• Delivery Charge = *₹${deliveryFee}*\n`;
      }
    }

    text += `---------------------------------\n`;
    text += `*Grand Total: ₹${grandTotal}*\n\n`;
    text += `Please confirm my order. Thank you!`;

    const encodedText = encodeURIComponent(text);
    const whatsappPhone = settings.retailPhone.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedText}`;

    window.open(whatsappUrl, "_blank");
    setCart({});
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className={`cart-float-btn ${totalItems === 0 ? 'hide-cart' : ''}`} 
        onClick={() => setIsOpen(true)}
        aria-label="View Shopping Cart"
      >
        <div className="cart-btn-icon-wrapper">
          <ShoppingCart size={20} />
          <span className="cart-badge">{totalItems}</span>
        </div>
        <span className="cart-btn-text">₹{itemsTotal} ({totalItems} items)</span>
      </button>

      <div className={`cart-modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false) }}>
        <div className="cart-modal-content">
          <div className="cart-modal-header">
            <h3><ShoppingCart size={20} style={{ marginRight: '8px' }} /> Your Order Cart</h3>
            <button className="cart-modal-close" onClick={() => setIsOpen(false)} aria-label="Close Cart">
              <X size={24} />
            </button>
          </div>

          <div className="cart-modal-body">
            <div className="cart-items-list">
              {cartItems.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty. Add some fresh chicken from our products!</p>
              ) : (
                cartItems.map(p => (
                  <div className="cart-item-row" key={p.id}>
                    <div className="cart-item-info">
                      <h4 className="cart-item-name">{p.title}</h4>
                      <span className="cart-item-price-calc">{cart[p.id]} x ₹{getProductPrice(p)} = <strong className="cart-item-subtotal">₹{getProductPrice(p) * cart[p.id]}</strong></span>
                    </div>
                    <div className="cart-item-actions">
                      <div className="cart-item-qty">
                        <button className="qty-btn" onClick={() => decrementQty(p.id)}>-</button>
                        <span className="qty-count">{cart[p.id]}</span>
                        <button className="qty-btn" onClick={() => incrementQty(p.id)}>+</button>
                      </div>
                      <button className="btn-remove-item" onClick={() => removeItem(p.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form id="cart-checkout-form" className="cart-form" onSubmit={handleCheckout}>
              <h4 className="form-section-title">Delivery Details</h4>

              <div className="form-group">
                <label>Order Option</label>
                <div className="order-type-toggle">
                  <label className="order-type-label">
                    <input type="radio" name="order-type" value="delivery" checked={orderType === 'delivery'} onChange={() => setOrderType('delivery')} />
                    <span>Home Delivery</span>
                  </label>
                  <label className="order-type-label">
                    <input type="radio" name="order-type" value="pickup" checked={orderType === 'pickup'} onChange={() => setOrderType('pickup')} />
                    <span>Self-Pickup</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="cart-cust-name">Your Name *</label>
                <input type="text" id="cart-cust-name" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Rajesh Kumar" required />
              </div>

              {orderType === 'delivery' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label htmlFor="cart-cust-address" style={{ marginBottom: 0 }}>Delivery Address / Location *</label>
                    <button type="button" onClick={handleGetLocation}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}>
                      <MapPin style={{ width: '12px', height: '12px' }} /> Get Live Location
                    </button>
                  </div>
                  <textarea id="cart-cust-address" className="form-control" rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="E.g. Flat 302, Sector 15..." required></textarea>

                  {itemsTotal > 0 && (
                    <div style={{ display: 'flex', marginTop: '10px', padding: '10px', backgroundColor: 'var(--bg-accent)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <Truck style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '4px', color: 'var(--text-muted)' }} />
                        Distance: <strong>{lat ? `${distance.toFixed(1)} km` : 'Manual Address'}</strong>
                      </span>
                      <span>
                        Delivery Fee: <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>
                          {isFreeDelivery ? <span style={{ color: '#10b981' }}>₹0</span> : `₹${deliveryFee}`}
                        </strong>
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="cart-cust-notes">{orderType === 'delivery' ? 'Delivery Notes (Optional)' : 'Special Notes (Optional)'}</label>
                <input type="text" id="cart-cust-notes" className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="E.g. Deliver before 12 PM" />
              </div>
            </form>
          </div>

          <div className="cart-modal-footer">
            {orderType === 'delivery' && isFreeDelivery && itemsTotal > 0 && (
              <div style={{ display: 'flex', marginBottom: '12px', padding: '8px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 'var(--radius-sm)', color: '#10b981', fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 700, alignItems: 'center', gap: '6px' }}>
                <Sparkles style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                <span>{freeDeliveryReason}</span>
              </div>
            )}

            <div className="cart-total-summary">
              <span className="total-label">Grand Total:</span>
              <span className="total-amount">₹{grandTotal}</span>
            </div>
            <button type="submit" form="cart-checkout-form" className="btn btn-primary btn-full checkout-btn">
              <MessageSquare size={18} style={{ marginRight: '8px' }} /> Place Order on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartModal;
