
/* ============================
 * Mock Data
 * ============================ */

import { User } from "../models/user";

export const mockUsers: User[] = [
  {
    id: "USR-001",
    firstName: "Ahmed",
    lastName: "Ben Ali",
    email: "ahmed.benali@example.com",
    phoneNumber: "12345689",
    roles: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date("2026-01-15"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-002",
    firstName: "Sarra",
    lastName: "Trabelsi",
    email: "sarra.trabelsi@example.com",
    phoneNumber: "",
    roles: "MANAGER",
    status: "ACTIVE",
    createdAt: new Date("2026-02-10"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-003",
    firstName: "Mohamed",
    lastName: "Jaziri",
    email: "m.jaziri@example.com",
    phoneNumber: "",
    roles: "ACCOUNTANT",
    status: "INACTIVE",
    createdAt: new Date("2025-12-01"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-004",
    firstName: "Leila",
    lastName: "Hamdi",
    email: "leila.hamdi@example.com",
    phoneNumber: "",
    roles: "USER",
    status: "ACTIVE",
    createdAt: new Date("2026-03-21"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-005",
    firstName: "Youssef",
    lastName: "Mansouri",
    email: "youssef.mansouri@example.com",
    phoneNumber: "",
    roles: "USER",
    status: "BLOCKED",
    createdAt: new Date("2025-11-18"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-006",
    firstName: "Nour",
    lastName: "Chaabane",
    email: "nour.chaabane@example.com",
    phoneNumber: "",
    roles: "MANAGER",
    status: "ACTIVE",
    createdAt: new Date("2026-04-02"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-007",
    firstName: "Walid",
    lastName: "Kefi",
    email: "walid.kefi@example.com",
    phoneNumber: "",
    roles: "ACCOUNTANT",
    status: "ACTIVE",
    createdAt: new Date("2026-02-28"),
    enabled: false,
    username: ""
  },
  {
    id: "USR-008",
    firstName: "Amira",
    lastName: "Ben Salem",
    email: "amira.bensalem@example.com",
    phoneNumber: "",
    roles: "USER",
    status: "INACTIVE",
    createdAt: new Date("2025-10-14"),
    enabled: false,
    username: ""
  },
];