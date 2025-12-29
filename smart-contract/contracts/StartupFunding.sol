// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StartupFunding {
    // Role enumeration
    enum Role { NONE, INVESTOR, FOUNDER, ADMIN }
    
    // Campaign structure with enhanced fields
    struct Campaign {
        address payable owner;
        string name;
        string description;
        uint goal;
        uint amountRaised;
        bool active;
        uint createdAt;
        uint[] milestones;
        string[] milestoneDescriptions;
    }

    // User roles mapping
    mapping(address => Role) public userRoles;
    
    // Campaign storage
    Campaign[] public campaigns;
    
    // Donations tracking
    mapping(uint => mapping(address => uint)) public donations;
    
    // Events for logging
    event CampaignCreated(uint indexed campaignId, address indexed creator, string name, uint goal);
    event DonationReceived(uint indexed campaignId, address indexed donor, uint amount);
    event MilestoneReached(uint indexed campaignId, uint milestoneIndex);
    event RoleAssigned(address indexed user, Role role);

    // Modifiers for access control
    modifier onlyFounder(address _user) {
        require(userRoles[_user] == Role.FOUNDER || userRoles[_user] == Role.ADMIN, "Only founders can perform this action");
        _;
    }

    modifier onlyInvestor(address _user) {
        require(userRoles[_user] == Role.INVESTOR || userRoles[_user] == Role.ADMIN, "Only investors can perform this action");
        _;
    }

    modifier onlyAdmin(address _user) {
        require(userRoles[_user] == Role.ADMIN, "Only admins can perform this action");
        _;
    }

    modifier campaignExists(uint _index) {
        require(_index < campaigns.length, "Campaign does not exist");
        _;
    }

    modifier campaignActive(uint _index) {
        require(campaigns[_index].active, "Campaign is not active");
        _;
    }

    modifier onlyCampaignOwner(uint _index) {
        require(msg.sender == campaigns[_index].owner, "Only campaign owner can perform this action");
        _;
    }

    // Constructor: Set deployer as admin
    constructor() {
        userRoles[msg.sender] = Role.ADMIN;
        emit RoleAssigned(msg.sender, Role.ADMIN);
    }

    // RBAC Functions
    function assignRole(address _user, uint8 _role) public onlyAdmin(msg.sender) {
        require(_role >= 1 && _role <= 3, "Invalid role");
        Role role = Role(_role);
        userRoles[_user] = role;
        emit RoleAssigned(_user, role);
    }

    function getRole(address _user) public view returns (Role) {
        return userRoles[_user];
    }

    function getRoleString(address _user) public view returns (string memory) {
        Role role = userRoles[_user];
        if (role == Role.ADMIN) return "ADMIN";
        if (role == Role.FOUNDER) return "FOUNDER";
        if (role == Role.INVESTOR) return "INVESTOR";
        return "NONE";
    }

    // Campaign Management Functions
    function createCampaign(
        string memory _name,
        string memory _description,
        uint _goal,
        uint[] memory _milestones
    ) public onlyFounder(msg.sender) {
        require(_goal > 0, "Goal must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_milestones.length > 0, "At least one milestone is required");

        Campaign memory newCampaign = Campaign({
            owner: payable(msg.sender),
            name: _name,
            description: _description,
            goal: _goal,
            amountRaised: 0,
            active: true,
            createdAt: block.timestamp,
            milestones: _milestones,
            milestoneDescriptions: new string[](_milestones.length)
        });

        campaigns.push(newCampaign);
        emit CampaignCreated(campaigns.length - 1, msg.sender, _name, _goal);
    }

    // Simplified campaign creation (backward compatible)
    function createCampaign(
        string memory _name,
        string memory _description,
        uint _goal
    ) public onlyFounder(msg.sender) {
        require(_goal > 0, "Goal must be greater than 0");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

        Campaign memory newCampaign = Campaign({
            owner: payable(msg.sender),
            name: _name,
            description: _description,
            goal: _goal,
            amountRaised: 0,
            active: true,
            createdAt: block.timestamp,
            milestones: new uint[](0),
            milestoneDescriptions: new string[](0)
        });

        campaigns.push(newCampaign);
        emit CampaignCreated(campaigns.length - 1, msg.sender, _name, _goal);
    }

    // Donate to campaign
    function donateToCampaign(uint _index) public payable onlyInvestor(msg.sender) campaignExists(_index) campaignActive(_index) {
        require(msg.value > 0, "Donation must be greater than 0");
        
        Campaign storage campaign = campaigns[_index];
        
        // Transfer funds to campaign owner
        campaign.owner.transfer(msg.value);
        
        // Update campaign state
        campaign.amountRaised += msg.value;
        
        // Track donation
        donations[_index][msg.sender] += msg.value;
        
        emit DonationReceived(_index, msg.sender, msg.value);

        // Check if milestone reached
        checkMilestones(_index);
    }

    // Check if any milestones are reached
    function checkMilestones(uint _index) internal {
        Campaign storage campaign = campaigns[_index];
        
        if (campaign.milestones.length == 0) return;
        
        for (uint i = 0; i < campaign.milestones.length; i++) {
            if (campaign.amountRaised >= campaign.milestones[i]) {
                emit MilestoneReached(_index, i);
            }
        }
    }

    // Get donor contribution
    function getDonation(uint _index, address _donor) public view returns (uint) {
        return donations[_index][_donor];
    }

    // Get all campaigns
    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }

    // Get campaign by index
    function getCampaign(uint _index) public view campaignExists(_index) returns (Campaign memory) {
        return campaigns[_index];
    }

    // Get campaign count
    function getCampaignCount() public view returns (uint) {
        return campaigns.length;
    }

    // Campaign owner functions
    function updateCampaignStatus(uint _index, bool _active) public onlyCampaignOwner(_index) campaignExists(_index) {
        campaigns[_index].active = _active;
    }

    function withdrawFunds(uint _index) public onlyCampaignOwner(_index) campaignExists(_index) {
        Campaign storage campaign = campaigns[_index];
        uint amount = campaign.amountRaised;
        require(amount > 0, "No funds to withdraw");
        
        campaign.amountRaised = 0;
        campaign.owner.transfer(amount);
    }

    // Admin functions
    function deactivateCampaign(uint _index) public onlyAdmin(msg.sender) campaignExists(_index) {
        campaigns[_index].active = false;
    }

    function reactivateCampaign(uint _index) public onlyAdmin(msg.sender) campaignExists(_index) {
        campaigns[_index].active = true;
    }

    // Fallback function to accept donations directly
    receive() external payable {
        // Accept direct ETH transfers
    }

    // Emergency withdraw (admin only)
    function emergencyWithdraw() public onlyAdmin(msg.sender) {
        payable(msg.sender).transfer(address(this).balance);
    }

    // Get contract balance
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
}
 