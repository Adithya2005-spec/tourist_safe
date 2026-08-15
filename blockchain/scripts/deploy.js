const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying TouristSafetyAudit smart contract...");

  const TouristSafetyAudit = await hre.ethers.getContractFactory("TouristSafetyAudit");
  const contract = await TouristSafetyAudit.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log(`[SUCCESS] TouristSafetyAudit deployed to: ${contractAddress}`);

  // Save deployment artifact for backend consumption
  const deploymentInfo = {
    address: contractAddress,
    network: hre.network.name,
    deployedAt: new Date().toISOString(),
  };

  const outputDir = path.join(__dirname, "..", "deployed");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(outputDir, "contract-address.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`Contract details saved to: ${path.join(outputDir, "contract-address.json")}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
