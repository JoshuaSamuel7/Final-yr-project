const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const StartupFunding = await hre.ethers.getContractFactory("StartupFunding");
  const startupFunding = await StartupFunding.deploy();
  await startupFunding.waitForDeployment();
  const deployedAddress = startupFunding.target ?? startupFunding.address ?? (startupFunding.getAddress ? await startupFunding.getAddress() : undefined);
  
  console.log("✅ Contract deployed at:", deployedAddress);
  
  // Write address to file for frontend to read
  const configPath = path.join(__dirname, "../contract-address.json");
  fs.writeFileSync(configPath, JSON.stringify({ address: deployedAddress, network: hre.network.name }, null, 2));
  console.log("✅ Address saved to contract-address.json");
  
  // Also create a .env file for the frontend
  const clientEnvPath = path.join(__dirname, "../../client/.env.local");
  const envContent = `VITE_CONTRACT_ADDRESS=${deployedAddress}\nVITE_USE_LOCAL_SIGNER=true\nVITE_LOCAL_RPC=http://127.0.0.1:8545\nVITE_SIMULATE_STATE=false\n`;
  fs.writeFileSync(clientEnvPath, envContent);
  console.log("✅ Frontend .env.local updated");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
