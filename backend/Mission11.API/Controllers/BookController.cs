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

        // GET /Book - Returns sorted list of books
        [HttpGet]
        public IActionResult GetProjects(int pageSize = 10, int pageNum = 1, string orderBy = "")
        {
            var query = _bookContext.Books.AsQueryable();

            // Sort by title if requested
            if (orderBy == "title")
                query = query.OrderBy(b => b.Title);

            // Apply pagination
            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            // Get total count for pagination calculation on the frontend
            var totalNumBooks = _bookContext.Books.Count();

            // Return  results and total count as JSON
            return Ok(new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            });
        }
    }
}