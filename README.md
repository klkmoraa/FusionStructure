# FusionStructure

FusionStructure is an offline-first structural analysis workspace for learning, modeling, reviewing and documenting 2D and spatial structures.

It combines the strongest production capabilities from StructureCo and Copia-web into one focused application:

- 2D and Space 3D structural modeling with interactive editing.
- Analysis results, model diagnostics, stability studies, bill of materials and revision comparison.
- Import, export, sharing and recovery for portable project files.
- Local command assistance and an optional local ReportLab service for technical PDF enrichment.
- Spanish and English interface support, progressive web app shell and local-only project storage.

## Start

```bash
npm install
npm run dev
```

Use `npm run build` to generate the deployable static application. `npm run check` runs the compact quality gate when it is useful.

## Optional PDF companion

For enhanced vector PDF appendices, install the Python requirements and run:

```bash
python -m pip install -r requirements-reportlab.txt
npm run pdf:reportlab-service
```

The web app remains fully usable without this local companion.
