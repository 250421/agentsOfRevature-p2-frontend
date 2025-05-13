import { CalamityCard } from "./CalamityCard";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/shared/PaginationControls";
import type { Calamity } from "../models/calamity";
// import { useGetCalamities } from "../hooks/useGetCalamities";
// import { Loader2 } from "lucide-react";


const calamities: Calamity[] = [
  {
    id: 1,
    location: "Metropolis",
    severity: "critical",
    description:
      "Lex Luthor, utilizing a Kryptonite-powered exo-suit, has taken control of the Daily Planet globe, threatening to drop it unless Superman reveals his secret identity.",
  },
  {
    id: 2,
    location: "Gotham City",
    severity: "high",
    description:
      "The Joker has released his latest laughing gas variant in Arkham Asylum, causing a mass breakout of inmates who are now 'improving' city landmarks with chaotic graffiti.",
  },
  {
    id: 3,
    location: "Central City",
    severity: "medium",
    description:
      "Captain Cold and Heat Wave are having a territorial dispute, leading to unpredictable flash freezes and sudden heat bursts across several city blocks, confusing local weather patterns.",
  },
  {
    id: 4,
    location: "Star City",
    severity: "low",
    description:
      "The Trickster has replaced all the arrowheads in Oliver Queen's quiver with rubber chickens and confetti bombs, causing minor embarrassments during patrols.",
  },
  {
    id: 5,
    location: "Xavier's School for Gifted Youngsters (Westchester)",
    severity: "medium",
    description:
      "Sentinels, misidentifying a school science fair as a mutant power surge, have surrounded the grounds, demanding all 'unregistered technology' (aka baking soda volcanoes).",
  },
  {
    id: 6,
    location: "Themyscira",
    severity: "high",
    description:
      "Ares, God of War, is attempting to reignite an ancient Amazonian conflict by whispering discord among the warriors, causing sparring matches to escalate dangerously.",
  },
  {
    id: 7,
    location: "Atlantis",
    severity: "critical",
    description:
      "Black Manta has breached the outer domes with a squadron of Manta-subs, aiming to steal the Trident of Poseidon and flood the surface world's coastal cities.",
  },
  {
    id: 8,
    location: "Latveria",
    severity: "medium",
    description:
      "Doctor Doom has declared a national holiday celebrating himself, and all citizens are 'encouraged' by Doombots to participate in mandatory parades praising his genius.",
  },
  {
    id: 9,
    location: "Asgard",
    severity: "high",
    description:
      "Loki, in a fit of mischief, has transformed the Bifrost Bridge into a giant, slippery rainbow slide, stranding Thor and the Warriors Three mid-transit.",
  },
  {
    id: 10,
    location: "Wakanda",
    severity: "low",
    description:
      "M'Baku, after a 'friendly' challenge with T'Challa, has hidden all the Kimoyo Beads, causing minor communication inconveniences and forcing everyone to use outdated walkie-talkies.",
  },
  {
    id: 11,
    location: "Sanctum Sanctorum (New York)",
    severity: "critical",
    description:
      "Dormammu is attempting to breach the dimensional barriers, causing reality to warp around Greenwich Village; floating teacups and talking pigeons are just the beginning.",
  },
];
const ITEMS_PER_PAGE = 3;

export function CalamityContainer() {
  // const{ data: apiCalamities, isLoading } = useGetCalamities();

  const {
    displayedItems: displayedCalamities,
    ...paginationControlsProps
  } = usePagination<Calamity>({ itemsPerPage: ITEMS_PER_PAGE, allItems: calamities });

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <Loader2 className="animate-spin"/>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="flex justify-center items-center pt-4">
        <PaginationControls {...paginationControlsProps} />
        <div className="absolute right-10">
          {calamities.length ?? 0} active calamities
        </div>
      </div>

      <div className="pt-5 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {displayedCalamities.map((calamity: Calamity) => (
            <CalamityCard key={calamity.id} {...calamity} />
          ))}
        </div>
      </div>
    </>
  );
}
