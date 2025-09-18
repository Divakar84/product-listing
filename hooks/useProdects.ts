"use client";
import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product } from "@/types/product";

const PAGE_SIZE = 8;

export function useProducts(initialProducts: Product[]) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",") || []
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(
    searchParams.get("color") || null
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  // Filtering
  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCat =
        selectedCategories.length === 0 ||
        selectedCategories.includes(p.category);
      const matchColor =
        !selectedColor || p.colors.includes(selectedColor);
      return matchCat && matchColor;
    });
  }, [initialProducts, selectedCategories, selectedColor]);

  // Sorting
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "popularity") return b.ratingValue - a.ratingValue;
      return a.name.localeCompare(b.name);
    });
  }, [filtered, sortBy]);

  // Pagination
  const total = sorted.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const products = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // URL Sync
  const updateURL = () => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set("category", selectedCategories.join(","));
    }
    if (selectedColor) params.set("color", selectedColor);
    if (sortBy !== "name") params.set("sort", sortBy);
    if (page > 1) params.set("page", page.toString());

    const qs = params.toString();
    router.replace(qs ? `?${qs}` : "/");
  };

  return {
    products,
    total,
    totalPages,
    page,
    selectedCategories,
    selectedColor,
    sortBy,
    setSortBy: (s: string) => {
      setSortBy(s);
      updateURL();
    },
    toggleCategory: (cat: string) => {
      setSelectedCategories((prev) => {
        const next = prev.includes(cat)
          ? prev.filter((c) => c !== cat)
          : [...prev, cat];
        updateURL();
        return next;
      });
    },
    setColor: (c: string | null) => {
      setSelectedColor(c);
      updateURL();
    },
    goToPage: (p: number) => {
      setPage(p);
      updateURL();
    },
    clearFilters: () => {
      setSelectedCategories([]);
      setSelectedColor(null);
      setSortBy("name");
      setPage(1);
      router.replace("/");
    },
  };
}
