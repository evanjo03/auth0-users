var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
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
];
const OrderByOptions = ["desc", "asc"];
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const client = yield getManagementClient();
    try {
        const user = yield client.getUser({ id });
        res.json(user);
    }
    catch (error) {
        res.json(error);
    }
}));
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getManagementClient();
    const filter = extractQueryParamValue(req, "filter");
    const sortBy = extractQueryParamValue(req, "sortby");
    const orderBy = extractQueryParamValue(req, "orderby");
    let users = yield client.getUsers();
    users = getFilteredUsers(users, filter);
    users = getSortedUsers(users, sortBy, orderBy);
    res.json(users);
}));
function getFilteredUsers(users, filter) {
    if (!filter) {
        return users;
    }
    const filteredUsersByName = users.filter((user) => { var _a; return (_a = user.name) === null || _a === void 0 ? void 0 : _a.includes(filter); });
    const filteredUsersByEmail = users.filter((user) => { var _a; return (_a = user.email) === null || _a === void 0 ? void 0 : _a.includes(filter); });
    const filteredUsersByUsername = users.filter((user) => { var _a; return (_a = user.username) === null || _a === void 0 ? void 0 : _a.includes(filter); });
    const unionUsers = [
        ...filteredUsersByName,
        ...filteredUsersByEmail,
        ...filteredUsersByUsername,
    ];
    const uniqueUsers = [];
    for (let i = 0; i < unionUsers.length; i++) {
        if (!uniqueUsers.some((user) => user.user_id === unionUsers[i].user_id)) {
            uniqueUsers.push(unionUsers[i]);
        }
    }
    return uniqueUsers;
}
function getSortedUsers(users, sortBy, orderBy) {
    if (!sortBy ||
        !orderBy ||
        !SortableFields.includes(sortBy) ||
        !OrderByOptions.includes(orderBy)) {
        return users;
    }
    const sortableUsers = [...users];
    sortableUsers.sort((a, b) => {
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
function extractQueryParamValue(req, name) {
    var _a, _b, _c;
    const value = typeof ((_a = req.query) === null || _a === void 0 ? void 0 : _a[name]) === "string"
        ? (_c = (_b = req.query) === null || _b === void 0 ? void 0 : _b[name]) === null || _c === void 0 ? void 0 : _c.toLowerCase()
        : "";
    return value;
}
export default router;
