namespace CobranzaAPI.Models.DTOs
{
    public class LayoutBancarioCreateDto
    {
        public string Name { get; set; }=string.Empty;
        public Guid BancoId { get; set; }

        public bool Estatus { get; set; }
    }
}