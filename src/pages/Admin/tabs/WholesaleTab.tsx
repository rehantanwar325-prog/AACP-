import React from 'react';
import { CheckCircle2, FileText, Trash2, Phone } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

const WholesaleTab: React.FC = () => {
  const { inquiries, setInquiries } = useAppContext();

  const markResponded = (id: string) => {
    setInquiries(inquiries.map(inq => 
      inq.id === id ? { ...inq, status: 'Responded' } : inq
    ));
  };

  const deleteInquiry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry record?")) {
      setInquiries(inquiries.filter(i => i.id !== id));
    }
  };

  return (
    <section className="tab-content active" id="tab-wholesale">
      <div className="dashboard-card full-height">
        <div className="card-header">
          <h3>Wholesale Client Inquiries</h3>
        </div>
        <div className="card-body">
          {inquiries.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} style={{ color: 'var(--border)', marginBottom: '15px' }} />
              <h4>No Wholesale Inquiries</h4>
              <p style={{ color: 'var(--text-muted)' }}>You haven't received any new wholesale requests yet. They will appear here.</p>
            </div>
          ) : (
            <div className="inquiry-grid">
              {inquiries.map(inq => (
                <div className="inquiry-card" key={inq.id}>
                  <div className="inquiry-header">
                    <h4>{inq.name}</h4>
                    <span className={`badge-status ${inq.status === 'Pending' ? 'pending' : 'responded'}`}>{inq.status}</span>
                  </div>
                  <div className="inquiry-body">
                    <p className="inq-detail"><span className="label">Date:</span> {inq.date}</p>
                    <p className="inq-detail"><span className="label">Contact:</span> <a href={`tel:${inq.phone.replace(/\\s+/g, "")}`}><Phone size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }}/>{inq.phone}</a></p>
                    <p className="inq-detail"><span className="label">Interested In:</span> <strong>{inq.product}</strong> ({inq.quantity} kg volume)</p>
                    {inq.message && <div className="inq-message"><span className="label d-block">Message / Requirements:</span> <p className="message-box">{inq.message}</p></div>}
                  </div>
                  <div className="inquiry-footer">
                    {inq.status === 'Pending' ? (
                      <button className="btn btn-outline" onClick={() => markResponded(inq.id)}>
                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Mark as Responded
                      </button>
                    ) : (
                      <button className="btn btn-outline" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        <CheckCircle2 size={16} style={{ marginRight: '6px' }} /> Responded
                      </button>
                    )}
                    <button className="btn-icon delete" onClick={() => deleteInquiry(inq.id)} title="Delete Inquiry">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WholesaleTab;
