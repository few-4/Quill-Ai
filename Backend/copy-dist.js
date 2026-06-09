import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, "../Frontend/dist");
const destDir = path.resolve(__dirname, "./dist");

function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    if (fs.existsSync(srcDir)) {
        if (fs.existsSync(destDir)) {
            fs.rmSync(destDir, { recursive: true, force: true });
            console.log("Cleared existing dest dist directory in Backend.");
        }
        copyDir(srcDir, destDir);
        console.log("Successfully copied dist folder from Frontend to Backend!");
    } else {
        console.error("Source dist folder does not exist at:", srcDir);
        process.exit(1);
    }
} catch (err) {
    console.error("Error copying dist folder:", err);
    process.exit(1);
}
