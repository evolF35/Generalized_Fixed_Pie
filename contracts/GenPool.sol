// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract useChainLink {
    AggregatorV3Interface public priceFeed;

    constructor(address _priceFeed) {
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    function getLatestPrice() public view returns (int){
        (,int price,,,) = priceFeed.latestRoundData();
        return(price/100000000);
    }
}

contract POS is ERC20, Ownable {
    constructor(string memory name) ERC20(name,"POS") {
    }

    function mint(uint256 amount) external onlyOwner {
        _mint(msg.sender,amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender,amount);
    }
}

contract NEG is ERC20, Ownable {
    constructor(string memory name) ERC20(name,"NEG") {
    }

    function mint(uint256 amount) external onlyOwner {
        _mint(msg.sender,amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender,amount);
    }
}


contract GenPool {

    uint256 settlementDate;
    int settlementPrice;
    bool condition;
    bool settled;

    function getSettlementDate() public view returns (uint256){
        return(settlementDate);
    }

    function getSettlementPrice() public view returns (int){
        return(settlementPrice);
    }

    function getCondition() public view returns (bool){
        return(condition);
    }

    function pastSettlementDate() public view returns (bool){
        return(block.timestamp > settlementDate);
    }

    function getLatestPrice() public view returns (int){
        return(oracle.getLatestPrice());
    }


    POS public positiveSide;
    NEG public negativeSide;

    useChainLink public oracle;

    constructor(address _oraclAddr,int _settlementPrice, uint256 _settlementDate) {
        settlementDate = _settlementDate;
        settlementPrice = _settlementPrice;

        positiveSide = new POS("OVER");
        negativeSide = new NEG("UNDER");
        oracle = new useChainLink(_oraclAddr);


        condition = false;
        settled = false;
    }

    function depositToPOS() public payable {
        require(block.timestamp < settlementDate);
        require(msg.value > 0.001 ether, "more capital");
        positiveSide.mint(msg.value);
        positiveSide.transfer(msg.sender,msg.value);
    }

    function depositToNEG() public payable {
        require(block.timestamp < settlementDate);
        require(msg.value > 0.001 ether, "more capital");
        negativeSide.mint(msg.value);
        negativeSide.transfer(msg.sender,msg.value);

    }

    function settle() public {
        require(block.timestamp > settlementDate, "too early");
        int256 price = oracle.getLatestPrice();

        if(price >= settlementPrice){
            condition = true;
        }

        settled = true;
    }

    function withdrawWithPOS() public { 
        require(block.timestamp > settlementDate, "too early");
        require(settled == true, "not settled");
        require(condition == true,"condition not satisfied");
        require(positiveSide.balanceOf(msg.sender) > 0, "you have nothing");

        uint256 saved = (positiveSide.balanceOf(msg.sender) / positiveSide.totalSupply()) * (address(this).balance);
        
        positiveSide.transferFrom(msg.sender,address(this),positiveSide.balanceOf(msg.sender));

        (payable(msg.sender)).transfer(saved);
    }

    function withdrawWithNEG() public {
        require(block.timestamp > settlementDate, "too early");
        require(settled == true, "not settled");
        require(condition == false,"condition not satisfied");
        require(negativeSide.balanceOf(msg.sender) > 0, "you have nothing");

        uint256 saved = (negativeSide.balanceOf(msg.sender) / negativeSide.totalSupply()) * (address(this).balance);
        
        negativeSide.transferFrom(msg.sender,address(this),negativeSide.balanceOf(msg.sender));

        (payable(msg.sender)).transfer(saved);
    }
}

