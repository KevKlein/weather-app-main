// components/Modal.jsx
import { FaX } from "react-icons/fa6";
import "./Modal.css";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <section className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close-button" onClick={onClose} >
            <FaX />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  );
}
