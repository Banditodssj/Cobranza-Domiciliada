namespace CobranzaAPI.Models.Domain
{
    public class Banco
    {
        public Guid Id { get; set; }
        public string Nombre { get; set; }= string.Empty;

        public ICollection<LayoutBancario> Layouts { get; set; } = new List<LayoutBancario>();
    }
}