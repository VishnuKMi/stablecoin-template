//SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Stablecoin {
    string public constant name = "nUSD Stablecoin";
    string public constant symbol = "nUSD";

    AggregatorV3Interface private priceFeed;

    mapping(address => uint256) public balances;
    uint256 public totalSupply;

    event Deposit(
        address indexed account,
        uint256 ethAmount,
        uint256 nusdAmount
    );
    event Redeem(
        address indexed account,
        uint256 nusdAmount,
        uint256 ethAmount
    );

    event DebugVal(uint256 ethToUsd, uint256 ethAmount, uint256 nusdAmount);

    constructor() {
        priceFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        ); //(eth/usd in sepolia)
    }

    function deposit() external payable {
        require(msg.value > 0, "ETH amount must be greater than zero");

        uint256 ethToUsd = getEthToUsdPrice();
        uint256 nusdAmount = msg.value * (ethToUsd / 2);

        emit DebugVal(ethToUsd, msg.value, nusdAmount);

        balances[msg.sender] += nusdAmount;
        totalSupply += nusdAmount;

        emit Deposit(msg.sender, msg.value, nusdAmount);
    }

    function redeem(uint256 nusdAmount) external {
        require(nusdAmount > 0, "nUSD amount must be greater than zero");
        require(nusdAmount <= balances[msg.sender], "Insufficent balance");

        uint256 ethToUsd = getEthToUsdPrice();
        uint256 ethAmount = (nusdAmount * 2) / ethToUsd;

        balances[msg.sender] -= nusdAmount;
        totalSupply -= nusdAmount;

        payable(msg.sender).transfer(ethAmount);

        emit Redeem(msg.sender, nusdAmount, ethAmount);
    }

    function getEthToUsdPrice() public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        require(price > 0, "Invalid price feed");
        return uint256(price / (10 ** 8));
    }
}
