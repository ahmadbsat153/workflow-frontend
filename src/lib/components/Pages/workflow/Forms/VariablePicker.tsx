"use client";

import React, { useState } from "react";
import { Button } from "@/lib/ui/button";

import { Input } from "@/lib/ui/input";
import { ScrollArea } from "@/lib/ui/scroll-area";
import { Badge } from "@/lib/ui/badge";
import { Braces, Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/ui/popover";

interface Variable {
  name: string;
  description?: string;
  type?: string;
}

interface VariablePickerProps {
  onSelect: (variable: string) => void;
  availableVariables?: Variable[];
}

// Default form submission variables
const DEFAULT_VARIABLES: Variable[] = [
  {
    name: "submittedBy.name",
    description: "Name of person who submitted",
    type: "text",
  },
  {
    name: "submittedBy.email",
    description: "Email of person who submitted",
    type: "email",
  },
  { name: "submittedAt", description: "Submission timestamp", type: "date" },
  { name: "formId", description: "Form ID", type: "text" },
  { name: "submissionId", description: "Submission ID", type: "text" },
];

export const VariablePicker = ({
  onSelect,
  availableVariables = [],
}: VariablePickerProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const allVariables = [...DEFAULT_VARIABLES, ...availableVariables];

  const filteredVariables = allVariables.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (variable: string) => {
    onSelect(`{{${variable}}}`);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="gap-2">
          <Braces className="h-4 w-4" />
          Insert Variable
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search variables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-72">
          <div className="p-2">
            {filteredVariables.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No variables found
              </div>
            ) : (
              <div className="space-y-1">
                {filteredVariables.map((variable) => (
                  <button
                    key={variable.name}
                    type="button"
                    onClick={() => handleSelect(variable.name)}
                    className="w-full text-left p-3 rounded hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-sm font-mono text-primary">
                        {`{{${variable.name}}}`}
                      </code>
                      {variable.type && (
                        <Badge variant="secondary" className="text-xs">
                          {variable.type}
                        </Badge>
                      )}
                    </div>
                    {variable.description && (
                      <p className="text-xs text-muted-foreground">
                        {variable.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 border-t bg-muted/50">
          <p className="text-xs text-muted-foreground">
            💡 Variables will be replaced with actual values at runtime
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
