using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mission11.API.Data;

namespace Mission11.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp) => _bookContext = temp;

        // GET /Book - Returns paginated, optionally sorted and filtered list of books
        [HttpGet]
        public IActionResult GetBooks(int pageSize = 10, int pageNum = 1, string orderBy = "", string category = "")
        {
            var query = _bookContext.Books.AsQueryable();

            // Filter by category if provided
            if (!string.IsNullOrEmpty(category))
                query = query.Where(b => b.Category == category);

            // Sort by title if requested
            if (orderBy == "title")
                query = query.OrderBy(b => b.Title);

            // Get total count AFTER filtering for correct pagination
            var totalNumBooks = query.Count();

            // Apply pagination
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new
            {
                Books = books,
                TotalNumBooks = totalNumBooks
            });
        }

        // GET /Book/GetCategories - Returns distinct list of categories
        [HttpGet("GetCategories")]
        public IActionResult GetCategories()
        {
            var categories = _bookContext.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();

            return Ok(categories);
        }
    }
}