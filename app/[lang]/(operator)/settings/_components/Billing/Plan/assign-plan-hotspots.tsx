import { Autocomplete, AutocompleteItem, Spinner } from "@heroui/react";
import { Router, Search } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { useBilling } from "../../../contexts/BillingContext";
import { Hotspot } from "@/app/[lang]/(operator)/hotspots/_services/get-hotspots";
import PlanTable from "./plan-table";

export default function AssignPlanHotspots() {
  const { hotspots, addHotspot } = useBilling();
  const [selectedHotspots, setSelectedHotspots] = useState<Hotspot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filteredHotspots, setFilteredHotspots] = useState(hotspots);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchInProgress, setIsSearchInProgress] = useState(false);

  // Hook for API search
  const fetchQuery = useCallback(
    async (query: string) => {
      const url = `/api/hotspots?page=${1}&limit=${50}&q=${query}`;
      const response = await fetch(url);
      const { data } = await response.json();
      setFilteredHotspots(data);
      addHotspot(data);
    },
    [addHotspot]
  );

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Effect to handle search logic
  useEffect(() => {
    if (debouncedQuery?.length > 0) {
      const execute = async () => {
        setIsSearching(true);

        // First, try to filter local hotspots
        const localResults = hotspots.filter((item) =>
          item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        if (localResults.length > 0) {
          setFilteredHotspots(localResults);
        } else {
          await fetchQuery(debouncedQuery);
        }
        setIsSearching(false);
        setIsSearchInProgress(false);
      };
      execute();
    } else {
      // Reset to show all local hotspots
      setFilteredHotspots(hotspots);
    }
  }, [debouncedQuery, hotspots, fetchQuery]);

  const handleOnSelectHotspot = (id: number) => {
    const hotspotsFiltered = hotspots.find((h) => h.id === id);
    if (hotspotsFiltered) {
      setSelectedHotspots((prev) => {
        return [hotspotsFiltered, ...prev];
      });
    }
  };

  const handleClear = () => {
    setFilteredHotspots(hotspots);
    setSearchQuery("");
  };

  const onRemoveHotspot = (id: number) => {
    const newHotspots = selectedHotspots.filter((i) => i.id !== id);
    setSelectedHotspots(newHotspots);
  };

  return (
    <div className="flex flex-col max-w-96">
      <p className="text-base font-semibold w-full align-left">
        Assign plan to hotspots
      </p>
      <div className="flex flex-row w-full justify-start mt-3">
        <Autocomplete
          variant="bordered"
          size="sm"
          placeholder={`Search Hotspot`}
          id="search-hotspots-input"
          className="w-[300px]"
          startContent={<Search size={16} />}
          endContent={isSearching && <Spinner size="sm" />}
          selectorButtonProps={{
            className: "text-color",
          }}
          onSelectionChange={(id) => handleOnSelectHotspot(Number(id))}
          aria-label="Search hotspots"
          onClear={handleClear}
          onInputChange={(value) => {
            setIsSearchInProgress(true);
            setSearchQuery(value);
          }}
          listboxProps={{
            emptyContent: isSearchInProgress
              ? "Searching..."
              : "No hotspots found",
          }}
        >
          {filteredHotspots.map((hotspot) => (
            <AutocompleteItem
              key={hotspot.id}
              startContent={<Router size={12} />}
            >
              {hotspot.name}
            </AutocompleteItem>
          ))}
        </Autocomplete>
      </div>
      <PlanTable
        hotspots={selectedHotspots}
        onRemoveHotspot={onRemoveHotspot}
      />
    </div>
  );
}
