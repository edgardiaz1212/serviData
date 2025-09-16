# TODO: Fix service type "Pública" to "Publica" in API responses

## Tasks
- [x] Modify Servicio.serialize() in models.py to transform "Pública" to "Publica" for tipo_servicio
- [x] Check and update direct returns of tipo_servicio in routes.py (e.g., get_new_services_current_month) - No changes needed
- [ ] Test the changes to ensure frontend receives "Publica" without accent
