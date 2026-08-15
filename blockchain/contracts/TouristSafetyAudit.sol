// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TouristSafetyAudit
 * @dev Smart India Hackathon (SIH260483) Smart Tourist Safety Audit Trail Contract
 * 
 * Implements tamper-proof audit trail for safety incident lifecycles.
 * PRIVACY GUARANTEE: NEVER stores tourist personal information, GPS histories,
 * names, or credentials on-chain. Only stores canonical incident hashes and status events.
 */
contract TouristSafetyAudit {
    address public immutable owner;

    struct IncidentRecord {
        string incidentId;
        bytes32 incidentHash;
        string currentStatus;
        uint256 createdAt;
        uint256 updatedAt;
        bool exists;
    }

    struct StatusTransition {
        string status;
        uint256 timestamp;
        address updatedBy;
    }

    // Mapping from incidentId string to IncidentRecord
    mapping(string => IncidentRecord) private incidents;

    // Mapping from incidentId string to array of status transitions
    mapping(string => StatusTransition[]) private statusHistories;

    // List of registered incident IDs
    string[] private incidentIds;

    // Events
    event IncidentRegistered(
        string indexed incidentId,
        bytes32 incidentHash,
        uint256 timestamp,
        address registeredBy
    );

    event IncidentStatusUpdated(
        string indexed incidentId,
        string newStatus,
        uint256 timestamp,
        address updatedBy
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can invoke");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Registers a new canonical incident hash into the audit ledger.
     * @param incidentId Unique incident identifier (e.g., 'INC-1024')
     * @param incidentHash Cryptographic SHA-256 / Keccak-256 hash of incident payload
     */
    function registerIncident(
        string calldata incidentId,
        bytes32 incidentHash
    ) external {
        require(bytes(incidentId).length > 0, "Incident ID cannot be empty");
        require(incidentHash != bytes32(0), "Incident hash cannot be zero");
        require(!incidents[incidentId].exists, "Incident already registered");

        incidents[incidentId] = IncidentRecord({
            incidentId: incidentId,
            incidentHash: incidentHash,
            currentStatus: "NEW",
            createdAt: block.timestamp,
            updatedAt: block.timestamp,
            exists: true
        });

        statusHistories[incidentId].push(StatusTransition({
            status: "NEW",
            timestamp: block.timestamp,
            updatedBy: msg.sender
        }));

        incidentIds.push(incidentId);

        emit IncidentRegistered(incidentId, incidentHash, block.timestamp, msg.sender);
    }

    /**
     * @notice Updates the state of an incident in the audit ledger.
     * @param incidentId Unique incident identifier
     * @param status New lifecycle status (e.g. 'VERIFIED', 'ASSIGNED', 'RESPONDING', 'RESOLVED')
     */
    function updateIncidentStatus(
        string calldata incidentId,
        string calldata status
    ) external {
        require(incidents[incidentId].exists, "Incident does not exist");
        require(bytes(status).length > 0, "Status cannot be empty");

        IncidentRecord storage record = incidents[incidentId];
        record.currentStatus = status;
        record.updatedAt = block.timestamp;

        statusHistories[incidentId].push(StatusTransition({
            status: status,
            timestamp: block.timestamp,
            updatedBy: msg.sender
        }));

        emit IncidentStatusUpdated(incidentId, status, block.timestamp, msg.sender);
    }

    /**
     * @notice Retrieves verified incident audit details.
     * @param incidentId Unique incident identifier
     */
    function getIncident(string calldata incidentId)
        external
        view
        returns (
            string memory id,
            bytes32 incidentHash,
            string memory currentStatus,
            uint256 createdAt,
            uint256 updatedAt,
            bool exists
        )
    {
        IncidentRecord memory record = incidents[incidentId];
        require(record.exists, "Incident does not exist");
        return (
            record.incidentId,
            record.incidentHash,
            record.currentStatus,
            record.createdAt,
            record.updatedAt,
            record.exists
        );
    }

    /**
     * @notice Retrieves the chronological status transition history for an incident.
     */
    function getIncidentHistory(string calldata incidentId)
        external
        view
        returns (StatusTransition[] memory)
    {
        require(incidents[incidentId].exists, "Incident does not exist");
        return statusHistories[incidentId];
    }

    /**
     * @notice Returns total count of registered incidents.
     */
    function getTotalIncidentsCount() external view returns (uint256) {
        return incidentIds.length;
    }
}
