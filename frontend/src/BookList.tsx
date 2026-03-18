import { useEffect, useState } from "react";
import type { Book } from "./types/Book";

function BookList() {

    const [books, setBooks] = useState<Book[]>([]);
    const [pageSize, setPageSize] = useState<number>(10);
    const [pageNum, setPageNum] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [sortBy, setSortBy] = useState<string>("");

    useEffect(() => {
        const fetchBooks = async () => {
            const response = await fetch(`https://localhost:5000/Book?pageSize=${pageSize}&pageNum=${pageNum}&orderBy=${sortBy}`);
            const data = await response.json();
            setBooks(data.books);
            setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
        };

        fetchBooks();
    }, [pageSize, pageNum, sortBy]);

    return (
        <>
            <h1> Books</h1>
            <br />
            {books.map((b) =>
                <div id="bookCard" className="card" key={b.bookID}>
                    <h3 className="card-title">{b.title}</h3>
                    <div className="card-body">
                    <ul className="list-unstyled">
                        <li><strong>Title:</strong> {b.title}</li>
                        <li><strong>Author:</strong> {b.author}</li>
                        <li><strong>Publisher:</strong> {b.publisher}</li>
                        <li><strong>ISBN:</strong> {b.isbn}</li>
                        <li><strong>Classification:</strong> {b.classification}</li>
                        <li><strong>Category:</strong> {b.category}</li>
                        <li><strong>Page Count:</strong> {b.pageCount}</li>
                        <li><strong>Price:</strong> ${b.price.toFixed(2)}</li>
                    </ul>
                    </div>
                </div>
        
        )}

        <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>Previous</button>

            {[...Array(totalPages)].map(( _, i) => (
                <button key={i + 1} 
                onClick={() => setPageNum(i + 1)} 
                disabled={pageNum === (i + 1)}
                >
                    {i + 1}
                </button>
            ))}

        <button disabled={pageNum === totalPages} onClick={() => setPageNum(pageNum + 1)}>Next</button>

        <button onClick={() => setSortBy(sortBy === "title" ? "" : "title")}>
            {sortBy === "title" ? "Unsort" : "Sort by Title"}
        </button>

        <br />
        <label>
            Results per page:
            <select 
                value={pageSize} 
                onChange={(p) => {
                    setPageSize(Number(p.target.value));
                    setPageNum(1)
                }}
            >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
            </select>
        </label>

        </>
    );
}

export default BookList;