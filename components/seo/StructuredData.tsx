export function StructuredData() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PowerNetPro',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://powernetpro.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://powernetpro.com'}/logo.png`,
    description: 'Digital solar platform enabling community solar participation across India',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kothrud',
      addressLocality: 'Pune',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    email: 'omkarkolhe912@gmail.com',
    telephone: '+918180861415',
    sameAs: [
      'https://twitter.com/powernetpro',
      'https://linkedin.com/company/powernetpro',
      'https://facebook.com/powernetpro',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'omkarkolhe912@gmail.com',
      telephone: '+918180861415',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi'],
    },
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Digital Solar Capacity',
    description:
      'Reserve solar capacity from community projects without installation. Save on electricity bills with automatic credits.',
    brand: {
      '@type': 'Brand',
      name: 'PowerNetPro',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '75000',
      highPrice: '7500000',
      offerCount: '50+',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1247',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Digital Solar?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Digital Solar allows you to access clean solar energy without installing panels on your property. You reserve capacity from community solar projects, and the energy generated creates credits that automatically offset your electricity bills.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I need to own my home to participate?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No! Digital Solar is perfect for renters, apartment dwellers, and anyone who can\'t install panels. As long as you pay an electricity bill, you can participate and save.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much can I save on my electricity bills?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most users save between ₹500-2,000 per month depending on their capacity reservation. Our calculator can give you a personalized estimate based on your current usage.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
