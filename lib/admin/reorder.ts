/**
 * New order of ids after moving one up or down, or null when it cannot
 * move further. Used to renumber sortOrder 1, 2, 3… for therapists and
 * products.
 */
export function moveInOrder(ids: string[], id: string, direction: "up" | "down"): string[] | null {
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= ids.length) return null;
  const order = [...ids];
  const [moving] = order.splice(index, 1);
  if (!moving) return null;
  order.splice(target, 0, moving);
  return order;
}
