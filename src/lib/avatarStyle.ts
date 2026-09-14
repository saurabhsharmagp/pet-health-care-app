const PALETTE = ['#FF8C42', '#0F9D8B', '#3D8BFD', '#F4A261', '#E63946'];

// Deterministic so the same id always gets the same color across screens.
export function colorForId(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export function initialFor(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}
