import { CalamityCard } from "./CalamityCard";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/shared/PaginationControls";
import type { Calamity } from "../models/calamity";
import { Loader2 } from "lucide-react";


const ITEMS_PER_PAGE = 3;

interface CalamityContainerProps {
  calamities: Calamity[],
  isLoading: boolean,
}

export function CalamityContainer({ calamities, isLoading }: CalamityContainerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin"/>
      </div>
    )
  }

  const {
    displayedItems: displayedCalamities,
    ...paginationControlsProps
  } = usePagination<Calamity>({ itemsPerPage: ITEMS_PER_PAGE, allItems: calamities });

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
