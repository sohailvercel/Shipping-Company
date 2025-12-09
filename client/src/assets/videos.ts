// Media for HeroCarousel - Videos and images for slides
type MediaType = 'video' | 'image';

interface CarouselMedia {
  type: MediaType;
  video?: string;
  image?: string;
  fallback?: string;
  description: string;
}

export const carouselVideos: CarouselMedia[] = [
  {
    type: 'video',
    video: '/videos/3.mp4',
    fallback: '',
    description: 'Large container ship navigating through ocean waters'
  },
  {
    type: 'video',
    video: '/videos/1.mp4',
    fallback: '',
    description: 'Aerial view of container ship with colorful containers'
  },
  {
    type: 'video',
    video: '/videos/2.mp4',
    fallback: '',
    description: 'Vibrant commercial port with shipping containers'
  }
];



// HD Background images for all pages - Seas and shipping themed
export const pageBackgrounds = {
  // about: 'https://images.unsplash.com/photo-1568347877321-f8935c7dc5a3?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Ocean horizon with ship
  // gallery: 'https://images.unsplash.com/photo-1725100609268-c7f383e6b4e0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hpcHMlMjBjb250YWluZXJzJTIwaGR8ZW58MHx8MHx8fDA%3D', // Port with containers
  // blogs: 'https://images.unsplash.com/photo-1556034276-e913726ad6d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHNoaXBzfGVufDB8fDB8fHww', // Maritime logistics
  login: 'https://images.unsplash.com/photo-1547444196-2ea3ce201cc6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bG9naW4lMjBwYWdlfGVufDB8fDB8fHww', // Shipping containers stacked
//   quote: 'https://plus.unsplash.com/premium_photo-1664363806943-e292bd9e7c0c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njl8fGhhcmJvcnxlbnwwfHwwfHx8MA%3D%3D', // Container ship loading
//   yaaseenAbout: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Cargo ship on open sea
//   bakshInvestment: 'https://images.unsplash.com/photo-1578662996281-44b5df0c4271?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Modern port facility
//   uosl: 'https://images.unsplash.com/photo-1581922680055-4f02d31e4067?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Warehouse and containers
//   contact: 'https://plus.unsplash.com/premium_photo-1661964116252-ef68bf4266af?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTd8fGhhcmJvcnxlbnwwfHwwfHx8MA%3D%3D', // Port operations
//   tariffs: 'https://images.unsplash.com/photo-1623768503564-cd4109d7251d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fGhhcmJvcnxlbnwwfHwwfHx8MA%3D%3D', // Container terminal
//   bakshGroup: 'https://images.unsplash.com/photo-1643574546802-99d87f38714d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNoaXBzfGVufDB8fDB8fHww' // Corporate office building
};

// Video assets keyed by page/section for easier use in components
export const videoAssets = {
  home: {
    video: carouselVideos[0]?.video ?? '',
    fallback: carouselVideos[0]?.fallback ?? ''
  },
  about: {
    video: carouselVideos[1]?.video ?? '',
    fallback: carouselVideos[1]?.fallback ?? ''
  },
  gallery: {
    video: carouselVideos[2]?.video ?? '',
    fallback: carouselVideos[2]?.fallback ?? ''
  }
};
