import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { motion } from "motion/react";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: Array<{ value: string; label: string }>;
  searchPlaceholder?: string;
  filterPlaceholder?: string;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterOptions,
  searchPlaceholder = "搜索...",
  filterPlaceholder = "筛选",
}: SearchFilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-4"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={filterValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[150px]">
          <Filter className="size-4 mr-2" />
          <SelectValue placeholder={filterPlaceholder} />
        </SelectTrigger>
        <SelectContent>
          {filterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
