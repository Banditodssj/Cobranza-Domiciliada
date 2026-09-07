using CobranzaAPI.Data;
using CobranzaAPI.Models.Domain;
using CobranzaAPI.Models.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;


namespace CobranzaAPI.Controllers;

[ApiController]
[Route("Tesoreria/[controller]")]


public class BancoController : ControllerBase
{
       private readonly CobranzaDBContext dbContext;

    public BancoController(CobranzaDBContext dbContext)
    {
        this.dbContext = dbContext;
    }
    
    [HttpGet]
    public IActionResult GetAllBanco()
    {
        var BancoDomain =  dbContext.Bancos.AsQueryable();
         var Bancos = BancoDomain.Select(
            b => new BancoDto
            {
                Id=b.Id,
                Nombre=b.Nombre
            }
         ).ToList();
    return Ok (Bancos);
    }
    
    
}