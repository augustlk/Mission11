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

        [HttpGet]
        public IActionResult GetProjects(int pageSize = 10, int pageNum = 1, string orderBy = "")
        {
            var query = _bookContext.Books.AsQueryable();

            if (orderBy == "title")
                query = query.OrderBy(b => b.Title);

            var something = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var totalNumBooks = _bookContext.Books.Count();

            return Ok(new
            {
                Books = something,
                TotalNumBooks = totalNumBooks
            });
        }
    }
}
