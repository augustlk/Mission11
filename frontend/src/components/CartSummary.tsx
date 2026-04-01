import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function CartSummary() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    // Bootstrap fixed-top alert used as a sticky cart summary banner
    <div
      className="alert alert-primary d-flex justify-content-between align-items-center mb-0 rounded-0 border-0 border-bottom"
      role="alert"
      style={{ position: 'sticky', top: 0, zIndex: 1020 }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Bootstrap badge for item count */}
        <span className="fs-5 fw-semibold">
          🛒 Cart{' '}
          <span className="badge bg-primary rounded-pill">{totalItems}</span>
        </span>
        <span className="text-muted">
          {totalItems === 0
            ? 'Your cart is empty'
            : `${totalItems} item${totalItems !== 1 ? 's' : ''} — $${totalPrice.toFixed(2)} total`}
        </span>
      </div>
      <button
        className="btn btn-primary btn-sm"
        onClick={() => navigate('/cart')}
        disabled={totalItems === 0}
      >
        View Cart
      </button>
    </div>
  );
}

export default CartSummary;