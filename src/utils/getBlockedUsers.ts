import { prisma } from "../config/providers";

export async function getBlockedUsers(userId: string): Promise<string[]> {
  const blockedUsers = await prisma.userBlocks.findMany({
    where: { blockerId: userId },
    select: { blockedId: true },
  });

  const blockerUsers = await prisma.userBlocks.findMany({
    where: { blockedId: userId },
    select: { blockerId: true },
  });

  const blockedUserIds = blockedUsers.map((block) => block.blockedId);
  const blockerUserIds = blockerUsers.map((block) => block.blockerId);

  return [...blockedUserIds, ...blockerUserIds];
}
