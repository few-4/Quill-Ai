import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPkgPath = path.resolve(__dirname, "../Frontend/package.json");
const backendDistPath = path.resolve(__dirname, "./public");
const backendDistIndexPath = path.resolve(backendDistPath, "index.html");

console.log("[Build] Smart Build Orchestrator starting...");

if (fs.existsSync(frontendPkgPath)) {
    console.log("[Build] Local Frontend directory detected at:", path.dirname(frontendPkgPath));
    try {
        console.log("[Build] Running 'npm install' for Frontend...");
        execSync("npm install --prefix ../Frontend", { stdio: "inherit" });

        console.log("[Build] Running 'npm run build' for Frontend...");
        execSync("npm run build --prefix ../Frontend", { stdio: "inherit" });

        console.log("[Build] Copying compiled assets using copy-dist.js...");
        execSync("node copy-dist.js", { stdio: "inherit" });

        console.log("[Build] Local build and synchronization complete!");
    } catch (error) {
        console.error("[Build] Local build failed:", error);
        process.exit(1);
    }
} else {
    console.log("[Build] Local Frontend directory not found (likely production/Render).");
    try {
        console.log("[Build] Running 'npm install' in backend directory to ensure all production dependencies are present...");
        execSync("npm install --legacy-peer-deps", { stdio: "inherit" });
    } catch (error) {
        console.error("[Build] Failed to install backend dependencies:", error);
        process.exit(1);
    }
    
    console.log("[Build] Checking for pre-built static assets in Backend/public...");
    
    if (fs.existsSync(backendDistIndexPath)) {
        console.log("[Build] Valid pre-built static assets found at Backend/public.");
        console.log("[Build] Skipping compilation. Production build ready to serve!");
    } else {
        console.error("[Build] Error: No pre-built static assets found at Backend/public, and Frontend source is missing.");
        console.error("[Build] Please run 'npm run build' locally first to compile Frontend and copy it to Backend/public, then commit and push.");
        process.exit(1);
    }
}
