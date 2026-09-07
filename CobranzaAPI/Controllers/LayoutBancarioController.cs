using System.ComponentModel.DataAnnotations;
using CobranzaAPI.Data;
using CobranzaAPI.Models.Domain;
using CobranzaAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations.Operations;

namespace CobranzaAPI.Controllers;

[ApiController]
[Route("Tesoreria/[controller]")]
public class LayoutBancarioController : ControllerBase
{
    //Agregado para implementar el Dependency Injection y poder trabajarlo sin llamarlo cada vez.
    private readonly CobranzaDBContext dbContext;

    public LayoutBancarioController(CobranzaDBContext dbContext)
    {
        this.dbContext = dbContext;
    }
//Metodo get para obtener toda la informacion almacenada y sus busquedas por banco, nombre y estatus.
// Get Ruta: https://localhost:xxxx/Tesoreria/LayoutBancario pero tambien puede recibir nombre del layout, id banco y estatus.
    [HttpGet]
    public IActionResult GetAll(
    string? nombre,
    Guid? bancoId,
    bool? estatus)
{
    var query = dbContext.Layouts.AsQueryable();
        if (!string.IsNullOrEmpty(nombre))
        {
            query = query.Where(l=>l.Name.Contains(nombre));
        }

        if (bancoId.HasValue)
        {
            query=query.Where(l=> l.BancoId==bancoId.Value);
        }

        if (estatus.HasValue)
        {
            query=query.Where(l=>l.Estado==estatus.Value);
        }
            var layouts = query
        .Select(l => new LayoutBancarioDTO
        {
            Id=l.Id,
            Name = l.Name,
            Banco = l.Banco!.Nombre,
            Estatus = l.Estado 
        })
        .ToList();

    return Ok(layouts);
}

    [HttpGet]
    [Route("{id:guid}")]
    public IActionResult GetInfo([FromRoute] Guid id)
    {
            var LayoutBancarioDomain = dbContext.Layouts
                .Include(x => x.Banco)
                .FirstOrDefault(x => x.Id == id);

            if (LayoutBancarioDomain == null)
            {
                return NotFound();
            }

            var DetailsDTO = new LayoutBancarioDetailDto
            {
                Id = LayoutBancarioDomain.Id,
                Name = LayoutBancarioDomain.Name,
                Banco = LayoutBancarioDomain.Banco?.Nombre ?? string.Empty,
                Estatus = LayoutBancarioDomain.Estado
            };

            return Ok(DetailsDTO);
    }



    [HttpPost]
    //Post: https://Tesoreria/LayoutBancario

    public IActionResult Create ([FromBody] LayoutBancarioCreateDto layoutBancarioCreateDto)
    {

                //funcion para obtener el nombre del banco
        var banco = dbContext.Bancos
    .FirstOrDefault(b => b.Id == layoutBancarioCreateDto.BancoId);

        //Comprobar si el banco existe 
        if (banco == null)
        {
            return BadRequest("El banco no existe. Intentar de nuevo");
        }
        //Mapear  de DTO a Domain Model
        var LayoutBancarioModel = new LayoutBancario
        {
            Name = layoutBancarioCreateDto.Name,
            BancoId = layoutBancarioCreateDto.BancoId,
            Estado = layoutBancarioCreateDto.Estatus
        };

        //Guardar datos en la base de datos
        dbContext.Layouts.Add(LayoutBancarioModel);
        dbContext.SaveChanges();


        //Map Domain Model back to DTO
        var layoutbancariodetail = new LayoutBancarioDetailDto
        {
            Id = LayoutBancarioModel.Id,
            Name = LayoutBancarioModel.Name,
            Banco = banco?.Nombre ?? string.Empty,
            Estatus = LayoutBancarioModel.Estado
        };

        return CreatedAtAction(nameof(GetInfo), new{id=LayoutBancarioModel.Id},layoutbancariodetail);


    }



//Actualizar un registro de layout ya existente
//URL: https://localhots:xxxx/tesoreria/LayoutBancario
[HttpPut]
[Route("{id:guid}")]
 public IActionResult UpdateLayout ([FromRoute] Guid id,[FromBody] UpdateLayoutDto updateLayoutDto)
    {
         var LayoutBancarioDomain = dbContext.Layouts.FirstOrDefault(x=>x.Id==id);

        if (LayoutBancarioDomain == null)
        {
            return NotFound();
        }
                var banco = dbContext.Bancos
    .FirstOrDefault(b => b.Id == updateLayoutDto.BancoId);

        //Comprobar si el banco existe 
        if (banco == null)
        {
            return BadRequest("El banco no existe. Intentar de nuevo");
        }

        //Mapeo de DTO a Modelo Domnio
        LayoutBancarioDomain.Name=updateLayoutDto.Name;
        LayoutBancarioDomain.BancoId=updateLayoutDto.BancoId;
        LayoutBancarioDomain.Estado=updateLayoutDto.Estatus;
        
        dbContext.SaveChanges();

        //Convertir el Domain Model a DTO
        var layoutbancariodto = new LayoutBancarioDTO
        {
            Name=LayoutBancarioDomain.Name,
            Banco=banco?.Nombre ?? string.Empty,
            Estatus=LayoutBancarioDomain.Estado
        };
        return Ok(layoutbancariodto);

    }

    //Copiar un layout existente
    //URL: https://localhost:xxxx/Tesoreria/{id}/copiar
    [HttpPost]
    [Route("{id:guid}/copiar")]
    public IActionResult CopyLayout([FromRoute] Guid id)
    {
         var LayoutBancarioDomain = dbContext.Layouts.FirstOrDefault(x=>x.Id==id);

        if (LayoutBancarioDomain == null)
        {
            return NotFound();
        }


        var NuevaCopiaLayout = new LayoutBancario
        {
            Name=LayoutBancarioDomain.Name,
            BancoId=LayoutBancarioDomain.BancoId,
            Estado=LayoutBancarioDomain.Estado
        };
            var banco = dbContext.Bancos
    .FirstOrDefault(b => b.Id == NuevaCopiaLayout.BancoId);
        dbContext.Layouts.Add(NuevaCopiaLayout);
        dbContext.SaveChanges();

        var LayoutBancarioDetail = new LayoutBancarioDTO
        {
            Name = NuevaCopiaLayout.Name,
            Banco = banco?.Nombre ?? string.Empty,
            Estatus=NuevaCopiaLayout.Estado
        };

        return CreatedAtAction(nameof(GetInfo), new{id=NuevaCopiaLayout.Id},LayoutBancarioDetail);
    }


   /* public IActionResult GetAll()
    {
            var layouts = dbContext.Layouts
    .Select(l => new LayoutBancarioDTO
    {
        Name = l.Name,
        Banco = l.Banco.Nombre,
        Estatus = l.Estado
    })
    .ToList();

        return Ok(layouts);     
    }*/
}