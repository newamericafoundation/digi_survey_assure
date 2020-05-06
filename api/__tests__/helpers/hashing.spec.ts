import { getMerkleRoot, md5Hex, merkleProof, sha256, sha256Hex } from '../../src/helper/hashing';

const validLeafQuestion = {
    "id": 92,
    "survey_response_id": 12,
    "question_id": 3,
    "question_option_id": 7
};

const invalidLeafQuestion = {
    "id": 92,
    "survey_response_id": 12,
    "question_id": 3,
    "question_option_id": 8
};

const inputQuestions = [
    {
        "id": 12,
        "survey_id": 2,
        "user_id": null,
        "location_id": null,
        "bc_transaction_id": 5,
        "external_source_id": "R_wWQEOPl3B1oNzGh",
        "confirmation_hash": "063217bbc2fc15db9b610a3ef50b5b6a",
        "raw_response": {
            "labels": {
                "QID1": "Male",
                "QID2": "Factory Executive",
                "QID3": "Probably yes",
                "QID4": "Definitely yes",
                "QID5": "No",
                "QID6": "Click to write Choice 4",
                "QID7": "No",
                "QID8": "Probably yes",
                "QID9": "Probably yes",
                "QID10": "Yes",
                "status": "IP Address",
                "QID1_DO": [
                    "Male",
                    "Female"
                ],
                "QID2_DO": [
                    "Floor Manager",
                    "Factory Worker",
                    "Factory Executive"
                ],
                "QID3_DO": [
                    "Definitely yes",
                    "Probably yes",
                    "Might or might not",
                    "Probably not",
                    "Definitely not"
                ],
                "QID4_DO": [
                    "Definitely yes",
                    "Probably yes",
                    "Might or might not",
                    "Probably not",
                    "Definitely not"
                ],
                "QID5_DO": [
                    "Yes",
                    "No",
                    "I share one with my family"
                ],
                "QID6_DO": [
                    "Paid per hour",
                    "Paid per piece",
                    "Not Applicable",
                    "Click to write Choice 4"
                ],
                "QID7_DO": [
                    "Yes",
                    "No",
                    "Sometimes"
                ],
                "QID8_DO": [
                    "Definitely yes",
                    "Probably yes",
                    "Might or might not",
                    "Probably not",
                    "Definitely not"
                ],
                "QID9_DO": [
                    "Definitely yes",
                    "Probably yes",
                    "Might or might not",
                    "Probably not",
                    "Definitely not"
                ],
                "QID10_DO": [
                    "Yes",
                    "No"
                ],
                "finished": "True"
            },
            "values": {
                "QID1": 1,
                "QID2": 3,
                "QID3": 2,
                "QID4": 1,
                "QID5": 2,
                "QID6": 4,
                "QID7": 2,
                "QID8": 2,
                "QID9": 2,
                "QID10": 1,
                "status": 0,
                "QID1_DO": [
                    "1",
                    "2"
                ],
                "QID2_DO": [
                    "1",
                    "2",
                    "3"
                ],
                "QID3_DO": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "QID4_DO": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "QID5_DO": [
                    "1",
                    "2",
                    "3"
                ],
                "QID6_DO": [
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                "QID7_DO": [
                    "1",
                    "2",
                    "3"
                ],
                "QID8_DO": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "QID9_DO": [
                    "1",
                    "2",
                    "3",
                    "4",
                    "5"
                ],
                "endDate": "2019-10-21T22:01:54Z",
                "QID10_DO": [
                    "1",
                    "2"
                ],
                "duration": 7,
                "finished": 1,
                "progress": 100,
                "ipAddress": "70.23.97.254",
                "startDate": "2019-10-21T22:01:46Z",
                "recordedDate": "2019-10-21T22:01:55.198Z",
                "userLanguage": "EN",
                "locationLatitude": "40.6464996338",
                "locationLongitude": "-73.9412002563",
                "distributionChannel": "anonymous"
            },
            "responseId": "R_wWQEOPl3B1oNzGh",
            "displayedFields": [
                "QID1",
                "QID3",
                "QID2",
                "QID9",
                "QID8",
                "QID5",
                "QID10",
                "QID4",
                "QID7",
                "QID6"
            ],
            "displayedValues": {
                "QID1": [
                    1,
                    2
                ],
                "QID2": [
                    1,
                    2,
                    3
                ],
                "QID3": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "QID4": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "QID5": [
                    1,
                    2,
                    3
                ],
                "QID6": [
                    1,
                    2,
                    4
                ],
                "QID7": [
                    1,
                    2,
                    3
                ],
                "QID8": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "QID9": [
                    1,
                    2,
                    3,
                    4,
                    5
                ],
                "QID10": [
                    1,
                    2
                ]
            }
        },
        "created_at": "2019-10-29T19:24:51.196Z",
        "updated_at": "2019-10-29T19:24:51.196Z",
        "recorded_at": "2019-10-22T02:01:54.000Z"
    },
    {
        "id": 91,
        "survey_response_id": 12,
        "question_id": 1,
        "question_option_id": 1
    },
    validLeafQuestion,
    {
        "id": 93,
        "survey_response_id": 12,
        "question_id": 2,
        "question_option_id": 5
    },
    {
        "id": 94,
        "survey_response_id": 12,
        "question_id": 9,
        "question_option_id": 32
    },
    {
        "id": 95,
        "survey_response_id": 12,
        "question_id": 8,
        "question_option_id": 27
    },
    {
        "id": 96,
        "survey_response_id": 12,
        "question_id": 5,
        "question_option_id": 17
    },
    {
        "id": 97,
        "survey_response_id": 12,
        "question_id": 10,
        "question_option_id": 36
    },
    {
        "id": 98,
        "survey_response_id": 12,
        "question_id": 4,
        "question_option_id": 11
    },
    {
        "id": 99,
        "survey_response_id": 12,
        "question_id": 7,
        "question_option_id": 24
    },
    {
        "id": 100,
        "survey_response_id": 12,
        "question_id": 6,
        "question_option_id": 22
    }
];

const expectedMerkleRoot = '14b4558ede445003f17974a2089db33f9d918a8a076b1a1e07958dc79ad5dc66';

describe('hashing Helper', () => {
    test('It should generate a correct SHA256 base64 hash', async () => {
        const sha256Hash = sha256('Test123');

        expect(sha256Hash).toBe('2bX1jws4GYKTlxhloUB09Z66PoJZW+y+hq5R8dnx9l4=');
    });

    test('It should generate a correct SHA256 hex hash', async () => {
        const sha256Hash = sha256Hex('Test123');

        expect(sha256Hash).toBe('d9b5f58f0b38198293971865a14074f59eba3e82595becbe86ae51f1d9f1f65e');
    });

    test('It should generate a correct md5 hex hash', async () => {
        const hash = md5Hex('Test123');

        expect(hash).toBe('68eacb97d86f0c4621fa2b0e17cabd8c');
    });

    test('It should generate a correct merkle tree', async () => {
        const merkleRoot = getMerkleRoot(inputQuestions);

        expect(merkleRoot).toBe(expectedMerkleRoot);
    });

    test('It should return a positive proof for a valid individual question in a root', async () => {
        const proof = merkleProof(inputQuestions, expectedMerkleRoot, validLeafQuestion);

        expect(proof).toBeTruthy();;
    });

    test('It should return a positive proof for a valid individual question in a root', async () => {
        const proof = merkleProof(inputQuestions, expectedMerkleRoot, invalidLeafQuestion);

        expect(proof).toBeFalsy();;
    });
});
