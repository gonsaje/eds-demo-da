# EDS Demo — Document Authoring

An Adobe Experience Manager Edge Delivery Services demo that uses
[Document Authoring](https://da.live/) as its content source.

## Environments

- Authoring: https://da.live/#/gonsaje/eds-demo-da
- Preview: https://main--eds-demo-da--gonsaje.aem.page/
- Live: https://main--eds-demo-da--gonsaje.aem.live/

## Content source

Content is authored in DA and connected to this code repository through the
AEM Configuration Service. This repository intentionally does not contain an
`fstab.yaml`; that legacy file is not needed for a DA-backed project.

For a new or reset environment, open [DA Start](https://da.live/start), enter
`https://github.com/gonsaje/eds-demo-da`, and complete the project setup. The
AEM Code Sync GitHub App must have access to the repository.

## Documentation

Before using the AEM boilerplate, review the documentation on
https://www.aem.live/docs/ and, in particular:

1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

## Installation

```sh
npm i
```

## Linting

```sh
npm run lint
```

## Navigation authoring

Create a root-level DA document named `nav`:

1. Add the logo or site name first and link it to `/`. A linked
   image, linked text, or both are supported.
2. Add any number of links after the brand. Each link becomes a flat
   navigation item, whether it is authored in a list or as regular text.

A section break between the brand and links is optional; both one-section and
multi-section documents are supported. An image-only logo remains image-only
in the rendered header and uses its alt text as the accessible brand name.

Preview the `nav` document separately after changing it. If the document is
missing or incomplete, the header safely falls back to an `EDS Demo` home link.

## Teaser authoring

Use a `Teaser` block table with one teaser per row. Put the image in the first
cell and the teaser content in the second cell. Content can include an eyebrow,
a linked heading, description, tags, and date; omitted fields are supported.

Configure the block with an orientation and a column-count variant:

- `Teaser (horizontal, 1-up)` for full-width media/content rows.
- `Teaser (vertical, 2-up)`, `Teaser (vertical, 3-up)`, or
  `Teaser (vertical, 4-up)` for card grids.

Both orientations support `1-up` through `4-up`. Multi-column layouts collapse
to two columns on tablets and one column on phones.

## Local development

1. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`.
2. Start the local proxy with `aem up` (opens `http://localhost:3000`).
3. Edit content in [DA](https://da.live/#/gonsaje/eds-demo-da), then preview it
   from DA so the local proxy can load the corresponding page.
