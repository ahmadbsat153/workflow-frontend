"use client";

import React, { useEffect, useState } from "react";

import { Input } from "@/lib/ui/input";
import { Button } from "@/lib/ui/button";
import { Badge } from "@/lib/ui/badge";
import { API_ACTION } from "@/lib/services/Actions/action_service";
import { Action } from "@/lib/types/actions/action";
import { Loader2, Search } from "lucide-react";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogDescription,AlertDialogHeader, AlertDialogTitle } from "@/lib/ui/alert-dialog";
import { ScrollArea } from "@/lib/ui/scroll-area";

interface ActionSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelectAction: (action: Action) => void;
}

const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Icons.Zap;
  const Icon = Icons[iconName as keyof typeof Icons] as LucideIcon;
  return Icon || Icons.Zap;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    notification: "bg-blue-100 text-blue-800 border-blue-200",
    data: "bg-green-100 text-green-800 border-green-200",
    approval: "bg-purple-100 text-purple-800 border-purple-200",
    integration: "bg-orange-100 text-orange-800 border-orange-200",
    logic: "bg-pink-100 text-pink-800 border-pink-200",
  };
  return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
};

export const ActionSelectionModal = ({
  open,
  onClose,
  onSelectAction,
}: ActionSelectionModalProps) => {
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
        const activeActions = response.data.filter((action) => action.isActive);
        setActions(activeActions);
        setFilteredActions(activeActions);
      } catch (error) {
        console.error("Error fetching actions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchActions();
    }
  }, [open]);

  useEffect(() => {
    let filtered = actions;

    if (searchQuery) {
      filtered = filtered.filter(
        (action) =>
          action.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          action.actionDescription.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((action) => action.category === selectedCategory);
    }

    setFilteredActions(filtered);
  }, [searchQuery, selectedCategory, actions]);

  const categories = Array.from(new Set(actions.map((a) => a.category)));

  const handleSelectAction = (action: Action) => {
    onSelectAction(action);
    onClose();
    // Reset state
    setSearchQuery("");
    setSelectedCategory(null);
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl max-h-[80vh]">
        <AlertDialogHeader>
          <AlertDialogTitle>Select an Action</AlertDialogTitle>
          <AlertDialogDescription>
            Choose an action to add to your workflow
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4">
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
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Actions List */}
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredActions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No actions found
            </div>
          ) : (
            <div className="space-y-2">
              {filteredActions.map((action) => {
                const IconComponent = getIconComponent(action.icon);
                return (
                  <button
                    key={action._id}
                    onClick={() => handleSelectAction(action)}
                    className="w-full p-4 border rounded-lg hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{action.displayName}</h4>
                          <Badge className={getCategoryColor(action.category)}>
                            {action.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {action.actionDescription}
                        </p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {action.configSchema.fields.length} configuration field
                          {action.configSchema.fields.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </AlertDialogContent>
    </AlertDialog>
  );
};