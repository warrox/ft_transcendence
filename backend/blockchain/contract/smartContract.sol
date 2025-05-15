// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScorePong {

    struct GameScore {
        uint256 id;
        string date;
        bool won;
        string guest_name;
    }

    mapping(uint256 => GameScore) public scores;
    uint256 public scoreCount;

    event GetTournamentScores(uint id, string date, bool won, string guest_name);

    function putScore(string memory _date, bool _won, string memory _guest_name) public {
        scoreCount++;
        scores[scoreCount] = GameScore(scoreCount, _date, _won, _guest_name);
    }

    function getScore(uint256 _id) public view returns (GameScore memory) {
        require(_id > 0 && _id <= scoreCount, "Score ID invalide");
        return scores[_id];
    }
}
