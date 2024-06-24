export interface User {
  rank: number;
  name: string;
  // role: string;
  // team: string;
  status: string;
  // age: string;
  avatar: string;
  email: string;
  xp: number;
}

export interface Column {
  name: string;
  uid: keyof User | "actions";
}

export const columns: Column[] = [
  { name: "RANK", uid: "rank" },
  { name: "NAME", uid: "name" },
  // { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },
  { name: "TOTAL XP", uid: "xp" },
];

export const users: User[] = [];

/* export const users: User[] = [
  {
    rank: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
    xp: 1200,
  },
  {
    rank: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
    xp: 1100,
  },
  {
    rank: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
    xp: 1050,
  },
  {
    rank: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
    xp: 950,
  },
  {
    rank: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
    xp: 900,
  },
];
 */
