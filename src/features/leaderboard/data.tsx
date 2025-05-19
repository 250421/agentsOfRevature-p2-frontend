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
    cell: ({ row, table }) => {
      const rank =
        table
          .getRowModel()
          .rows.findIndex((sortedRow) => sortedRow.id === row.id) + 1;
      return <div className="text-center font-semibold text-amber-300">{rank}</div>;
    },
  }),
  columnHelper.accessor("username", { enableSorting: false }),
  columnHelper.accessor("prestige", {
    cell: ({ row }) => (
      <div className="text-right font-semibold text-sky-300">{row.original.prestige}</div>
    ),
  }),
  columnHelper.accessor("missionsCompleted", {
    header: "Missions",
    cell: ({ row }) => (
      <div className="text-right">{row.original.missionsCompleted}</div>
    ),
  }),
];

export const data: User[] = [
  { username: "AgentAlpha", prestige: 567, missionsCompleted: 120 },
  { username: "ShadowStriker", prestige: 715, missionsCompleted: 155 },
  { username: "CyberWraith", prestige: 319, missionsCompleted: 80 },
  { username: "NightHawk", prestige: 678, missionsCompleted: 130 },
  { username: "ViperX", prestige: 429, missionsCompleted: 95 },
  { username: "RoguePhantom", prestige: 888, missionsCompleted: 180 },
  { username: "SilentReaper", prestige: 201, missionsCompleted: 60 },
  { username: "BlazeInferno", prestige: 585, missionsCompleted: 110 },
  { username: "ArcticFox", prestige: 734, missionsCompleted: 140 },
  { username: "SteelGuardian", prestige: 337, missionsCompleted: 75 },
];
