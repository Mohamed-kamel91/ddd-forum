import { prisma } from '../../src/database';

async function resetDatabase() {
  const deleteAllVotes = prisma.vote.deleteMany();
  const deleteAllComments = prisma.comment.deleteMany();
  const deleteAllPosts = prisma.post.deleteMany();
  const deleteAllMembers = prisma.member.deleteMany();
  const deleteAllUsers = prisma.user.deleteMany();

  try {
    await prisma.$transaction([
      deleteAllVotes,
      deleteAllComments,
      deleteAllPosts,
      deleteAllMembers,
      deleteAllUsers,
    ]);
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

export { resetDatabase };
