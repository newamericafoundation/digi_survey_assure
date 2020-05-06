pragma solidity >=0.4.21 <0.6.0;

/**
 * @title Survey Mapping
 *
 * @dev Basic implementation of a mapping-styled smart contract to keep track of surveys against their outputed hash values.
 */
contract SurveyMapping {

    mapping(string => string) private surveys;

    event LogSurveyRegistered(string _surveyId, string _hash);

    /**
     * @dev Adds new hash value entry to survey ID mapping
     * @param _hash The hash output of the survey
     * @param _surveyId The survey ID
     *
     * A typical survey ID might be something like: SV_9soLp9xtDjAKP53
     */
    function RegisterSurvey(string memory _surveyId, string memory _hash) public {
        surveys[_surveyId] = _hash;
        emit LogSurveyRegistered(_surveyId, _hash);
    }

    /**
     * @dev Returns the hash value of a specific survey, by ID
     * @param _surveyId The survey ID
     */
    function ReturnHash(string memory _surveyId) public view returns (string memory _hash) {
        return surveys[_surveyId];
    }

}
