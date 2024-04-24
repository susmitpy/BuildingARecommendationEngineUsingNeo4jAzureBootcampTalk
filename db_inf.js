const neo4j = require("neo4j-driver");

const getDriver = () => {
  const uri = process.env.DB_URI;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  const driver = neo4j.driver(uri, neo4j.auth.basic(user, password), {
    disableLosslessIntegers: true,
  });
  return driver;
};

const executeRead = async (query, params) => {
  const session = getDriver().session();
  let result = null;
  try {
    const readResult = await session.executeRead((tx) => tx.run(query, params));

    result = readResult.records;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }

  console.log("query result", result);
  return result;
};

const executeWrite = async (query, params) => {
  const session = getDriver().session();
  let result = null;
  try {
    const writeResult = await session.executeWrite((tx) =>
      tx.run(query, params),
    );
    console.log("writeResult", writeResult);
    result = writeResult.records;
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }

  console.log("query result", result);
  return result;
};

module.exports = {
  executeRead,
  executeWrite,
};
