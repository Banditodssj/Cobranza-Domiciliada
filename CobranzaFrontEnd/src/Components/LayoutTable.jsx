import { useEffect, useState } from 'react'
import './LayoutTable.css'

function LayoutTable() {

  // =========================
  // ESTADOS
  // =========================

  const [layouts, setLayouts] = useState([])
  const [bancos, setBancos] = useState([])

  // Filtros
  const [nombre, setNombre] = useState('')
  const [bancoId, setBancoId] = useState('')
  const [estatus, setEstatus] = useState('')

  // Layout seleccionado
  const [layoutSeleccionado, setLayoutSeleccionado] = useState(null)

  // Modal detalle
  const [mostrarDetalle, setMostrarDetalle] = useState(false)

  // Modal editar
  const [modoEdicion, setModoEdicion] = useState(false)
  const [nombreEditar, setNombreEditar] = useState('')
  const [bancoEditar, setBancoEditar] = useState('')
  const [estatusEditar, setEstatusEditar] = useState(true)

  // Modal crear
  const [mostrarCrear, setMostrarCrear] = useState(false)
  const [nombreCrear, setNombreCrear] = useState('')
  const [bancoCrear, setBancoCrear] = useState('')
  const [estatusCrear, setEstatusCrear] = useState(true)

  // Notificación
  const [notificacion, setNotificacion] = useState(null)

  //Confirmacion al momento de copiar 
  const [layoutParaCopiar, setLayoutParaCopiar] = useState(null)


  //Wait Status
  const [procesando, setProcesando] = useState(false)

  // =========================
  // CARGA INICIAL
  // =========================

  useEffect(() => {
    obtenerLayouts()
    obtenerBancos()
  }, [])


  // =========================
  // OBTENER LAYOUTS
  // =========================

  const obtenerLayouts = () => {

    fetch('http://localhost:5020/Tesoreria/LayoutBancario')
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudieron obtener los layouts')
        }

        return response.json()
      })
      .then(data => {

        setLayouts(data)
      })
      .catch(error => {

        console.error('Error al obtener los layouts:', error)

      })
  }


  // =========================
  // OBTENER BANCOS
  // =========================

  const obtenerBancos = () => {

    fetch('http://localhost:5020/Tesoreria/Banco')
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudieron obtener los bancos')
        }

        return response.json()
      })
      .then(data => {

        setBancos(data)
      })
      .catch(error => {

        console.error('Error al obtener los bancos:', error)

      })
  }


  // =========================
  // NOTIFICACIÓN
  // =========================

  const mostrarNotificacion = (tipo, titulo, mensaje) => {

    setNotificacion({
      tipo,
      titulo,
      mensaje
    })

    setTimeout(() => {
      setNotificacion(null)
    }, 3000)
  }


  // =========================
  // BUSCAR LAYOUTS
  // =========================

  const buscarLayouts = () => {

    const params = new URLSearchParams()

    if (nombre) {
      params.append('nombre', nombre)
    }

    if (bancoId) {
      params.append('bancoId', bancoId)
    }

    if (estatus) {
      params.append('estatus', estatus)
    }

    fetch(
      `http://localhost:5020/Tesoreria/LayoutBancario?${params.toString()}`
    )
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudieron buscar los layouts')
        }

        return response.json()
      })
      .then(data => {

        setLayouts(data)
      })
      .catch(error => {

        console.error('Error al buscar los layouts:', error)

        mostrarNotificacion(
          'error',
          'Error',
          'No se pudieron buscar los layouts.'
        )

      })
  }


  // =========================
  // LIMPIAR FILTROS
  // =========================

  const limpiarFiltros = () => {

    setNombre('')
    setBancoId('')
    setEstatus('')

    obtenerLayouts()
  }


  // =========================
  // VER LAYOUT
  // =========================

  const verLayout = (id) => {

    fetch(
      `http://localhost:5020/Tesoreria/LayoutBancario/${id}`
    )
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudo obtener el layout')
        }

        return response.json()
      })
      .then(data => {

        setLayoutSeleccionado(data)
        setMostrarDetalle(true)

      })
      .catch(error => {

        console.error('Error al obtener el layout:', error)

        mostrarNotificacion(
          'error',
          'Error',
          'No se pudo obtener la información del layout.'
        )

      })
  }


  // =========================
  // CERRAR DETALLE
  // =========================

  const cerrarDetalle = () => {

    setMostrarDetalle(false)
    setLayoutSeleccionado(null)

  }


  // =========================
  // EDITAR LAYOUT
  // =========================

  const editarLayout = (id) => {

    fetch(
      `http://localhost:5020/Tesoreria/LayoutBancario/${id}`
    )
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudo obtener el layout')
        }

        return response.json()
      })
      .then(data => {

        setLayoutSeleccionado(data)

        setNombreEditar(data.name)

        const bancoEncontrado = bancos.find(
          banco => banco.nombre === data.banco
        )

        setBancoEditar(
          bancoEncontrado ? bancoEncontrado.id : ''
        )

        setEstatusEditar(data.estatus)

        setModoEdicion(true)

      })
      .catch(error => {

        console.error('Error al obtener el layout:', error)

        mostrarNotificacion(
          'error',
          'Error',
          'No se pudo obtener la información del layout.'
        )

      })
  }


  // =========================
  // CERRAR EDICIÓN
  // =========================

  const cerrarEdicion = () => {

    setModoEdicion(false)
    setLayoutSeleccionado(null)

    setNombreEditar('')
    setBancoEditar('')
    setEstatusEditar(true)

  }


  // =========================
  // GUARDAR EDICIÓN
  // =========================

  const guardarEdicion = () => {

    if (!nombreEditar.trim()) {

      mostrarNotificacion(
        'error',
        'Campo requerido',
        'Debes ingresar un nombre para el layout.'
      )

      return
    }

    if (!bancoEditar) {

      mostrarNotificacion(
        'error',
        'Campo requerido',
        'Debes seleccionar un banco.'
      )

      return
    }

    const datos = {
      name: nombreEditar,
      bancoId: bancoEditar,
      estatus: estatusEditar
    }

    fetch(
      `http://localhost:5020/Tesoreria/LayoutBancario/${layoutSeleccionado.id}`,
      {
        method: 'PUT',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudo actualizar el layout')
        }

        return response.json()
      })
      .then(data => {

        console.log('Layout actualizado:', data)

        cerrarEdicion()

        obtenerLayouts()

        mostrarNotificacion(
          'success',
          'Layout actualizado',
          'Los cambios se guardaron correctamente.'
        )

      })
      .catch(error => {

        console.error('Error al actualizar el layout:', error)

        mostrarNotificacion(
          'error',
          'Error',
          'No se pudo actualizar el layout.'
        )

      })
  }


  // =========================
  // COPIAR LAYOUT
  // =========================

