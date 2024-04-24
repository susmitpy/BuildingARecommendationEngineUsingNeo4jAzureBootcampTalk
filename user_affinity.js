const { executeRead, executeWrite } = require("./db_inf");

const createUserToUserAffinity = async (
  currUserId,
  otherUserId,
  affinityType,
) => {
  const query = `
    MATCH
        (user1:User {user_id: $currUserId}),
        (user2:User {user_id: $otherUserId})
    MERGE
        (user1)-
            [affinity:HAS_AFFINITY {
                type: $affinityType
            }]
        ->(user2)
    RETURN affinity
    `;

  const params = {
    currUserId: currUserId,
    otherUserId: otherUserId,
    affinityType: affinityType,
  };

  console.log("params", params);
  let result = await executeWrite(query, params);

  if (affinityType == "crush") {
    sendMutualCrushNotificationIfApplicable(currUserId, otherUserId);
  }
};

const sendMutualCrushNotificationIfApplicable = async (
  currUserId,
  otherUserId,
) => {
  let query = `
    MATCH
        (other:User {user_id: $otherUserId})-[affinity:HAS_AFFINITY {type: "crush"}]->(curr:User {user_id: $currUserId})
    RETURN affinity
    `;

  const params = {
    currUserId: currUserId,
    otherUserId: otherUserId,
  };

  let result = await executeRead(query, params);
  if (result != null && result.length > 0) {
    //TODO: send notification to both curr and other
    console.log("send mutual crush notification");
  }
};
