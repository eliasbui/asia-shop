import { Collection, CollectionFilter } from '@/lib/types/collections';
import { Product } from '@/lib/types/domain';

// Mock product data that would typically come from an API
const mockProducts: Product[] = [
  {
    id: 'prod-1',
    slug: 'summer-breeze-floral-dress',
    title: 'Summer Breeze Floral Dress',
    brand: 'Fashion Forward',
    category: 'women-clothing',
    attributes: {
      color: ['Blue', 'White'],
      size: ['XS', 'S', 'M', 'L', 'XL'],
      material: 'Cotton',
      season: 'summer'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
      alt: 'Summer Floral Dress'
    }],
    rating: 4.5,
    reviewCount: 128,
    price: {
      list: { currency: 'USD', amount: 89.99 },
      sale: { currency: 'USD', amount: 59.99 },
      percentOff: 33
    },
    badges: ['new'],
    shortDesc: 'Light and breezy floral dress perfect for summer occasions',
    collections: ['summer-essentials', 'vintage-elegance']
  },
  {
    id: 'prod-2',
    slug: 'urban-chic-denim-jacket',
    title: 'Urban Chic Denim Jacket',
    brand: 'Street Style',
    category: 'women-clothing',
    attributes: {
      color: ['Blue', 'Black'],
      size: ['S', 'M', 'L', 'XL'],
      material: 'Denim',
      style: 'casual'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1571696412619-e5797f3e4c91?w=800',
      alt: 'Denim Jacket'
    }],
    rating: 4.8,
    reviewCount: 256,
    price: {
      list: { currency: 'USD', amount: 129.99 }
    },
    badges: ['bestseller'],
    shortDesc: 'Classic denim jacket with modern urban styling',
    collections: ['urban-streetwear']
  },
  {
    id: 'prod-3',
    slug: 'elegant-evening-clutch',
    title: 'Elegant Evening Clutch',
    brand: 'Luxury Lane',
    category: 'accessories',
    attributes: {
      color: ['Gold', 'Silver', 'Black'],
      material: 'Metallic',
      occasion: 'formal'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1584917865442-de89dfc88c50?w=800',
      alt: 'Evening Clutch'
    }],
    rating: 4.7,
    reviewCount: 89,
    price: {
      list: { currency: 'USD', amount: 79.99 }
    },
    badges: ['new'],
    shortDesc: 'Sophisticated clutch bag for special occasions',
    collections: ['summer-essentials', 'vintage-elegance']
  },
  {
    id: 'prod-4',
    slug: 'vintage-leather-handbag',
    title: 'Vintage Leather Handbag',
    brand: 'Heritage Collection',
    category: 'accessories',
    attributes: {
      color: ['Brown', 'Tan', 'Black'],
      material: 'Leather',
      style: 'vintage'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
      alt: 'Leather Handbag'
    }],
    rating: 4.9,
    reviewCount: 342,
    price: {
      list: { currency: 'USD', amount: 189.99 },
      sale: { currency: 'USD', amount: 149.99 },
      percentOff: 21
    },
    badges: ['bestseller'],
    shortDesc: 'Timeless leather handbag with vintage-inspired design',
    collections: ['vintage-elegance']
  },
  {
    id: 'prod-5',
    slug: 'sporty-sneakers-collection',
    title: 'Sporty Sneakers Collection',
    brand: 'Athletic Pro',
    category: 'footwear',
    attributes: {
      color: ['White', 'Black', 'Blue', 'Red'],
      size: ['6', '7', '8', '9', '10', '11'],
      material: 'Mesh',
      activity: 'running'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
      alt: 'Sporty Sneakers'
    }],
    rating: 4.6,
    reviewCount: 189,
    price: {
      list: { currency: 'USD', amount: 119.99 }
    },
    shortDesc: 'Comfortable and stylish sneakers for active lifestyle',
    collections: ['urban-streetwear', 'summer-essentials']
  },
  {
    id: 'prod-6',
    slug: 'cozy-knit-sweater',
    title: 'Cozy Knit Sweater',
    brand: 'Comfort Zone',
    category: 'women-clothing',
    attributes: {
      color: ['Cream', 'Gray', 'Pink'],
      size: ['S', 'M', 'L', 'XL'],
      material: 'Wool',
      season: 'winter'
    },
    media: [{
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      alt: 'Knit Sweater'
    }],
    rating: 4.4,
    reviewCount: 167,
    price: {
      list: { currency: 'USD', amount: 79.99 },
      sale: { currency: 'USD', amount: 59.99 },
      percentOff: 25
    },
    shortDesc: 'Ultra-soft knit sweater perfect for cold days',
    collections: ['cozy-winter-collection', 'vintage-elegance']
  }
];