const abrirConfirmacionCopiar = (layout) => {
  setLayoutParaCopiar(layout)
}

const cerrarConfirmacionCopiar = () => {
  setLayoutParaCopiar(null)
}
  
const copiarLayout = (id) => {

  // Evita que se ejecute dos veces
  if (procesando) {
    return
  }

  setProcesando(true)

  fetch(
    `http://localhost:5020/Tesoreria/LayoutBancario/${id}/copiar`,
    {
      method: 'POST'
    }
  )
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo copiar el layout')
      }

      return response.json()
    })
    .then(data => {
      console.log('Layout copiado:', data)

      cerrarConfirmacionCopiar()

      obtenerLayouts()

      mostrarNotificacion(
        'success',
        'Layout copiado',
        'El layout se copió correctamente.'
      )
    })
    .catch(error => {
      console.error('Error al copiar el layout:', error)

      mostrarNotificacion(
        'error',
        'Error',
        'No se pudo copiar el layout.'
      )
    })
    .finally(() => {
      setProcesando(false)
    })
}


  // =========================
  // ABRIR CREAR
  // =========================

  const abrirCrear = () => {

    setNombreCrear('')
    setBancoCrear('')
    setEstatusCrear(true)

    setMostrarCrear(true)

  }


  // =========================
  // CERRAR CREAR
  // =========================

  const cerrarCrear = () => {

    setMostrarCrear(false)

    setNombreCrear('')
    setBancoCrear('')
    setEstatusCrear(true)

  }


  // =========================
  // CREAR LAYOUT
  // =========================

  const crearLayout = () => {

    if (!nombreCrear.trim()) {

      mostrarNotificacion(
        'error',
        'Campo requerido',
        'Debes ingresar un nombre para el layout.'
      )

      return
    }

    if (!bancoCrear) {

      mostrarNotificacion(
        'error',
        'Campo requerido',
        'Debes seleccionar un banco.'
      )

      return
    }

    const datos = {
      name: nombreCrear,
      bancoId: bancoCrear,
      estatus: estatusCrear
    }

    fetch(
      'http://localhost:5020/Tesoreria/LayoutBancario',
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(datos)
      }
    )
      .then(response => {

        if (!response.ok) {
          throw new Error('No se pudo crear el layout')
        }

        return response.json()
      })
      .then(data => {

        console.log('Layout creado:', data)

        cerrarCrear()

        obtenerLayouts()

        mostrarNotificacion(
          'success',
          'Layout creado',
          'El layout se creó correctamente.'
        )

      })
      .catch(error => {

        console.error('Error al crear el layout:', error)

        mostrarNotificacion(
          'error',
          'Error',
          'No se pudo crear el layout.'
        )

      })
  }


  // =========================
  // RENDER
  // =========================

  return (

    <div className="layout-container">

      <div className="layout-content">


        {/* =========================
            NOTIFICACIÓN
            ========================= */}

        {notificacion && (
          <div
            style={{
              position: 'fixed',
              top: '25px',
              right: '25px',
              minWidth: '320px',
              maxWidth: '420px',
              padding: '18px 22px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
              zIndex: 999999,
              borderLeft: `5px solid ${
                notificacion.tipo === 'success'
                  ? '#16a34a'
                  : '#dc2626'
              }`,
              boxSizing: 'border-box'
            }}
          >
            <div
              style={{
                fontSize: '15px',
                fontWeight: '700',
                marginBottom: '5px',
                color:
                  notificacion.tipo === 'success'
                    ? '#166534'
                    : '#991b1b'
              }}
            >
              {notificacion.titulo}
            </div>

            <div
              style={{
                fontSize: '13px',
                color: '#6b7280'
              }}
            >
              {notificacion.mensaje}
            </div>
          </div>
        )}


        {/* =========================
            ENCABEZADO
            ========================= */}

        <div className="layout-header">

          <h1>
            Layouts Bancarios
          </h1>

          <p>
            Recuperacion de layouts bancarios para cobranza domiciliada de bancos
          </p>

        </div>


        {/* =========================
            FILTROS
            ========================= */}

        <div className="filters-card">

          <div className="filters-title">
            Buscar Layout
          </div>


          <div className="filters-row">


            <div className="filter-group">

              <label>
                Nombre
              </label>

              <input
                type="text"
                placeholder="Nombre del layout"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

            </div>


            <div className="filter-group">

              <label>
                Banco
              </label>

              <select
                value={bancoId}
                onChange={(e) => setBancoId(e.target.value)}
              >

                <option value="">
                  Todos
                </option>

                {bancos.map(banco => (

                  <option
                    key={banco.id}
                    value={banco.id}
                  >
                    {banco.nombre}
                  </option>

                ))}

              </select>

            </div>


            <div className="filter-group">

              <label>
                Estatus
              </label>

              <select
                value={estatus}
                onChange={(e) => setEstatus(e.target.value)}
              >

                <option value="">
                  Todos
                </option>

                <option value="true">
                  Activo
                </option>

                <option value="false">
                  Inactivo
                </option>

              </select>

            </div>


            <button
              className="btn btn-primary"
              onClick={buscarLayouts}
            >
              Buscar
            </button>


            <button
              className="btn btn-secondary"
              onClick={limpiarFiltros}
            >
              Limpiar
            </button>


          </div>

        </div>


        {/* =========================
            BOTÓN CREAR
            ========================= */}

        <div className="actions-header">

          <button
            className="btn btn-success"
            onClick={abrirCrear}
          >
            + Crear Layout
          </button>

        </div>


        {/* =========================
            TABLA
            ========================= */}

        <div className="table-card">

          <table className="layout-table">

            <thead>

              <tr>

                <th>
                  Nombre
                </th>

                <th>
                  Banco
                </th>

                <th>
                  Estatus
                </th>

                <th>
                  Acciones
                </th>

              </tr>

            </thead>


            <tbody>

              {layouts.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    style={{
                      textAlign: 'center',
                      padding: '30px'
                    }}
                  >
                    No se encontraron layouts
                  </td>

                </tr>

              ) : (

                layouts.map(layout => (

                  <tr key={layout.id}>

                    <td>
                      {layout.name}
                    </td>

                    <td>
                      {layout.banco}
                    </td>

                    <td>

                      <span
                        className={
                          layout.estatus
                            ? 'status status-active'
                            : 'status status-inactive'
                        }
                      >

                        {layout.estatus
                          ? 'Activo'
                          : 'Inactivo'
                        }

                      </span>

                    </td>


                    <td>

                      <div className="table-actions">


                        <button
                          className="btn-small btn-view"
                          onClick={() => verLayout(layout.id)}
                        >
                          Ver
                        </button>


                        <button
                          className="btn-small btn-edit"
                          onClick={() => editarLayout(layout.id)}
                        >
                          Editar
                        </button>


                          <button
                            className="btn-small btn-copy"
                            onClick={() =>
                              abrirConfirmacionCopiar(layout)
                            }
                          >
                            Copiar
                          </button>


                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>


        {/* ==================================================
            MODAL CREAR
            ================================================== */}

        {mostrarCrear && (

          <div className="modal-overlay">

            <div className="modal">


              <div className="modal-header">

                <div>

                  <h2>
                    Crear Layout
                  </h2>

                  <p>
                    Registra un nuevo layout bancario
                  </p>

                </div>


                <button
                  className="modal-close"
                  onClick={cerrarCrear}
                >
                  ×
                </button>

              </div>


              <div className="modal-body">


                <div className="form-group">

                  <label>
                    Nombre
                  </label>

                  <input
                    type="text"
                    placeholder="Nombre del layout"
                    value={nombreCrear}
                    onChange={(e) =>
                      setNombreCrear(e.target.value)
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Banco
                  </label>

                  <select
                    value={bancoCrear}
                    onChange={(e) =>
                      setBancoCrear(e.target.value)
                    }
                  >

                    <option value="">
                      Selecciona un banco
                    </option>

                    {bancos.map(banco => (

                      <option
                        key={banco.id}
                        value={banco.id}
                      >
                        {banco.nombre}
                      </option>

                    ))}

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Estatus
                  </label>

                  <select
                    value={estatusCrear}
                    onChange={(e) =>
                      setEstatusCrear(
                        e.target.value === 'true'
                      )
                    }
                  >

                    <option value="true">
                      Activo
                    </option>

                    <option value="false">
                      Inactivo
                    </option>

                  </select>

                </div>


              </div>


              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={cerrarCrear}
                >
                  Cancelar
                </button>


                <button
                  className="btn btn-success"
                  onClick={crearLayout}
                >
                  Guardar
                </button>

              </div>


            </div>

          </div>

        )}


        {/* ==================================================
            MODAL DETALLE
            ================================================== */}

        {mostrarDetalle && layoutSeleccionado && (

          <div className="modal-overlay">

            <div className="modal">


              <div className="modal-header">

                <div>

                  <h2>
                    Detalle del Layout
                  </h2>

                  <p>
                    Información del layout bancario
                  </p>

                </div>


                <button
                  className="modal-close"
                  onClick={cerrarDetalle}
                >
                  ×
                </button>

              </div>


              <div className="modal-body">


                <div className="detail-row">

                  <span>
                    Nombre
                  </span>

                  <strong>
                    {layoutSeleccionado.name}
                  </strong>

                </div>


                <div className="detail-row">

                  <span>
                    Banco
                  </span>

                  <strong>
                    {layoutSeleccionado.banco}
                  </strong>

                </div>


                <div className="detail-row">

                  <span>
                    Estatus
                  </span>

                  <span
                    className={
                      layoutSeleccionado.estatus
                        ? 'status status-active'
                        : 'status status-inactive'
                    }
                  >

                    {layoutSeleccionado.estatus
                      ? 'Activo'
                      : 'Inactivo'
                    }

                  </span>

                </div>


              </div>


              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={cerrarDetalle}
                >
                  Cerrar
                </button>

              </div>


            </div>

          </div>

        )}


        {/* ==================================================
            MODAL EDITAR
            ================================================== */}

        {modoEdicion && layoutSeleccionado && (

          <div className="modal-overlay">

            <div className="modal">


              <div className="modal-header">

                <div>

                  <h2>
                    Editar Layout
                  </h2>

                  <p>
                    Modifica la información del layout
                  </p>

                </div>


                <button
                  className="modal-close"
                  onClick={cerrarEdicion}
                >
                  ×
                </button>

              </div>


              <div className="modal-body">


                <div className="form-group">

                  <label>
                    Nombre
                  </label>

                  <input
                    type="text"
                    value={nombreEditar}
                    onChange={(e) =>
                      setNombreEditar(e.target.value)
                    }
                  />

                </div>


                <div className="form-group">

                  <label>
                    Banco
                  </label>

                  <select
                    value={bancoEditar}
                    onChange={(e) =>
                      setBancoEditar(e.target.value)
                    }
                  >

                    <option value="">
                      Selecciona un banco
                    </option>

                    {bancos.map(banco => (

                      <option
                        key={banco.id}
                        value={banco.id}
                      >
                        {banco.nombre}
                      </option>

                    ))}

                  </select>

                </div>


                <div className="form-group">

                  <label>
                    Estatus
                  </label>

                  <select
                    value={estatusEditar}
                    onChange={(e) =>
                      setEstatusEditar(
                        e.target.value === 'true'
                      )
                    }
                  >

                    <option value="true">
                      Activo
                    </option>

                    <option value="false">
                      Inactivo
                    </option>

                  </select>

                </div>


              </div>


              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={cerrarEdicion}
                >
                  Cancelar
                </button>


                <button
                  className="btn btn-success"
                  onClick={guardarEdicion}
                >
                  Guardar cambios
                </button>

              </div>


            </div>

          </div>

        )}

      </div>


{layoutParaCopiar && (
  <div className="modal-overlay">

    <div className="modal">

      <div className="modal-header">

        <div>
          <h2>Copiar Layout</h2>

          <p>
            Confirmación de copia
          </p>
        </div>

        <button
          className="modal-close"
          onClick={cerrarConfirmacionCopiar}
          disabled={procesando}
        >
          ×
        </button>

      </div>

      <div className="modal-body">

        <p>
          ¿Estás seguro de que deseas copiar el layout?
        </p>

        <div
          style={{
            marginTop: '15px',
            padding: '15px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px'
          }}
        >
          <strong>
            {layoutParaCopiar.name}
          </strong>

          <div
            style={{
              marginTop: '5px',
              color: '#6b7280',
              fontSize: '14px'
            }}
          >
            Banco: {layoutParaCopiar.banco}
          </div>
        </div>

        <p
          style={{
            marginTop: '15px',
            color: '#6b7280',
            fontSize: '14px'
          }}
        >
          Se creará un nuevo registro con la misma información.
        </p>

      </div>

      <div className="modal-footer">

          <button
            className="btn btn-secondary"
            onClick={cerrarConfirmacionCopiar}
            disabled={procesando}
          >
            Cancelar
          </button>

        <button
          className="btn btn-success"
          onClick={() =>
            copiarLayout(layoutParaCopiar.id)
          }
          disabled={procesando}
        >
          {procesando ? 'Copiando...' : 'Copiar'}
        </button>

      </div>

    </div>

  </div>
)}

    </div>

  )
}

export default LayoutTable