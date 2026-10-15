// Product names, descriptions, prices and hex shades are from the supplied WEBSITE CONTENT document.
// Products, prices, descriptions and shade hex codes as supplied in the WEBSITE CONTENT document.
window.YLEA_PRODUCTS = [
  {
    id: 'petal-veil-primer',
    name: 'Petal Veil Gripping Primer',
    price: 199,
    image: 'assets/products/petal-veil-primer.webp',
    category: 'complexion',
    type: 'Primer',
    tag: 'Fresh start',
    description: 'A lightweight primer that creates a smooth base for foundation and helps makeup adhere to the skin. Its non-greasy formula helps minimize excess shine while leaving the skin feeling fresh and comfortable.',
    shades: [{name: 'Petal Beige', hex: '#F1E4DC'}]
  },
  {
    id: 'bloomveil-foundation',
    name: 'Bloomveil Cream Foundation',
    price: 279,
    image: 'assets/products/bloomveil-foundation.webp',
    category: 'complexion',
    type: 'Foundation',
    tag: 'Garden favorite',
    description: 'A creamy, blendable foundation that provides buildable coverage to even out the appearance of the skin. Its natural finish allows the complexion to look smooth and radiant without feeling too heavy.',
    shades: [
      {name: 'Porcelain Bloom', hex: '#F3DCCB'},
      {name: 'Ivory Petal', hex: '#E8C6AA'},
      {name: 'Peach Blossom', hex: '#DDB293'},
      {name: 'Golden Sampaguita', hex: '#C99770'},
      {name: 'Morena Glow', hex: '#AD7957'},
      {name: 'Caramel Orchid', hex: '#895A40'},
      {name: 'Mahogany Bloom', hex: '#67412F'}
    ]
  },
  {
    id: 'secret-garden-concealer',
    name: 'Secret Garden Concealer Palette',
    price: 229,
    image: 'assets/products/secret-garden-concealer.webp',
    category: 'complexion',
    type: 'Concealer palette',
    tag: 'Four-in-one',
    isPalette: true,
    description: 'A versatile four-shade concealer palette designed to cover blemishes, dark circles, and other skin discolorations. Its creamy formula blends easily, allowing users to mix shades for a closer skin-tone match and achieve their desired coverage.',
    shades: [
      {name: 'Petal Beige', hex: '#F0D5C0'},
      {name: 'Warm Sand', hex: '#DDAF8C'},
      {name: 'Golden Tan', hex: '#BF8965'},
      {name: 'Deep Cocoa', hex: '#966344'}
    ]
  },
  {
    id: 'rosy-dew-blush',
    name: 'Rosy Dew Liquid Blush',
    price: 149,
    image: 'assets/products/rosy-dew-blush.webp',
    category: 'complexion',
    type: 'Liquid blush',
    tag: 'Soft flush',
    description: 'A lightweight liquid blush that adds a fresh flush of color to the cheeks. Its blendable formula allows users to build the intensity gradually, from a subtle rosy tint to a more noticeable pop of color.',
    shades: [
      {name: 'Rosebud Kiss', hex: '#E98B9B'},
      {name: 'Sunset Bloom', hex: '#D96B58'},
      {name: 'Rosy Hibiscus', hex: '#B94F68'},
      {name: 'Coral Petal', hex: '#A9543D'}
    ]
  },
  {
    id: 'fairy-glow-highlighter',
    name: 'Fairy Glow Liquid Highlighter',
    price: 159,
    image: 'assets/products/fairy-glow-highlighter.webp',
    category: 'complexion',
    type: 'Liquid highlighter',
    tag: 'Luminous glow',
    description: 'A luminous liquid highlighter that gives the skin a radiant, dewy finish. Its blendable formula makes it easy to accentuate the cheekbones, nose, and other high points of the face for a soft, light-catching glow.',
    shades: [
      {name: 'Moonlit Pearl', hex: '#F5E3D4'},
      {name: 'Golden Pollen', hex: '#E5BE78'},
      {name: 'Rose Quartz', hex: '#D9A3A0'},
      {name: 'Bronzed Petal', hex: '#B77B51'}
    ]
  },
  {
    id: 'wild-berry-powder',
    name: 'Wild Berry Velvet Setting Powder',
    price: 169,
    image: 'assets/products/wild-berry-powder.webp',
    category: 'complexion',
    type: 'Setting powder',
    tag: 'Velvet finish',
    description: 'A finely milled setting powder that helps set foundation and concealer while reducing excess shine. It leaves the skin with a smoother-looking finish and helps makeup appear neat and fresh throughout the day.',
    shades: [
      {name: 'Translucent Cloud', hex: '#F2E9DF'},
      {name: 'Soft Beige', hex: '#E3C4A3'},
      {name: 'Warm Sand', hex: '#CDA17B'},
      {name: 'Deep Honey', hex: '#A87550'}
    ]
  },
  {
    id: 'enchanted-bloom-eyeshadow',
    name: 'Enchanted Bloom Eyeshadow Palette',
    price: 279,
    image: 'assets/products/enchanted-bloom-eyeshadow.webp',
    category: 'eyes',
    type: 'Eyeshadow palette',
    tag: 'Eight-in-one',
    isPalette: true,
    description: 'An eyeshadow palette featuring eight blendable shades inspired by the colors of a blooming fantasy garden. From soft neutrals to rich purples and earthy tones, its versatile selection allows users to create both simple everyday looks and expressive eye makeup.',
    shades: [
      {name: 'Sampaguita Cream', hex: '#F3E3CD'},
      {name: 'Blush Blossom', hex: '#DDA3A6'},
      {name: 'Lavender Haze', hex: '#B8A1D3'},
      {name: 'Rosewood', hex: '#A66D73'},
      {name: 'Golden Nectar', hex: '#D9B15F'},
      {name: 'Garden Moss', hex: '#7D8860'},
      {name: 'Plum Twilight', hex: '#65435F'},
      {name: 'Midnight Soil', hex: '#49352F'}
    ]
  },
  {
    id: 'petal-arch-brow',
    name: 'Petal Arch Brow Sculptor',
    price: 99,
    image: 'assets/products/petal-arch-brow.webp',
    category: 'eyes',
    type: 'Brow sculptor',
    tag: 'Defined arches',
    description: 'A dual-ended eyebrow pencil designed to define and shape the brows with precision. Its fine pencil tip fills sparse areas, while the spoolie brush blends the color and grooms the brow hairs for a polished, natural-looking finish.',
    shades: [
      {name: 'Soft Taupe', hex: '#9C806D'},
      {name: 'Natural Brown', hex: '#79513A'},
      {name: 'Deep Espresso', hex: '#493027'}
    ]
  },
  {
    id: 'midnight-blossom-eyeliner',
    name: 'Midnight Blossom Precision Eyeliner',
    price: 99,
    image: 'assets/products/midnight-blossom-eyeliner.webp',
    category: 'eyes',
    type: 'Precision eyeliner',
    tag: 'Precise lines',
    description: 'A precision eyeliner that helps define the eyes with smooth, controlled application. Its versatile shades allow users to create delicate lines for a subtle look or more dramatic definition for special occasions.',
    shades: [
      {name: 'Midnight Black', hex: '#211B20'},
      {name: 'Cocoa Brown', hex: '#654333'},
      {name: 'Plum Night', hex: '#56354F'}
    ]
  },
  {
    id: 'whispering-petal-lip-nectar',
    name: 'Whispering Petal Lip Nectar',
    price: 129,
    image: 'assets/products/whispering-petal-lip-nectar.webp',
    category: 'lips',
    type: 'Lip nectar',
    tag: 'Glassy lips',
    description: 'A glossy lip product that gives the lips a smooth, radiant appearance with a comfortable feel. Available in a selection of soft pinks, warm nudes, and rich berry tones, it adds a delicate touch of color suitable for different occasions.',
    shades: [
      {name: 'Petal Pink', hex: '#E8A1AF'},
      {name: 'Peach Nectar', hex: '#EAA17F'},
      {name: 'Rosy Mauve', hex: '#B87583'},
      {name: 'Caramel Kiss', hex: '#A86B50'},
      {name: 'Berry Garden', hex: '#9D405E'},
      {name: 'Clear Dew', hex: '#F3DCD8'}
    ]
  },
  {
    id: 'petal-highlight-contour',
    name: 'Petal Embossed Highlight & Contour Palette',
    price: 229,
    image: 'assets/products/petal-highlight-contour.webp',
    category: 'complexion',
    type: 'Highlight & contour',
    tag: 'Golden Bloom',
    isPalette: true,
    description: 'A dual-purpose face palette designed to enhance facial features through light and shadow. Its blendable highlighter and contour shades help accentuate the cheekbones, define the jawline, and add dimension to the face.',
    shades: [
      {name: 'Golden Bloom — Highlighter', hex: '#E8C49B'},
      {name: 'Golden Bloom — Contour', hex: '#956747'}
    ]
  },
  {
    id: 'petal-soft-lipstick',
    name: 'Petal Soft Shine Lipstick',
    price: 129,
    image: 'assets/products/petal-soft-lipstick.webp',
    category: 'lips',
    type: 'Cream lipstick',
    tag: 'Soft shine',
    description: 'A creamy lipstick that delivers rich color with a soft, luminous finish. Its smooth texture glides across the lips, adding a comfortable wash of color that complements different skin tones and makeup styles, from natural everyday looks to more polished occasions.',
    shades: [
      {name: 'Mestiza Rose', hex: '#D98591'},
      {name: 'Peach Sampaguita', hex: '#E6A184'},
      {name: 'Rosy Mauve', hex: '#B76E7D'},
      {name: 'Morena Mocha', hex: '#995B49'},
      {name: 'Cinnamon Bloom', hex: '#A94F42'},
      {name: 'Berry Orchid', hex: '#843C59'},
      {name: 'Chocolate Dahlia', hex: '#63372F'},
      {name: 'Nude Petal', hex: '#C58D79'}
    ]
  }
];
