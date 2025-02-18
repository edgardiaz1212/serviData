import React from 'react'

function ModalDocumentLoad() {
  return (
   <>
   <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#documentModal">
 Anexos
</button>


<div className="modal fade" id="documentModal" tabindex="-1" aria-labelledby="documentModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="documentModalLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        
      </div>
    </div>
  </div>
</div>
   </>
  )
}

export default ModalDocumentLoad