import colors from 'tailwindcss/colors'

export function generateDynamicFavicon(colorName: string): string {
    // Get the 600 shade of the specified color from Tailwind's colors
    const colorValue = colors[colorName as keyof typeof colors]?.[600]
    
    if (!colorValue) {
        console.warn(`Color ${colorName}-600 not found in Tailwind colors, falling back to black`)
        return '#000000'
    }

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${colorValue}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
      <path d="M2 12h20"/>
    </svg>
  `

    const encodedSvg = encodeURIComponent(svg)
    return `data:image/svg+xml,${encodedSvg}`
}