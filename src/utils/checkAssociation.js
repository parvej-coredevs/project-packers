export default async function (table, query) {
  try {
    const data = await table.findOne(query);
    console.log("data", data);
    if (data !== null || undefined) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}
