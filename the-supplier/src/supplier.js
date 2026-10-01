const fs = require('fs');

// Supplier data lives on the server only (data/supplier.json or the SUPPLIER_JSON
// env var). It is never placed in /public and is only read when rendering a
// verified access page.
function loadSupplier(config) {
  const raw = config.supplierJson || fs.readFileSync(config.supplierDataPath, 'utf8');
  return normalize(JSON.parse(raw));
}

function loadExampleSupplier(config) {
  return normalize(JSON.parse(fs.readFileSync(config.examplePath, 'utf8')));
}

function normalize(data) {
  const list = (v) => (Array.isArray(v) ? v : []);
  return {
    name: String(data.name || ''),
    summary: String(data.summary || ''),
    contacts: list(data.contacts),
    links: list(data.links),
    categories: list(data.categories).map(String),
    ordering: list(data.ordering),
    reselling: list(data.reselling).map(String),
    notes: String(data.notes || ''),
  };
}

module.exports = { loadSupplier, loadExampleSupplier };
