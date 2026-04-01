import { useEffect, useState } from 'react';
import type { Book } from './types/Book';
import { useCart } from './context/CartContext';
import CartSummary from './components/CartSummary';

function BookList() {
  // State for books, pagination, sorting, and category filtering
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [addedBookId, setAddedBookId] = useState<number | null>(null);

  const { addToCart } = useCart();

  // Fetch available categories once on mount
  useEffect(() => {
    fetch('https://mission13-august-backend-bwhxgfbub5hjbvhy.francecentral-01.azurewebsites.net/Book/GetCategories')
      .then((res) => res.json())
      .then((data: string[]) => setCategories(data))
      .catch(console.error);
  }, []);

  // Fetch books whenever page, size, sort, or category changes
  useEffect(() => {
    const fetchBooks = async () => {
      const params = new URLSearchParams({
        pageSize: String(pageSize),
        pageNum: String(pageNum),
        orderBy: sortBy,
        category: selectedCategory,
      });
      const response = await fetch(
        `https://mission13-august-backend-bwhxgfbub5hjbvhy.francecentral-01.azurewebsites.net/Book?${params.toString()}`
      );
      const data = await response.json();
      setBooks(data.books);
      setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
    };
    fetchBooks();
  }, [pageSize, pageNum, sortBy, selectedCategory]);

  // Reset to page 1 whenever category changes
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPageNum(1);
  };

  // Handle add to cart with brief visual feedback
  const handleAddToCart = (book: Book) => {
    addToCart(book);
    setAddedBookId(book.bookID);
    setTimeout(() => setAddedBookId(null), 1500);
  };

  return (
    <>
      {/* Sticky cart summary banner at the top */}
      <CartSummary />

      <div className="container-fluid py-4">
        <h1 className="text-center mb-4">The Hilton Bookstore</h1>

        {/* Bootstrap Grid: sidebar for filters + main content */}
        <div className="row g-4">

          {/* Sidebar — category filter using Bootstrap list-group */}
          <div className="col-12 col-md-3 col-lg-2">
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">Filter by Category</div>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action${selectedCategory === '' ? ' active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`list-group-item list-group-item-action${selectedCategory === cat ? ' active' : ''}`}
                    onClick={() => handleCategoryChange(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="col-12 col-md-9 col-lg-10">

            {/* Toolbar: sort + page size */}
            <div className="d-flex flex-wrap gap-3 align-items-center mb-4 p-3 bg-light rounded">
              <div>
                <label className="form-label mb-0 me-2 fw-semibold">Sort:</label>
                <button
                  className={`btn btn-sm ${sortBy === 'title' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => { setSortBy(sortBy === 'title' ? '' : 'title'); setPageNum(1); }}
                >
                  {sortBy === 'title' ? '✓ A–Z' : 'Sort A–Z'}
                </button>
              </div>
              <div className="ms-auto d-flex align-items-center gap-2">
                <label className="form-label mb-0 fw-semibold">Per page:</label>
                <select
                  className="form-select form-select-sm w-auto"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPageNum(1);
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>
              {selectedCategory && (
                <span className="badge bg-info text-dark d-flex align-items-center gap-1">
                  {selectedCategory}
                  <button
                    className="btn-close btn-close-sm ms-1"
                    style={{ fontSize: '0.6rem' }}
                    onClick={() => handleCategoryChange('')}
                    aria-label="Clear filter"
                  />
                </span>
              )}
            </div>

            {/* Book cards in Bootstrap grid */}
            <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3 mb-4">
              {books.map((b) => (
                <div className="col" key={b.bookID}>
                  {/* Bootstrap card with hover shadow using custom class */}
                  <div className="card h-100 shadow-sm book-card">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{b.title}</h5>
                      <p className="card-text text-muted mb-1">
                        <small>by {b.author}</small>
                      </p>
                      {/* Bootstrap badge for category */}
                      <span className="badge bg-secondary mb-2 align-self-start">
                        {b.category}
                      </span>
                      <ul className="list-unstyled small text-muted mb-3 flex-grow-1">
                        <li><strong>Publisher:</strong> {b.publisher}</li>
                        <li><strong>ISBN:</strong> {b.isbn}</li>
                        <li><strong>Pages:</strong> {b.pageCount}</li>
                      </ul>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="fs-5 fw-bold text-primary">
                          ${b.price.toFixed(2)}
                        </span>
                        <button
                          className={`btn btn-sm ${addedBookId === b.bookID ? 'btn-success' : 'btn-outline-primary'}`}
                          onClick={() => handleAddToCart(b)}
                        >
                          {addedBookId === b.bookID ? '✓ Added!' : '+ Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bootstrap pagination component */}
            <nav aria-label="Book pagination">
              <ul className="pagination justify-content-center flex-wrap">
                <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum - 1)}
                  >
                    «
                  </button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li
                    key={i + 1}
                    className={`page-item ${pageNum === i + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPageNum(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPageNum(pageNum + 1)}
                  >
                    »
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookList;