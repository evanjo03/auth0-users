import { User } from "auth0";
import express, { Request } from "express";
import { getManagementClient } from "../utils/index.js";
const router = express.Router();

const SortableFields = [
  "account_number",
  "birth_date",
  "created_at",
  "family_name",
  "given_name",
  "name",
  "nickname",
  "updated_at",
  "username",
  "last_login",
] as const;

const OrderByOptions = ["desc", "asc"] as const;

router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const client = await getManagementClient();
  try {
    const user = await client.getUser({ id });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

router.get("/users", async (req, res) => {
  const client = await getManagementClient();
  const filter = extractQueryParamValue(req, "filter");
  const sortBy = extractQueryParamValue(req, "sortby");
  const orderBy = extractQueryParamValue(req, "orderby");

  let users = await client.getUsers();
  users = getFilteredUsers(users, filter);
  users = getSortedUsers(users, sortBy, orderBy);

  res.json(users);
});

function getFilteredUsers(users: User[], filter: string): User[] {
  if (!filter) {
    return users;
  }

  const filteredUsersByName = users.filter((user) =>
    user.name?.includes(filter)
  );

  const filteredUsersByEmail = users.filter((user) =>
    user.email?.includes(filter)
  );

  const filteredUsersByUsername = users.filter((user) =>
    user.username?.includes(filter)
  );

  const unionUsers = [
    ...filteredUsersByName,
    ...filteredUsersByEmail,
    ...filteredUsersByUsername,
  ];

  const uniqueUsers: User[] = [];
  for (let i = 0; i < unionUsers.length; i++) {
    if (!uniqueUsers.some((user) => user.user_id === unionUsers[i].user_id)) {
      uniqueUsers.push(unionUsers[i]);
    }
  }

  return uniqueUsers;
}

function getSortedUsers(
  users: User[],
  sortBy: string,
  orderBy: string
): User[] {
  if (
    !sortBy ||
    !orderBy ||
    !SortableFields.includes(sortBy as any) ||
    !OrderByOptions.includes(orderBy as any)
  ) {
    return users;
  }

  const sortableUsers = [...users];
  sortableUsers.sort((a: any, b: any) => {
    if (a[sortBy] < b[sortBy]) {
      return orderBy === "desc" ? -1 : 1;
    }
    if (a[sortBy] > b[sortBy]) {
      return orderBy === "desc" ? 1 : -1;
    }
    return 0;
  });

  return sortableUsers;
}

type ExpressRequest = Request<{}, any, any, any, Record<string, any>>;

function extractQueryParamValue(req: ExpressRequest, name: string) {
  const value: string =
    typeof req.query?.[name] === "string"
      ? req.query?.[name]?.toLowerCase()
      : "";

  return value;
}

export default router;
