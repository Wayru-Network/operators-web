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
import { useCustomerSubscription } from "@/lib/contexts/customer-subscription-context";
import {
  addHotspotToSubscription,
  removeHotspotToSubscription,
} from "@/app/[lang]/(operator)/settings/_services/hotspots-service";
import { useSubscriptionHotspots } from "@/lib/hooks/use-hotspots";

export default function AssignPlanHotspots() {
  const { hotspots, addHotspot } = useBilling();
  const { subscription } = useCustomerSubscription();
  const [filteredHotspots, setFilteredHotspots] = useState(hotspots);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const {
    hotspots: assignedHotspots,
    refresh: refreshHotspotsAssigned,
    isLoading: isGettingHotspotAssigned,
  } = useSubscriptionHotspots();
  const stripeSub = subscription?.stripe_subscription;
  const hotspotLimitToAdd = stripeSub?.products_amount ?? 0;
  const hotspotLimitReached = hotspotLimitToAdd <= assignedHotspots?.length;
  const [isUpdatingSubscription, startUpdatingSubscription] = useTransition();
  const [inputValue, setInputValue] = useState("");
  const isInputDisabled =
    hotspotLimitReached || isUpdatingSubscription || isSearching;

  const removeDuplicatedHotspots = (items: Hotspot[]) => {
    const seenIds = new Set<number>();
    return items.filter((item) => {
      if (seenIds.has(item.id)) {
        return false; // Remove duplicate
      }
      seenIds.add(item.id);
      return true; // Keep first occurrence
    });
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
      setFilteredHotspots(removeDuplicatedHotspots(localResults));
    } else {
      const url = `/api/hotspots?page=${1}&limit=${50}&q=${query}`;
      const response = await fetch(url);
      const { data } = (await response.json()) as { data: Hotspot[] };
      const deletedDuplicates = removeDuplicatedHotspots([
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
          subscription?.id as number
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
    <div className="flex flex-col max-w-96">
      <p className="text-base font-semibold w-full align-left">
        Assign plan to hotspots
      </p>
      <Tooltip
        isDisabled={!hotspotLimitReached}
        content={"Update your plan if you want to add more hotspots"}
      >
        <div
          className={`flex flex-row w-full justify-start mt-3 ${
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
            className="w-[300px]"
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
            {removeDuplicatedHotspots(filteredHotspots).map((hotspot) => (
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

      <AssignedHotspotsList
        hotspots={assignedHotspots}
        onRemoveHotspot={onRemoveHotspot}
      />
    </div>
  );
}
