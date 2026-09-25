/** Same colour the listing page shows under "Ytri litur" / "Litur". */
export function displayExteriorColour(car: {
  exterior_colour?: string | null
  colour?: string | null
}): string {
  const ext = (car.exterior_colour || '').trim()
  const col = (car.colour || '').trim()
  // Configurator dumps like "vanadiumgraumetallic" — prefer the human colour field
  if (ext && /^[a-z]+$/.test(ext) && col) return col
  return ext || col || 'Ótilgreint'
}
