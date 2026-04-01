import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartPageProps {
  returnPath: string;
}

function CartPage({ returnPath }: CartPageProps) {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="row mb-4 align-items-center">
        <div className="col">
          <h1 className="mb-0">Shopping Cart</h1>
        </div>
        <div className="col-auto">
          {/* Continue Shopping button returns to where user left off */}
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(returnPath)}
          >
            ← Continue Shopping
          </button>
        </div>
      </div>

      {cartItems.length === 0 ? (
        // Bootstrap empty state with centered content
        <div className="text-center py-5">
          <div className="display-1 mb-3">🛒</div>
          <h3 className="text-muted">Your cart is empty</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Bootstrap table for cart line items */}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th className="text-end">Unit Price</th>
                  <th className="text-center" style={{ width: '140px' }}>
                    Quantity
                  </th>
                  <th className="text-end">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.book.bookID}>
                    <td>
                      <div className="fw-semibold">{item.book.title}</div>
                      <small className="text-muted">
                        {item.book.category}
                      </small>
                    </td>
                    <td className="text-muted">{item.book.author}</td>
                    <td className="text-end">${item.book.price.toFixed(2)}</td>
                    <td>
                      {/* Bootstrap input group for quantity controls */}
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(
                              item.book.bookID,
                              item.quantity - 1
                            )
                          }
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          min={1}
                          onChange={(e) =>
                            updateQuantity(
                              item.book.bookID,
                              parseInt(e.target.value) || 1
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(
                              item.book.bookID,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-end fw-semibold">
                      ${(item.book.price * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeFromCart(item.book.bookID)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order summary card */}
          <div className="row justify-content-end">
            <div className="col-md-4">
              <div className="card border-primary">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span>
                      Items (
                      {cartItems.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-primary w-100 mt-3">
                    Proceed to Checkout
                  </button>
                  <button
                    className="btn btn-outline-danger w-100 mt-2 btn-sm"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;