const fs = require('fs');

// Lue JSON-tiedosto
try {
  const data = JSON.parse(fs.readFileSync('report.json', 'utf8'));
  const violations = data.violations;

  // Suodata WCAG A/AA -tason virheet, jotka eivät vaadi manuaalista tarkistusta
  const wcagViolations = violations.filter(v =>
    v.tags &&
    (
      v.tags.includes("wcag2a") ||
      v.tags.includes("wcag2aa") ||
      v.tags.includes("wcag21a") ||
      v.tags.includes("wcag21aa") ||
      v.tags.includes("wcag22a") ||
      v.tags.includes("wcag22aa")
    ) &&
    !v.tags.includes("review") // Poistetaan manuaalista tarkistusta vaativat
  );

  if (!wcagViolations || wcagViolations.length === 0) {
    console.log("✅ Ei automaattisesti tunnistettavia WCAG A/AA -tason saavutettavuusvirheitä löytynyt.");
  } else {
    console.log(`🔍 Löytyi ${wcagViolations.length} automaattisesti tunnistettavaa WCAG A/AA -tason virhettä (versiot 2.0–2.2):\n`);

    wcagViolations.forEach((violation, index) => {
      console.log(`🎴 ${index + 1}. ${violation.id}`);
      console.log(`   Vakavuus: ${violation.impact}`);
      console.log(`   Kuvaus: ${violation.description}`);
      console.log(`   Ohje: ${violation.help}`);
      console.log(`   Elementtejä: ${violation.nodes.length}`);
      console.log('---');
    });
  }
} catch (error) {
  console.error("❌ Virhe JSON-tiedoston lukemisessa:", error.message);
}

