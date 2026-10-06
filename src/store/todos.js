import { create } from "zustand";
import { persist } from "zustand/middleware";

function isTodo(item) {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.value === "string" &&
    typeof item.done === "boolean"
  );
}

export const useTodoStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (value) => {
        const text = value.trim();
        if (!text) return;
        set({
          items: [
            ...get().items,
            { id: crypto.randomUUID(), value: text, done: false },
          ],
        });
      },
      toggleItem: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, done: !item.done } : item,
          ),
        });
      },
      updateItem: (id, value) => {
        const text = value.trim();
        if (!text) return false;
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, value: text } : item,
          ),
        });
        return true;
      },
      removeItem: (id) => {
        const items = get().items;
        const index = items.findIndex((item) => item.id === id);
        if (index === -1) return null;
        const item = items[index];
        set({ items: items.filter((entry) => entry.id !== id) });
        return { item, index };
      },
      restoreItem: ({ item, index }) => {
        const items = [...get().items];
        const insertAt = Math.min(Math.max(index, 0), items.length);
        items.splice(insertAt, 0, item);
        set({ items });
      },
      clearCompleted: () => {
        set({ items: get().items.filter((item) => !item.done) });
      },
    }),
    {
      name: "todo-list-items",
      merge: (persisted, current) => {
        const saved = persisted?.items;
        const items = Array.isArray(saved) ? saved.filter(isTodo) : [];
        return { ...current, items };
      },
    },
  ),
);
