import { createFileRoute } from "@tanstack/react-router";
import { GameChoiceContainer } from "@/features/game/components/GameChoiceContainer";
import { GameText } from "@/features/game/components/GameText";
import { useChoiceSelected } from "@/features/game/hooks/useChoiceSelected";
// import { useGetChapter } from "@/features/game/hooks/useGetChapter";
// import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(protected)/game/$chapterId")({
  component: RouteComponent,
});

const dummyChapterData = [
  // --- Chapter/Mission State 1 ---
  {
    id: "cz-771", // Matches the ID likely used in the route/query key
    title: "Incident #CZ-771: Digital Ghost - Mainframe Entry",
    text: "The Cyber Sentinels materialize inside the Neo-Kyoto Stock Exchange mainframe. Corrupted data streams flow like toxic rivers across virtual walls, punctuated by the GlitchMaster's digital cackle. Core system integrity is dropping fast (90%). Automated security drones, now under hostile control, patrol the data corridors ahead. Their targeting lasers sweep the area.",
    status: {
      round: 1,
      health: "100%", // Or use a number: 100
      morale: "Confident",
      customStats: {
        "System Integrity": "90%",
        "Glitch Level": "Moderate",
      }
    },
    choices: [
      { id: "0", text: "Use 'Technopath' to analyze drone patrol patterns and identify vulnerabilities.", hint: "Provides tactical advantage, but consumes time.", riskLevel: "low" },
      { id: "1", text: "Deploy 'Circuit's' localized EMP burst to temporarily disable nearby drones.", hint: "Clears immediate path. Risk of attracting attention. Uses EMP Charge (1/3).", riskLevel: "medium" },
      { id: "2", text: "Engage the drones head-on using 'Aegis's' shields and 'Bolt's' shots.", hint: "Fastest way to clear drones, but risks taking damage.", riskLevel: "high" },
      { id: "3", text: "Attempt to secure a nearby data node to slow the corruption spread.", hint: "May stabilize the system slightly, but leaves drones active.", riskLevel: "medium" },
    ],
  },

  // --- Chapter/Mission State 2 (Example result of choosing EMP Burst) ---
   {
    id: "cz-771", // Same mission ID, but next state/round
    title: "Incident #CZ-771: Digital Ghost - Drone Engagement",
    text: "Circuit's EMP ripples outwards, frying the sensors of two nearby drones which crash spectacularly into a data conduit. Alarms blare louder. GlitchMaster's laughter echoes, now tinged with annoyance. 'Insects! You merely delay the inevitable!' System integrity drops to 85%. More distant drones are converging on your position.",
    status: {
      round: 2,
      health: "95%", // Took minor feedback pulse damage
      morale: "Stable",
      customStats: {
        "System Integrity": "85%",
        "Glitch Level": "High",
        "Drones Disabled": "Partial (2)"
      }
    },
    choices: [
      { id: "0", text: "Press the advantage and push towards the mainframe core.", hint: "Risky, more drones incoming, but closer to the objective.", riskLevel: "high" },
      { id: "1", text: "Establish a defensive perimeter and deal with converging drones.", hint: "Safer short-term, buys time, but corruption spreads.", riskLevel: "medium" },
      { id: "2", text: "Have 'Technopath' try to trace GlitchMaster's signal while others defend.", hint: "Might reveal his location, but splits focus.", riskLevel: "medium" },
    ],
  },
];

function RouteComponent() {
  const { chapterId } = Route.useParams();

  // const { data: chapter, isLoading } = useGetChapter(chapterId);
  const chapter = dummyChapterData[0];
  const choiceSelected = useChoiceSelected();

  const handleChoiceSelect = (choiceId: string) => {
    choiceSelected.mutate({ chapterId, choiceId });
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <Loader2 className="animate-spin"/>
  //     </div>
  //   )
  // }

  return (
    <div>
      <h1>{chapter.title}</h1>
      <GameText gameText={chapter.text} />
      <GameChoiceContainer choices={chapter.choices} onChoiceSelect={handleChoiceSelect}/>
    </div>
  );
}
