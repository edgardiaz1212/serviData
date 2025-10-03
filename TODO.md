# TODO List for Project Compliance Fix

## Problem
When new activities or phases are added to a project, the planned percentages recalculate, causing the displayed compliance percentages to change even though the actual work completed hasn't changed. This happens because compliance was stored as a contribution to the project total, which shifts when planning changes.

## Solution
Change compliance to be stored as the percentage completed of the activity (0-100%), independent of planning. Calculate the project contribution based on current planning.

## Tasks
- [ ] Update backend `update_activity_progress` in `routes.py` to accept `real_percent` instead of `real_compliance`
- [ ] Modify `calculate_planned_percentages` to recalculate `real_compliance` based on `real_percent` after planning changes
- [ ] Update frontend `flux.js` action `updateProjectActivityCompliance` to send `real_percent`
- [x] Update `ProjectDetailPage.jsx` to use `real_percent` for input, with max 100
- [x] Update model comments in `models.py` for clarity
- [ ] Test by adding new activities and verifying compliance percentages remain stable
