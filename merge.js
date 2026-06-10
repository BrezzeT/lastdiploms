// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

const outputFile = path.join(__dirname, "all_code.txt");
const directoriesToScan = ["./app", "./components", "./src"];
const extensions = [".ts", ".tsx", ".js", ".jsx", ".css"];

fs.writeFileSync(outputFile, "=== ALL PROJECT CODE ===\n\n");

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".next") {
        scanDir(fullPath);
      }
    } else if (extensions.includes(path.extname(file))) {
      const content = fs.readFileSync(fullPath, "utf8");
      fs.appendFileSync(
        outputFile,
        `\n\n/* ==========================================\n   FILE: ${fullPath}\n   ========================================== */\n\n${content}`,
      );
    }
  }
}

directoriesToScan.forEach(scanDir);
console.log("Готово! Весь код собран в файл all_code.txt");