export const collections: Collection[] = [
  {
    id: 'col-summer-essentials',
    slug: 'summer-essentials',
    title: 'Summer Essentials',
    description: 'Embrace the sunshine with our curated collection of summer must-haves. From breezy dresses to lightweight accessories, discover everything you need for the perfect summer wardrobe.',
    shortDesc: 'Light, bright, and perfect for warm weather adventures',
    banner: {
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920',
      alt: 'Summer Essentials Collection',
      overlayColor: 'rgba(255, 182, 193, 0.3)'
    },
    theme: {
      primaryColor: '#FF6B9D',
      secondaryColor: '#FFC75F',
      backgroundColor: '#FFF5F5'
    },
    metadata: {
      productCount: 156,
      featured: true,
      tags: ['summer', 'beach', 'vacation', 'lightweight'],
      season: 'summer',
      targetAudience: ['women', 'men', 'unisex']
    },
    seo: {
      title: 'Summer Essentials Collection | Your Perfect Summer Wardrobe',
      description: 'Shop our curated summer collection featuring lightweight clothing, beach accessories, and vacation-ready outfits.',
      keywords: ['summer clothing', 'beach wear', 'vacation outfits', 'lightweight clothing']
    },
    filters: [
      {
        id: 'filter-color',
        type: 'checkbox',
        name: 'Color',
        field: 'attributes.color',
        options: [
          { label: 'White', value: 'White', count: 45 },
          { label: 'Blue', value: 'Blue', count: 38 },
          { label: 'Pink', value: 'Pink', count: 32 },
          { label: 'Yellow', value: 'Yellow', count: 28 },
          { label: 'Green', value: 'Green', count: 13 }
        ]
      },
      {
        id: 'filter-size',
        type: 'checkbox',
        name: 'Size',
        field: 'attributes.size',
        options: [
          { label: 'XS', value: 'XS', count: 41 },
          { label: 'S', value: 'S', count: 68 },
          { label: 'M', value: 'M', count: 89 },
          { label: 'L', value: 'L', count: 72 },
          { label: 'XL', value: 'XL', count: 47 }
        ]
      },
      {
        id: 'filter-price',
        type: 'range',
        name: 'Price Range',
        field: 'price.list.amount',
        min: 10,
        max: 200,
        step: 10
      }
    ],
    curatedProducts: ['prod-1', 'prod-3', 'prod-5'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-03-01T14:30:00Z'
  },
  {
    id: 'col-urban-streetwear',
    slug: 'urban-streetwear',
    title: 'Urban Streetwear',
    description: 'Street style meets urban sophistication in this edgy collection. Featuring bold designs, comfortable fits, and contemporary aesthetics that define modern street fashion.',
    shortDesc: 'Bold, modern, and perfect for city streets',
    banner: {
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920',
      alt: 'Urban Streetwear Collection',
      overlayColor: 'rgba(0, 0, 0, 0.4)'
    },
    theme: {
      primaryColor: '#2C3E50',
      secondaryColor: '#E74C3C',
      backgroundColor: '#1A1A1A'
    },
    metadata: {
      productCount: 203,
      featured: true,
      tags: ['urban', 'streetwear', 'edgy', 'contemporary'],
      season: 'year-round',
      targetAudience: ['youth', 'men', 'women']
    },
    seo: {
      title: 'Urban Streetwear Collection | Contemporary Street Fashion',
      description: 'Discover the latest urban streetwear trends with our curated collection of edgy, modern clothing and accessories.',
      keywords: ['urban fashion', 'streetwear', 'contemporary clothing', 'edgy style']
    },
    filters: [
      {
        id: 'filter-style',
        type: 'select',
        name: 'Style',
        field: 'attributes.style',
        options: [
          { label: 'Casual', value: 'casual', count: 89 },
          { label: 'Sporty', value: 'sporty', count: 67 },
          { label: 'Edgy', value: 'edgy', count: 47 }
        ]
      },
      {
        id: 'filter-brand',
        type: 'checkbox',
        name: 'Brand',
        field: 'brand',
        options: [
          { label: 'Street Style', value: 'Street Style', count: 34 },
          { label: 'Urban Edge', value: 'Urban Edge', count: 28 },
          { label: 'City Life', value: 'City Life', count: 19 }
        ]
      }
    ],
    curatedProducts: ['prod-2', 'prod-5'],
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-03-15T16:45:00Z'
  },
  {
    id: 'col-vintage-elegance',
    slug: 'vintage-elegance',
    title: 'Vintage Elegance',
    description: 'Step back in time with our vintage-inspired collection. Classic designs, timeless silhouettes, and retro aesthetics that never go out of style.',
    shortDesc: 'Timeless pieces with vintage-inspired charm',
    banner: {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
      alt: 'Vintage Elegance Collection',
      overlayColor: 'rgba(139, 69, 19, 0.3)'
    },
    theme: {
      primaryColor: '#8B4513',
      secondaryColor: '#DAA520',
      backgroundColor: '#FFF8DC'
    },
    metadata: {
      productCount: 127,
      featured: false,
      tags: ['vintage', 'classic', 'retro', 'timeless'],
      season: 'year-round',
      targetAudience: ['women', 'men', 'mature']
    },
    seo: {
      title: 'Vintage Elegance Collection | Timeless Fashion',
      description: 'Explore our vintage-inspired collection featuring classic designs, retro aesthetics, and timeless fashion pieces.',
      keywords: ['vintage fashion', 'retro clothing', 'classic style', 'timeless elegance']
    },
    filters: [
      {
        id: 'filter-era',
        type: 'select',
        name: 'Era',
        field: 'attributes.era',
        options: [
          { label: '1920s', value: '1920s', count: 18 },
          { label: '1950s', value: '1950s', count: 42 },
          { label: '1970s', value: '1970s', count: 31 },
          { label: '1990s', value: '1990s', count: 36 }
        ]
      },
      {
        id: 'filter-material',
        type: 'checkbox',
        name: 'Material',
        field: 'attributes.material',
        options: [
          { label: 'Leather', value: 'Leather', count: 28 },
          { label: 'Denim', value: 'Denim', count: 35 },
          { label: 'Cotton', value: 'Cotton', count: 64 }
        ]
      }
    ],
    curatedProducts: ['prod-4', 'prod-6'],
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-02-28T13:15:00Z'
  },
  {
    id: 'cozy-winter-collection',
    slug: 'cozy-winter-collection',
    title: 'Cozy Winter Collection',
    description: 'Stay warm and stylish all winter long with our cozy collection. From soft knit sweaters to elegant winter accessories, embrace the season in comfort and style.',
    shortDesc: 'Warm, comfortable, and perfect for winter days',
    banner: {
      image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1920',
      alt: 'Cozy Winter Collection',
      overlayColor: 'rgba(173, 216, 230, 0.4)'
    },
    theme: {
      primaryColor: '#4682B4',
      secondaryColor: '#DC143C',
      backgroundColor: '#F0F8FF'
    },
    metadata: {
      productCount: 178,
      featured: true,
      tags: ['winter', 'cozy', 'warm', 'comfortable'],
      season: 'winter',
      targetAudience: ['women', 'men', 'family']
    },
    seo: {
      title: 'Cozy Winter Collection | Warm Winter Fashion',
      description: 'Shop our winter collection for cozy sweaters, warm accessories, and stylish cold-weather essentials.',
      keywords: ['winter clothing', 'cozy fashion', 'warm sweaters', 'winter accessories']
    },
    filters: [
      {
        id: 'filter-warmth',
        type: 'select',
        name: 'Warmth Level',
        field: 'attributes.warmth',
        options: [
          { label: 'Light', value: 'light', count: 45 },
          { label: 'Medium', value: 'medium', count: 89 },
          { label: 'Heavy', value: 'heavy', count: 44 }
        ]
      },
      {
        id: 'filter-material-type',
        type: 'checkbox',
        name: 'Material Type',
        field: 'attributes.material',
        options: [
          { label: 'Wool', value: 'Wool', count: 67 },
          { label: 'Cashmere', value: 'Cashmere', count: 34 },
          { label: 'Fleece', value: 'Fleece', count: 77 }
        ]
      }
    ],
    curatedProducts: ['prod-6'],
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-20T12:00:00Z'
  }
];

export const getCollectionBySlug = (slug: string): Collection | undefined => {
  return collections.find(collection => collection.slug === slug);
};

export const getCollections = (): Collection[] => {
  return collections;
};

export const getFeaturedCollections = (): Collection[] => {
  return collections.filter(collection => collection.metadata.featured);
};

export const getProductsByCollection = (collectionSlug: string): Product[] => {
  const collection = getCollectionBySlug(collectionSlug);
  if (!collection) return [];

  // In a real implementation, this would be an API call
  // For now, return mock products filtered by collection themes
  return mockProducts.filter(product => {
    const productText = `${product.title} ${product.shortDesc} ${product.category} ${JSON.stringify(product.attributes)}`.toLowerCase();
    return collection.metadata.tags.some(tag =>
      productText.includes(tag.toLowerCase())
    );
  });
};