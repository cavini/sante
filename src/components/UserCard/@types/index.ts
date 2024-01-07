import { type User } from "@prisma/client";

export interface UserCardProps {
  user: UserCard;
}

interface UserCard extends User {
  id: string;
}
