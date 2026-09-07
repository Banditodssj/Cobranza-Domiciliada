namespace CobranzaAPI.Models.DTOs
{
    public class LayoutBancarioDTO
    {
        public Guid Id { get; set; }
        public string Name{get; set;}=string.Empty;
        public string Banco {get; set;}=string.Empty;
        public bool Estatus {get; set;}
    }
}