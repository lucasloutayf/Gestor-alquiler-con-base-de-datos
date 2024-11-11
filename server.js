const express = require('express');
const cors = require('cors');
const { all, run } = require('./database');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Get all tenants for a property
app.get('/api/properties/:propertyId/tenants', async (req, res) => {
  try {
    const tenants = await all(
      'SELECT * FROM tenants WHERE property_id = ?',
      [req.params.propertyId]
    );
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new tenant
app.post('/api/tenants', async (req, res) => {
  try {
    const result = await run(`
      INSERT INTO tenants (
        property_id, nombre, apellido, dni, telefono, 
        telefonoConocido, precioPieza, estadoPago, fechaRecibo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.body.property_id,
      req.body.nombre,
      req.body.apellido,
      req.body.dni,
      req.body.telefono,
      req.body.telefonoConocido,
      req.body.precioPieza,
      req.body.estadoPago,
      req.body.fechaRecibo
    ]);
    
    res.json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update tenant
app.put('/api/tenants/:id', async (req, res) => {
  try {
    await run(`
      UPDATE tenants 
      SET nombre = ?, apellido = ?, dni = ?, telefono = ?,
          telefonoConocido = ?, precioPieza = ?, estadoPago = ?, fechaRecibo = ?
      WHERE id = ?
    `, [
      req.body.nombre,
      req.body.apellido,
      req.body.dni,
      req.body.telefono,
      req.body.telefonoConocido,
      req.body.precioPieza,
      req.body.estadoPago,
      req.body.fechaRecibo,
      req.params.id
    ]);
    
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});