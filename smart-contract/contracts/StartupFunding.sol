// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StartupFunding {
    struct Campaign {
        address payable owner;
        string name;
        string description;
        uint goal;
        uint amountRaised;
    }

    Campaign[] public campaigns;

    function createCampaign(string memory _name, string memory _description, uint _goal) public {
        Campaign memory newCampaign = Campaign(payable(msg.sender), _name, _description, _goal, 0);
        campaigns.push(newCampaign);
    }

    function donateToCampaign(uint _index) public payable {
        Campaign storage campaign = campaigns[_index];
        require(msg.value > 0, "Donation must be greater than 0");
        campaign.owner.transfer(msg.value);
        campaign.amountRaised += msg.value;
    }

    function getAllCampaigns() public view returns (Campaign[] memory) {
        return campaigns;
    }
}
 