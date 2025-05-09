import type { SeverityLevel } from "./SeverityBadge";
import { CalamityCard } from "./CalamityCard";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { StepBack, StepForward } from "lucide-react";

export interface Calamity {
  location: string;
  severity: SeverityLevel;
  description: string;
}

const calamities: Calamity[] = [
  {
    location: "Metropolis",
    severity: "critical",
    description:
      "Lex Luthor, utilizing a Kryptonite-powered exo-suit, has taken control of the Daily Planet globe, threatening to drop it unless Superman reveals his secret identity.",
  },
  {
    location: "Gotham City",
    severity: "high",
    description:
      "The Joker has released his latest laughing gas variant in Arkham Asylum, causing a mass breakout of inmates who are now 'improving' city landmarks with chaotic graffiti.",
  },
  {
    location: "Central City",
    severity: "medium",
    description:
      "Captain Cold and Heat Wave are having a territorial dispute, leading to unpredictable flash freezes and sudden heat bursts across several city blocks, confusing local weather patterns.",
  },
  {
    location: "Star City",
    severity: "low",
    description:
      "The Trickster has replaced all the arrowheads in Oliver Queen's quiver with rubber chickens and confetti bombs, causing minor embarrassments during patrols.",
  },
  {
    location: "Xavier's School for Gifted Youngsters (Westchester)",
    severity: "medium",
    description:
      "Sentinels, misidentifying a school science fair as a mutant power surge, have surrounded the grounds, demanding all 'unregistered technology' (aka baking soda volcanoes).",
  },
  {
    location: "Themyscira",
    severity: "high",
    description:
      "Ares, God of War, is attempting to reignite an ancient Amazonian conflict by whispering discord among the warriors, causing sparring matches to escalate dangerously.",
  },
  {
    location: "Atlantis",
    severity: "critical",
    description:
      "Black Manta has breached the outer domes with a squadron of Manta-subs, aiming to steal the Trident of Poseidon and flood the surface world's coastal cities.",
  },
  {
    location: "Latveria",
    severity: "medium",
    description:
      "Doctor Doom has declared a national holiday celebrating himself, and all citizens are 'encouraged' by Doombots to participate in mandatory parades praising his genius.",
  },
  {
    location: "Asgard",
    severity: "high",
    description:
      "Loki, in a fit of mischief, has transformed the Bifrost Bridge into a giant, slippery rainbow slide, stranding Thor and the Warriors Three mid-transit.",
  },
  {
    location: "Wakanda",
    severity: "low",
    description:
      "M'Baku, after a 'friendly' challenge with T'Challa, has hidden all the Kimoyo Beads, causing minor communication inconveniences and forcing everyone to use outdated walkie-talkies.",
  },
  {
    location: "Sanctum Sanctorum (New York)",
    severity: "critical",
    description:
      "Dormammu is attempting to breach the dimensional barriers, causing reality to warp around Greenwich Village; floating teacups and talking pigeons are just the beginning.",
  },
];

export function CalamityContainer() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(calamities.length / 3);
  const displayedCalamities = useMemo(() => {
    const start = currentPage * 3;
    const end = start + 3;
    return calamities.slice(start, end);
  }, [currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(Math.max(currentPage - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(currentPage + 1, totalPages - 1));
  };

  return (
    <>
      <div className="text-right pt-5 pr-10">
        {calamities.length} active calamities
      </div>

      <div className="flex justify-center items-center">
        <Button variant="outline" onClick={handlePrevPage} disabled={currentPage === 0}>
          <StepBack />
        </Button>
        <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages - 1}>
          <StepForward />
        </Button>
      </div>

      <div className="pt-5 px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedCalamities.map((calamity: Calamity) => (
            <CalamityCard key={calamity.location} {...calamity} />
          ))}
        </div>
      </div>
    </>
  );
}
