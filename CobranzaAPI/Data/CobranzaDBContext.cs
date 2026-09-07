using CobranzaAPI.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace CobranzaAPI.Data
{
    public class CobranzaDBContext: DbContext
    {
        public CobranzaDBContext(DbContextOptions<CobranzaDBContext> dbContextOptions): base(dbContextOptions)
        {
            
        }
        public DbSet<Banco> Bancos { get; set; }

        public DbSet<LayoutBancario> Layouts { get; set; }
    }
}