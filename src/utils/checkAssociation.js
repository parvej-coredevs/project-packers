export default async function (db, table, key) {
  try {
    const data = await db.findOne({ table, key });
    if (data !== null || undefined) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error.message);
  }
}
