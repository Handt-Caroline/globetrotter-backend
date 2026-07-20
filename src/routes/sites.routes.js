const express = require('express');
const { readDB } = require('../db');

const router = express.Router();

// GET /sites - list all sites (optionally filter by category or region)
router.get('/', (req, res) => {
  const db = readDB();
  let sites = db.sites;

  const { category, region } = req.query;
  if (category) {
    sites = sites.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
  if (region) {
    sites = sites.filter(s => s.region.toLowerCase() === region.toLowerCase());
  }

  res.json(sites);
});

// GET /sites/:id - get one site by id
router.get('/:id', (req, res) => {
  const db = readDB();
  const site = db.sites.find(s => s.id === req.params.id);
  if (!site) {
    return res.status(404).json({ error: 'Site not found' });
  }
  res.json(site);
});

module.exports = router;