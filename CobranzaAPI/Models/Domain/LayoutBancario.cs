namespace CobranzaAPI.Models.Domain
{
    public class LayoutBancario
    {
        //Guardamos el identificador unico para el layout
        public Guid  Id { get; set; }
        //Guardamos el nombre de nuestro layout
        public string Name { get; set; }=string.Empty;
        //Guardamos el estado para nuestro layout
        public bool Estado { get; set; }

        //Genrar relaciones con el dominio de Banco para nombres dinamicos
        public Guid BancoId { get; set; }

        public Banco? Banco { get; set; }
    }
}