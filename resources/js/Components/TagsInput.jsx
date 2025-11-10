"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function TagsInput({ availableTags, value, onChange }) {
    const [internalTags, setInternalTags] = React.useState([]);
    const tags = value ?? internalTags;

    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("Click to add Tag");

    const updateTags = (newTags) => {
        if (!value) setInternalTags(newTags);
        onChange?.(newTags);
    };

    const addTag = (tag) => {
        const trimmed = tag.trim();
        if (!trimmed) return;
        if (!tags.includes(trimmed)) {
            updateTags([...tags, trimmed]);
        }
        setInputValue("");
        setOpen(false);
    };

    const removeTag = (tag) => {
        updateTags(tags.filter((t) => t !== tag));
    };

    const filteredTags = availableTags.filter((tag) =>
        tag.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Input
                        placeholder="Add a tag..."
                        value={inputValue}
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            setOpen(true);
                        }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={(e) => {
                            if (
                                e.key === "Enter" &&
                                inputValue.trim() !== "" &&
                                inputValue.trim().toLowerCase() !==
                                    "click to add tag"
                            ) {
                                e.preventDefault();
                                addTag(inputValue);
                            } else if (e.key === "Escape") {
                                setOpen(false);
                            }
                        }}
                    />
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[200px]" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search tags..."
                            value={inputValue}
                            onValueChange={setInputValue}
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" &&
                                    inputValue.trim() !== ""
                                ) {
                                    e.preventDefault();
                                    addTag(inputValue);
                                } else if (e.key === "Escape") {
                                    setOpen(false);
                                }
                            }}
                        />
                        <CommandList>
                            <CommandEmpty>
                                <div className="flex flex-col justify-between items-center px-2 py-1 text-sm">
                                    <span>No tag found</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            addTag(inputValue.trim())
                                        }
                                        disabled={!inputValue.trim()}
                                    >
                                        Add “{inputValue.trim()}”
                                    </Button>
                                </div>
                            </CommandEmpty>

                            <CommandGroup heading="Available Tags">
                                {filteredTags.map((tag) => (
                                    <CommandItem
                                        key={tag}
                                        onSelect={() => addTag(tag)}
                                        className="cursor-pointer"
                                    >
                                        {tag}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
