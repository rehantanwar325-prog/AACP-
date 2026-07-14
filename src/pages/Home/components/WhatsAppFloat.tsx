import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const WhatsAppFloat: React.FC = () => {
  const { settings } = useAppContext();
  const whatsappPhone = settings.retailPhone.replace(/[^0-9]/g, "");

  return (
    <a href={`https://wa.me/${whatsappPhone}?text=Hello%20AACP%20Chicken,%20I%20would%20like%20to%20inquire%20about%20your%20chicken%20products.`}
      target="_blank" rel="noreferrer" className="whatsapp-float-btn" aria-label="Contact AACP Chicken on WhatsApp">
      <MessageCircle className="whatsapp-btn-icon" />
      <span className="whatsapp-tooltip">Chat with us</span>
    </a>
  );
};

export default WhatsAppFloat;
