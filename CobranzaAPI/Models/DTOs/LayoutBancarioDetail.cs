namespace CobranzaAPI.Models.DTOs
{
    public class LayoutBancarioDetailDto
    {
         public Guid  Id { get; set; }
        //Guardamos el nombre de nuestro layout
        public string Name { get; set; }=string.Empty;
        //Guardamos el estado para nuestro layout
        public string Banco {get; set;}=string.Empty;
        public bool Estatus { get; set; }
    }
}