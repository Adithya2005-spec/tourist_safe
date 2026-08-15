const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TouristSafetyAudit Contract", function () {
  let auditContract;
  let owner;
  let authority;

  beforeEach(async function () {
    [owner, authority] = await ethers.getSigners();
    const TouristSafetyAudit = await ethers.getContractFactory("TouristSafetyAudit");
    auditContract = await TouristSafetyAudit.deploy();
    await auditContract.waitForDeployment();
  });

  it("Should register a new incident hash without storing personal data", async function () {
    const incidentId = "INC-1024";
    // Mock SHA-256 hash of incident payload
    const incidentHash = ethers.keccak256(ethers.toUtf8Bytes("CANONICAL_INCIDENT_PAYLOAD_INC_1024"));

    const tx = await auditContract.registerIncident(incidentId, incidentHash);
    await tx.wait();

    const record = await auditContract.getIncident(incidentId);
    expect(record.id).to.equal(incidentId);
    expect(record.incidentHash).to.equal(incidentHash);
    expect(record.currentStatus).to.equal("NEW");
    expect(record.exists).to.be.true;
  });

  it("Should update incident lifecycle status and log status history", async function () {
    const incidentId = "INC-2048";
    const incidentHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD_2048"));

    await auditContract.registerIncident(incidentId, incidentHash);

    // Update status: VERIFIED
    await auditContract.updateIncidentStatus(incidentId, "VERIFIED");
    let record = await auditContract.getIncident(incidentId);
    expect(record.currentStatus).to.equal("VERIFIED");

    // Update status: ASSIGNED
    await auditContract.updateIncidentStatus(incidentId, "ASSIGNED");
    // Update status: RESPONDING
    await auditContract.updateIncidentStatus(incidentId, "RESPONDING");
    // Update status: RESOLVED
    await auditContract.updateIncidentStatus(incidentId, "RESOLVED");

    record = await auditContract.getIncident(incidentId);
    expect(record.currentStatus).to.equal("RESOLVED");

    const history = await auditContract.getIncidentHistory(incidentId);
    expect(history.length).to.equal(5); // NEW, VERIFIED, ASSIGNED, RESPONDING, RESOLVED
    expect(history[0].status).to.equal("NEW");
    expect(history[4].status).to.equal("RESOLVED");
  });

  it("Should reject registering duplicate incident ID", async function () {
    const incidentId = "INC-3000";
    const incidentHash = ethers.keccak256(ethers.toUtf8Bytes("PAYLOAD_3000"));

    await auditContract.registerIncident(incidentId, incidentHash);
    await expect(
      auditContract.registerIncident(incidentId, incidentHash)
    ).to.be.revertedWith("Incident already registered");
  });
});
