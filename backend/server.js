const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/analyze', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL puuttuu' });

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Lataa axe-core sivulle
    const axePath = require.resolve('axe-core');
    const axeSource = fs.readFileSync(axePath, 'utf8');
    await page.evaluate(axeSource);

    // Aja saavutettavuusanalyysi
    const results = await page.evaluate(async () => {
      return await axe.run();
    });

    await browser.close();

    // Muodosta yksinkertaistettu virhelista
    const simplified = results.violations
    .filter(v => v.tags.includes("wcag2a") || v.tags.includes("wcag2aa")) // vain WCAG A & AA
    .filter(v => v.nodes.length > 0) // poistaa virheet jotka eivät kohdistu mihinkään elementtiin (yleensä needs review)
    .map(v => ({
      id: v.id,
      title: v.help,
      description: v.description
    }));


    res.json(simplified);
  } catch (error) {
    console.error('Virhe analysoinnissa:', error);
    res.status(500).json({ error: 'Analysointi epäonnistui' });
  }
});

app.listen(PORT, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
