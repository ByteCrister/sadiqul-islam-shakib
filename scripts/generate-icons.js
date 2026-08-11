const fs = require("fs");
const path = require("path");

function getExportedKeys(modulePath) {
  try {
    const mod = require(modulePath);
    return Object.keys(mod).filter(
      (key) => key !== "default" && typeof mod[key] === "function" || typeof mod[key] === "object"
    );
  } catch (err) {
    console.error(`Failed to load ${modulePath}`, err.message);
    return [];
  }
}

async function main() {
  console.log("Generating icon index...");

  const lucideKeys = getExportedKeys("lucide-react").filter(
    (key) => key !== "createLucideIcon" && key !== "Icon" && key !== "LucideIcon"
  );

  const reactIconsPacks = [
    "react-icons/si",
    "react-icons/fa",
    "react-icons/fi",
    "react-icons/tb",
    "react-icons/md"
  ];

  const reactIconsKeys = [];
  for (const pack of reactIconsPacks) {
    const keys = getExportedKeys(pack);
    reactIconsKeys.push(...keys);
  }

  const output = {
    lucide: lucideKeys,
    "react-icons": reactIconsKeys,
  };

  const outputDir = path.join(__dirname, "../src/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, "icons-list.json");
  fs.writeFileSync(outputPath, JSON.stringify(output), "utf8");

  console.log(`Successfully generated icons-list.json at ${outputPath}`);
  console.log(`Indexed ${lucideKeys.length} lucide icons and ${reactIconsKeys.length} react-icons.`);
}

main();
