import { createColumnHelper } from "@tanstack/react-table";

export type User = {
  username: string;
  prestige: number;
  missionsCompleted: number;
};

const columnHelper = createColumnHelper<User>();

export const leaderboardColumns = [
  columnHelper.display({
    id: "rank",
    header: "Rank",
    cell: ({ row, table }) =>
      table
        .getRowModel()
        .rows.findIndex((sortedRow) => sortedRow.id === row.id) + 1,
  }),
  columnHelper.accessor("username", { enableSorting: false }),
  columnHelper.accessor("prestige", { enableSorting: true }),
  columnHelper.accessor("missionsCompleted", { enableSorting: true }),
];

export const data: User[] = [
  { username: "AgentAlpha", prestige: 5, missionsCompleted: 120 },
  { username: "ShadowStriker", prestige: 7, missionsCompleted: 155 },
  { username: "CyberWraith", prestige: 3, missionsCompleted: 80 },
  { username: "NightHawk", prestige: 6, missionsCompleted: 130 },
  { username: "ViperX", prestige: 4, missionsCompleted: 95 },
  { username: "RoguePhantom", prestige: 8, missionsCompleted: 180 },
  { username: "SilentReaper", prestige: 2, missionsCompleted: 60 },
  { username: "BlazeInferno", prestige: 5, missionsCompleted: 110 },
  { username: "ArcticFox", prestige: 7, missionsCompleted: 140 },
  { username: "SteelGuardian", prestige: 3, missionsCompleted: 75 },
];
