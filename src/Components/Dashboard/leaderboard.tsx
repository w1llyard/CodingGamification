import React, { Key, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  ChipProps,
} from "@nextui-org/react";
import { columns, User as UserType } from "./data";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig/firebase";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

const sortAndRankUsers = (users: UserType[]): UserType[] => {
  return users
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
};

export default function Leaderboard() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const fetchedUsers: UserType[] = [];
      querySnapshot.forEach((doc) => {
        fetchedUsers.push(doc.data() as UserType);
      });
      setUsers(sortAndRankUsers(fetchedUsers));
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const renderCell = React.useCallback((user: UserType, columnKey: Key) => {
    const cellValue = user[columnKey as keyof UserType];

    switch (columnKey) {
      case "rank":
        return <p className="text-bold text-sm">{cellValue}</p>;
      case "name":
        return (
          <User
            avatarProps={{ radius: "lg", src: user.avatar }}
            description={user.email}
            name={cellValue as string}
          >
            {user.email}
          </User>
        );
      /*   case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
            <p className="text-bold text-sm capitalize text-default-400">
              {user.team}
            </p>
          </div>
        ); */
      case "status":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[user.status]}
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "xp":
        return <p className="text-bold text-sm">{cellValue}</p>;
      default:
        return cellValue;
    }
  }, []);

  if (loading) {
    return (
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{<div className="skeleton h-5 w-6"></div>}</TableCell>
            <TableCell>
              {
                <div className="flex gap-2 items-center">
                  <div className="skeleton w-14 h-14 rounded-full shrink-0"></div>
                  <div className="flex flex-col gap-2">
                    <div className="skeleton h-4 w-28"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>
              }
            </TableCell>
            <TableCell>{<div className="skeleton h-6 w-20"></div>}</TableCell>
            <TableCell>{<div className="skeleton h-5 w-14"></div>}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.email}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
