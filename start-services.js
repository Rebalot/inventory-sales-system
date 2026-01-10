const { spawn } = require("child_process");

const services = ["api-gateway", "auth-service", "inventory-service", "sales-service"];
const frontend = "frontend";

function runService(name, command, args) {
  console.log(`🚀 Iniciando ${name}...`);
  const child = spawn(command, args, {
    cwd: `./${name}`,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", code => {
    console.log(`❌ ${name} terminó con código ${code}`);
  });
}

// Servicios backend con start:dev
services.forEach(service => runService(service, "npm", ["run", "start:dev"]));

// Frontend con dev
runService(frontend, "npm", ["run", "dev"]);