import { Category } from "@/types";
import {
  Beef,
  Beer,
  Droplets,
  Leaf,
  MoreHorizontal,
  Sparkles,
  Utensils,
  Wheat
} from "lucide-react";
import { ReactNode } from "react";

export const CATEGORY_ICONS: Record<Category, ReactNode> = {
  Alimentos: <Utensils size={18} />,
  Bebidas: <Beer size={18} />,
  Hortifruti: <Leaf size={18} />,
  Padaria: <Wheat size={18} />,
  Acougue: <Beef size={18} />,
  Limpeza: <Sparkles size={18} />,
  Higiene: <Droplets size={18} />,
  Outros: <MoreHorizontal size={18} />,
};
