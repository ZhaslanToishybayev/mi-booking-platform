// Image utility to get high-quality Unsplash images based on event types

const EVENT_IMAGES = {
  concert: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', // Verified
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop', // Verified
  ],
  standup: [
    'https://images.unsplash.com/photo-1586899028174-e7098604235b?q=80&w=1200&auto=format&fit=crop', // Verified
  ],
  festival: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', // Reuse verified
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1200&auto=format&fit=crop', // Reuse verified
  ],
  theater: [
    'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1200&auto=format&fit=crop', // Verified
  ],
  exhibition: [
    'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1200&auto=format&fit=crop', // Verified
  ],
  cinema: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop', // Verified
  ],
  default: [
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', // Verified
  ]
}

export const getEventImage = (title: string, id: number): string => {
  const titleLower = title.toLowerCase()
  let category: keyof typeof EVENT_IMAGES = 'default'
  
  if (titleLower.includes('концерт') || titleLower.includes('concert') || titleLower.includes('музык') || titleLower.includes('music')) {
    category = 'concert'
  } else if (titleLower.includes('stand-up') || titleLower.includes('стендап') || titleLower.includes('комед') || titleLower.includes('comedy')) {
    category = 'standup'
  } else if (titleLower.includes('фестиваль') || titleLower.includes('festival')) {
    category = 'festival'
  } else if (titleLower.includes('театр') || titleLower.includes('спектакль') || titleLower.includes('theater') || titleLower.includes('drama')) {
    category = 'theater'
  } else if (titleLower.includes('выставка') || titleLower.includes('exhibition') || titleLower.includes('art') || titleLower.includes('искусств')) {
    category = 'exhibition'
  } else if (titleLower.includes('кино') || titleLower.includes('фильм') || titleLower.includes('cinema') || titleLower.includes('movie')) {
    category = 'cinema'
  }
  
  const images = EVENT_IMAGES[category]
  // Use id to consistently pick the same image for the same event
  const index = id % images.length
  return images[index]
}
