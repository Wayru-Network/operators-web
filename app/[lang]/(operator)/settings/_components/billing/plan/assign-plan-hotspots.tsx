import {
  Autocomplete,
  AutocompleteItem,
  Spinner,
  Tooltip,
} from "@heroui/react";
import { ChevronDown, Router, Search } from "lucide-react";
import React, { useState, useRef, useTransition } from "react";
import { useBilling } from "../../../contexts/BillingContext";
import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import AssignedHotspotsList from "./assigned-hotspots-list";
import {
  addHotspotToSubscription,
  removeHotspotToSubscription,
} from "@/app/[lang]/(operator)/settings/_services/hotspots-service";
import { useSubscriptionHotspots } from "@/lib/hooks/use-hotspots";
import { isMinimumVersionMet } from "@/lib/helpers/operators";

export default function AssignPlanHotspots() {
  // STRIPE REMOVAL
  const { hotspots, addHotspot } = useBilling();
  const [filteredHotspots, setFilteredHotspots] = useState(hotspots);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const {
    hotspots: assignedHotspots,
    refresh: refreshHotspotsAssigned,
    isLoading: isGettingHotspotAssigned,
  } = useSubscriptionHotspots();
  const hotspotLimitToAdd = 1;
  const hotspotLimitReached = hotspotLimitToAdd <= assignedHotspots?.length;
  const [isUpdatingSubscription, startUpdatingSubscription] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const isInputDisabled =
    hotspotLimitReached || isUpdatingSubscription || isSearching;

  const filterHotspotsList = (items: Hotspot[]) => {
    const seenIds = new Set<number>();
    const hotspotsNotDuplicates = items.filter((item) => {
      if (seenIds.has(item.id)) {
        return false; // Remove duplicate
      }
      seenIds.add(item.id);
      return true; // Keep first occurrence
    });
    return hotspotsNotDuplicates.filter((item) =>
      isMinimumVersionMet(item.os_services_version ?? "")
    );
  };

  // Hook for API search
  const fetchQuery = async (query: string) => {
    // First, try to filter local hotspots
    setIsSearching(true);
    const localResults = hotspots.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    // Check if local results already exist in filtered hotspots
    const existingLocalResults = localResults.filter((item) =>
      filteredHotspots.some((filtered) => filtered.id === item.id)
    );

    if (localResults.length > 0 && existingLocalResults.length === 0) {
      // Only set local results if they don't already exist in filtered list
      setFilteredHotspots(filterHotspotsList(localResults));
    } else {
      const url = `/api/hotspots?page=${1}&limit=${50}&q=${query}`;
      let response: Response | undefined;
      try {
        response = await fetch(url);
      } catch (error) {
        console.error("Error fetching hotspots:", error);
        setIsSearching(false);
        setIsSearchInProgress(false);
        return;
      }
      if (!response) {
        setIsSearching(false);
        setIsSearchInProgress(false);
        return;
      }
      const { data } = (await response.json()) as { data: Hotspot[] };
      const deletedDuplicates = filterHotspotsList([
        ...data,
        ...filteredHotspots,
      ]);
      if (deletedDuplicates.length > 0) {
        setFilteredHotspots(deletedDuplicates);
        addHotspot(data);
      }
    }
    setIsSearching(false);
    setIsSearchInProgress(false);
  };

  const onChangeInput = (txt: string) => {
    setInputValue(txt);
    setIsSearchInProgress(true);
    // clear debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      // call onDebounceTime after debounceTime
      if (txt.length > 0) {
        fetchQuery(txt);
      } else {
        setFilteredHotspots(hotspots);
      }
      // add debounceTime to props in milliseconds
    }, 1000);
  };

  const handleOnSelectHotspot = (id: number) => {
    // Clear the input after selection
    startUpdatingSubscription(async () => {
      setInputValue("");
      const hotspotsFiltered = filteredHotspots.find((h) => h.id === id);
      if (hotspotsFiltered) {
        await addHotspotToSubscription(
          hotspotsFiltered?.wayru_device_id,
          8 as number
        );
        await refreshHotspotsAssigned();
        const newFiltered = filteredHotspots.filter?.((i) => i.id !== id);
        setFilteredHotspots(newFiltered);
      }
    });
  };

  const onRemoveHotspot = async (id: string) => {
    startUpdatingSubscription(async () => {
      await removeHotspotToSubscription(id);
      await refreshHotspotsAssigned();
    });
  };

  return (
    <div className="flex flex-col md:w-full lg:w-1/2 md:mt-1">
      <p className="text-base font-semibold w-full">Assign plan to hotspots</p>
      <p className="text-xs mt-0.5">
        Only hotspots with the minimum required version will be displayed
      </p>
      <Tooltip
        isDisabled={!hotspotLimitReached}
        content={"Update your plan if you want to add more hotspots"}
      >
        <div
          className={`flex flex-row w-full justify-start mt-4 ${
            hotspotLimitReached || isUpdatingSubscription
              ? "cursor-not-allowed"
              : ""
          }`}
        >
          <Autocomplete
            variant="bordered"
            size="sm"
            placeholder={`Search Hotspot`}
            id="search-hotspots-input"
            className="md:w-full lg:w-[400px]"
            startContent={<Search size={16} />}
            endContent={isSearching && <Spinner size="sm" />}
            selectorIcon={
              isUpdatingSubscription || isGettingHotspotAssigned ? (
                <Spinner size="sm" />
              ) : (
                <ChevronDown size={18} />
              )
            }
            selectorButtonProps={{
              className: "text-color",
            }}
            onSelectionChange={(id) => handleOnSelectHotspot(Number(id))}
            aria-labelledby="Search hotspots"
            isClearable={false}
            onValueChange={(v) => onChangeInput(v)}
            inputValue={inputValue}
            //menuTrigger="manual"
            isDisabled={isInputDisabled}
            listboxProps={{
              emptyContent: isSearchInProgress
                ? "Searching..."
                : "No hotspots found",
            }}
          >
            {filterHotspotsList(filteredHotspots).map((hotspot) => (
              <AutocompleteItem
                key={hotspot.id}
                startContent={<Router size={12} />}
              >
                {hotspot.name}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
      </Tooltip>
      <div className="w-full flex flex-row">
        <AssignedHotspotsList
          hotspots={assignedHotspots}
          onRemoveHotspot={onRemoveHotspot}
        />
      </div>
    </div>
  );
}
