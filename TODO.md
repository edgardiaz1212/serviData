# Project Management UI Implementation TODO

## Backend Models
- [x] Add Project model to models.py with fields: name, edt_structure, num_phases, start_date, end_date, total_duration, status
- [x] Add Phase model to models.py with fields: project_id, name, order, start_date, end_date, duration
- [x] Add Activity model to models.py with fields: phase_id, description, duration, predecessors, planned_start, planned_end, planned_percent, real_compliance, real_percent, deviation, accumulated_deviation, status
- [x] Add relationships between models

## Backend API Routes
- [x] Add GET /api/projects to list all projects
- [x] Add POST /api/projects to create new project
- [x] Add GET /api/projects/<id> to get project details with phases and activities
- [x] Add PUT /api/projects/<id> to update project
- [x] Add DELETE /api/projects/<id> to delete project
- [x] Add PUT /api/projects/<id>/activities/<activity_id>/progress to update activity progress
- [x] Add calculations for planned %, real %, deviations in routes

## Frontend Components
- [x] Create src/front/js/component/project/ProjectCard.jsx for displaying project cards with status and phase
- [x] Create src/front/js/component/project/ProjectForm.jsx for creating/editing projects with EDT, phases, activities
- [x] Create src/front/js/component/project/ProjectProgressChart.jsx for S-curve chart comparing planned vs real progress

## Frontend Pages
- [x] Create src/front/js/pages/ProjectsPage.jsx to list projects using ProjectCard
- [x] Create src/front/js/pages/ProjectDetailPage.jsx to show project details, hierarchical EDT, activities, progress input, chart, indicators
- [x] Create src/front/js/pages/EditProjectPage.jsx for editing projects

## Routing
- [x] Update src/front/js/layout.js to add routes for /projects, /projects/:id, /projects/:id/edit

## Calculations and Indicators
- [ ] Implement automatic calculation of planned % for activities
- [ ] Implement real % calculation based on compliance
- [ ] Implement deviation and accumulated deviation
- [ ] Add traffic light indicators (green, yellow, red) based on deviation
- [ ] Add status display (En progreso – desviación baja, etc.)

## UI Enhancements
- [ ] Add table for points of attention (problem, impact, actions, dates, responsible)
- [ ] Add sections for achievements, next steps, deviation reasons
- [ ] Ensure hierarchical display of EDT -> Phases -> Activities

## Testing and Followup
- [ ] Run database migrations for new models
- [ ] Test API endpoints
- [ ] Test frontend functionality
- [ ] Verify calculations and charts
