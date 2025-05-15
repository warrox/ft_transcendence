// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScorePong {
    struct GameScore {
        uint256 id;
        string date;
        bool won;
        string guest_name;
    }

    mapping(uint256 => GameScore[]) public userScores; // mapping userId => array de scores
    uint256 public scoreCount;

    event ScoreAdded(uint256 indexed userId, uint256 scoreId, string date, bool won, string guest_name);

    function putScore(
        uint256 userId,
        string memory _date,
        bool _won,
        string memory _guest_name
    ) public {
        scoreCount++;
        GameScore memory score = GameScore(scoreCount, _date, _won, _guest_name);
        userScores[userId].push(score);
        emit ScoreAdded(userId, scoreCount, _date, _won, _guest_name);
    }

    function getUserScores(uint256 userId) public view returns (GameScore[] memory) {
        return userScores[userId];
    }
}
