const { spawn } = require("child_process");

const services = ["api-gateway", "auth-service", "inventory-service", "sales-service"];
const frontend = "frontend";

function runService(name, command, args) {
  console.log(`🚀 Iniciando ${name}...`);

  const child = spawn(command, args, {
    cwd: `./${name}`,
    shell: true,
  });

  child.stdout.on("data", data => {
    console.log(`[${name}] ${data}`);
  });

  child.stderr.on("data", data => {
    console.error(`[${name} ERROR] ${data}`);
  });
}

// Servicios backend con start:dev
services.forEach(service => runService(service, "npm", ["run", "start:dev"]));

// Frontend con dev
runService(frontend, "npm", ["run", "dev"]);