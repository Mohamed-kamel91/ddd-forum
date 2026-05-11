import { database } from '../../../../backend/src/shared/bootstrap';

async function resetDatabase() {
  const dbConnection = database.getConnection();

  const deleteAllVotes = dbConnection.vote.deleteMany();
  const deleteAllComments = dbConnection.comment.deleteMany();
  const deleteAllPosts = dbConnection.post.deleteMany();
  const deleteAllMembers = dbConnection.member.deleteMany();
  const deleteAllUsers = dbConnection.user.deleteMany();

  try {
    await dbConnection.$transaction([
      deleteAllVotes,
      deleteAllComments,
      deleteAllPosts,
      deleteAllMembers,
      deleteAllUsers,
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await database.disconnect();
  }
}

export { resetDatabase };
