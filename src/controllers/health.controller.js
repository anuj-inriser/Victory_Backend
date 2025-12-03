const getHealth = (req, res) => {
  res.json({ status: 'ok', version: 'v2' });
};

module.exports = { getHealth }
