"use client";

import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { ActionCard } from "./ActionCard";
import { ScrollArea } from "@/lib/ui/scroll-area";
import React, { useEffect, useState } from "react";
import { Action } from "@/lib/types/actions/action";
import { API_ACTION } from "@/lib/services/Actions/action_service";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";
type ActionLibrarySidebarProps = {
  onDragStart?: (action: Action) => void;
  onActionClick?: (action: Action) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export const ActionLibrarySidebar = ({
  onDragStart,
  onActionClick,
  isCollapsed = false,
  onToggleCollapse,
}: ActionLibrarySidebarProps) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [filteredActions, setFilteredActions] = useState<Action[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setIsLoading(true);
        const response = await API_ACTION.getActiveActions();
        setActions(response.data);
        setFilteredActions(response.data);
      } catch (error) {
        console.error("Error fetching actions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActions();
  }, []);

  useEffect(() => {
    let filtered = actions;

    if (searchQuery) {
      filtered = filtered.filter(
        (action) =>
          action.displayName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          action.actionDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (action) => action.category === selectedCategory
      );
    }

    setFilteredActions(filtered);
  }, [searchQuery, selectedCategory, actions]);

  const categories = Array.from(new Set(actions.map((a) => a.category)));

  const groupedActions = categories.reduce((acc, category) => {
    acc[category] = filteredActions.filter((a) => a.category === category);
    return acc;
  }, {} as Record<string, Action[]>);

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-background flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-10 h-10 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-r bg-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Actions Library</h3>
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="h-7 text-xs"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="h-7 text-xs capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Actions List */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No actions found</p>
          </div>
        ) : selectedCategory ? (
          <div className="space-y-2">
            {filteredActions.map((action) => (
              <div key={action._id} onClick={() => onActionClick?.(action)}>
                <ActionCard action={action} onDragStart={onDragStart} />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedActions).map(
              ([category, categoryActions]) =>
                categoryActions.length > 0 && (
                  <div key={category}>
                    <h4 className="text-sm font-semibold mb-3 capitalize text-muted-foreground">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {categoryActions.map((action) => (
                        <div
                          key={action._id}
                          onClick={() => onActionClick?.(action)}
                        >
                          <ActionCard
                            action={action}
                            onDragStart={onDragStart}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          Drag actions onto the canvas or click to add
        </p>
      </div>
    </div>
  );
};
