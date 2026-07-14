import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X } from 'lucide-react';
import { SHOP_LAT, SHOP_LON } from './CartModal';

// Fix for default marker icon in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconRetinaUrl: iconRetina,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapLocationPickerProps {
  onLocationSelect: (lat: string, lon: string) => void;
  initialLat?: string;
  initialLon?: string;
  onClose: () => void;
}

const LocationMarker = ({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapLocationPicker: React.FC<MapLocationPickerProps> = ({ onLocationSelect, initialLat, initialLon, onClose }) => {
  const defaultPosition: [number, number] = [SHOP_LAT, SHOP_LON]; // Default to Shop Location
  const [position, setPosition] = useState<L.LatLng | null>(
    initialLat && initialLon ? L.latLng(parseFloat(initialLat), parseFloat(initialLon)) : null
  );

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position.lat.toString(), position.lng.toString());
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="cart-modal-overlay open" style={{ zIndex: 4000, justifyContent: 'center', alignItems: 'center' }} onClick={handleOverlayClick}>
      <div className="cart-modal-content" style={{ maxWidth: '500px', height: 'auto', display: 'flex', flexDirection: 'column', transform: 'none', borderRadius: '12px' }}>
        <div className="cart-modal-header">
          <h3>Select Location on Map</h3>
          <button className="cart-modal-close" onClick={onClose} aria-label="Close Map">
            <X size={24} />
          </button>
        </div>
        <div className="cart-modal-body" style={{ padding: '16px', flex: 'none' }}>
          <p style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Click on the map to pin your delivery location.</p>
          <div style={{ height: '350px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <MapContainer 
              center={position || defaultPosition} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LocationMarker position={position} setPosition={setPosition} />
            </MapContainer>
          </div>
        </div>
        <div className="cart-modal-footer">
          <button 
            className="btn btn-primary btn-full" 
            onClick={handleConfirm} 
            disabled={!position}
          >
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
