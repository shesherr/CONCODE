import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const defaultArticles = [
  {
    id: 1,
    title: 'Concord Group Wins Excellence in Construction Award 2026',
    excerpt: 'Concord Real Estate & Engineering Ltd. has been honored with the prestigious Excellence in Construction Award for our outstanding contribution to Bangladesh\'s real estate sector.',
    content: `Concord Real Estate & Engineering Ltd. has been recognized with the Excellence in Construction Award 2026, acknowledging our commitment to quality, innovation, and sustainable development in Bangladesh's real estate sector.

The award ceremony, held at the Pan Pacific Sonargaon Hotel, brought together industry leaders, government officials, and stakeholders from across the construction sector. Our Chairman, Mr. Mohiuddin Monem, received the award on behalf of the entire Concord family.

"This recognition is a testament to the hard work and dedication of our entire team," said Mr. Monem. "For over 50 years, Concord has been committed to building not just structures, but dreams. This award motivates us to continue pushing the boundaries of excellence."

Concord has been instrumental in shaping Dhaka's skyline with iconic projects such as Concord Gulshan Heights, Concord Banani Tower, and numerous residential and commercial developments across the country.

Key achievements highlighted by the award committee include:
- Delivery of over 50 landmark projects
- Implementation of green building practices
- Zero-accident safety record
- Customer satisfaction rate of 98%`,
    author: 'Concord Communications',
    date: 'May 12, 2026',
    category: 'Company News',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
    readTime: '5 min read',
    featured: true
  },
  {
    id: 2,
    title: '10 Tips for First-Time Home Buyers in Bangladesh',
    excerpt: 'Navigating the real estate market can be challenging. Here are essential tips to help you make informed decisions when buying your first property.',
    content: `Buying your first home is one of the most significant financial decisions you'll make. With Bangladesh's real estate market evolving rapidly, it's essential to be well-prepared. Here are ten tips to guide you through the process:

1. **Determine Your Budget**
Before you start looking at properties, get a clear understanding of your financial situation. Consider all costs including down payment, monthly installments, registration fees, and utility connections.

2. **Research Locations Thoroughly**
Different areas in Dhaka offer different advantages. Gulshan and Banani are premium areas with excellent infrastructure, while areas like Uttara and Mirpur offer more affordable options with developing amenities.

3. **Choose Reputable Developers**
Work with established developers like Concord who have a proven track record. Check their previous projects, delivery timelines, and customer reviews.

4. **Verify Legal Documents**
Ensure the property has all necessary approvals from RAJUK, environment department, and other relevant authorities. Verify the land title and mutation documents.

5. **Understand the Payment Plan**
Most developers offer flexible payment plans. Choose one that aligns with your income stream. Understand the booking money, down payment, and installment structure.

6. **Visit at Different Times**
Visit the property location at different times of the day to understand traffic patterns, noise levels, and neighborhood activity.

7. **Check Amenities and Facilities**
Evaluate the building amenities - parking, security, power backup, water supply, and waste management. For residential units, consider proximity to schools, hospitals, and markets.

8. **Review the Floor Plan Carefully**
Ensure the floor plan matches your lifestyle needs. Consider room sizes, ventilation, natural light, and layout efficiency.

9. **Understand the Handover Condition**
Clarify what's included in the handover - fittings, fixtures, paint, and finishing. Some developers handover units as bare shells while others provide complete fit-outs.

10. **Plan for the Future**
Consider the property's potential resale value and how it fits into your long-term plans. Properties in developing areas often appreciate faster.

At Concord, we're committed to helping first-time buyers navigate this journey smoothly. Our sales team provides comprehensive guidance and transparent information to help you make the right choice.`,
    author: 'Sarah Rahman',
    date: 'May 10, 2026',
    category: 'Buying Guide',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop',
    readTime: '8 min read',
    featured: false
  },
  {
    id: 3,
    title: 'The Future of Smart Homes in Bangladesh',
    excerpt: 'Explore how technology is transforming residential living in Bangladesh and what it means for homeowners and developers.',
    content: `The concept of smart homes is rapidly gaining traction in Bangladesh, transforming how we interact with our living spaces. At Concord, we're at the forefront of integrating cutting-edge technology into our residential projects.

What Makes a Home Smart?

A smart home uses internet-connected devices to enable remote monitoring and management of appliances and systems. This includes lighting, heating, air conditioning, security, and entertainment systems.

Key Smart Home Features Becoming Standard in Bangladesh:

1. **Smart Security Systems**
- Biometric door locks
- Video door phones with mobile connectivity
- Motion-sensor lighting
- 24/7 CCTV monitoring with cloud storage
- Intrusion detection systems

2. **Energy Management**
- Smart thermostats for AC control
- Automated lighting systems
- Solar panel integration with smart monitoring
- Energy consumption tracking apps

3. **Convenience Features**
- Voice-controlled assistants
- Automated curtain systems
- Smart appliances
- Remote control via mobile apps

Benefits for Homeowners:

- Enhanced security and peace of mind
- Energy savings of up to 30%
- Increased comfort and convenience
- Higher property value
- Remote monitoring when traveling

Concord's Smart Home Initiatives:

Our latest projects, including Concord Gulshan Heights and Concord Banani Tower, come pre-wired for smart home integration. We offer packages ranging from basic automation to full smart home solutions.

The Investment Perspective:

While smart homes cost 5-10% more initially, the ROI comes through energy savings, security benefits, and higher resale values. Industry experts predict smart-ready homes will command a 15-20% premium by 2030.

Getting Started:

For existing homeowners, gradual smart home adoption is possible. Start with security systems, then expand to lighting and energy management. Our Concord Smart Home team offers consultation and retrofitting services.

The future of residential living in Bangladesh is smart, and Concord is leading the way in making this technology accessible to all.`,
    author: 'Tech Desk',
    date: 'May 8, 2026',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1558002038-1091a1661116?w=800&h=500&fit=crop',
    readTime: '6 min read',
    featured: false
  },
  {
    id: 4,
    title: 'Sustainable Building Practices: Concord\'s Green Initiative',
    excerpt: 'Learn how Concord is incorporating eco-friendly practices and sustainable materials in construction to reduce environmental impact.',
    content: `As climate change concerns grow globally, Concord Real Estate is committed to sustainable building practices that minimize environmental impact while delivering quality structures.

Our Green Building Approach:

1. **Energy-Efficient Design**
Our buildings incorporate passive design principles:
- Optimized orientation for natural light
- Cross-ventilation for reduced AC dependency
- High-performance insulation
- Double-glazed windows for thermal efficiency

2. **Water Conservation**
- Rainwater harvesting systems
- Greywater recycling for irrigation
- Low-flow fixtures reducing water consumption by 30%
- Permeable pavements for groundwater recharge

3. **Sustainable Materials**
- Locally sourced bricks and aggregates
- recycled steel and fly ash in concrete
- Bamboo and wood from certified sustainable sources
- Low-VOC paints and finishes

4. **Renewable Energy Integration**
- Solar panel installations on rooftops
- Solar water heating systems
- Energy-efficient LED lighting throughout
- Smart building management systems

5. **Waste Management**
- Construction waste recycling program
- Designated waste segregation areas
- Composting facilities for organic waste
- Partnership with certified waste management services

Certifications and Compliance:

Our projects comply with:
- Bangladesh National Building Code
- LEED (Leadership in Energy and Environmental Design) guidelines
- Local environmental regulations

Measurable Impact:

Since implementing our green initiatives in 2020:
- Reduced carbon footprint by 40% per project
- Achieved 35% energy savings in completed buildings
- Conserved 2 million liters of water annually
- Recycled 75% of construction waste

Future Goals:

By 2030, Concord aims to:
- Make all new projects net-zero energy ready
- Achieve 50% material recycling rate
- Install 1MW of solar capacity across projects
- Obtain green certification for all major projects

Sustainable building is not just about environmental responsibility—it's about creating healthier, more efficient spaces for our customers while protecting our planet for future generations.`,
    author: 'Environmental Team',
    date: 'May 5, 2026',
    category: 'Sustainability',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=500&fit=crop',
    readTime: '7 min read',
    featured: false
  },
  {
    id: 5,
    title: 'Investment Analysis: Dhaka Real Estate Market 2026',
    excerpt: 'A comprehensive analysis of current trends, opportunities, and forecasts for real estate investors in Dhaka.',
    content: `The Dhaka real estate market continues to show resilience and growth potential in 2026. This analysis examines key trends and opportunities for investors.

Market Overview:

The Dhaka metropolitan area real estate market is valued at approximately BDT 500,000 crore, growing at 8-10% annually. Key drivers include:
- Rapid urbanization (5% annual population growth)
- Limited land supply in prime areas
- Growing middle class with increased purchasing power
- Infrastructure developments (metro rail, expressways)

Prime Investment Areas:

1. **Gulshan & Banani**
- Average price: ৳25,000-35,000 per sqft
- ROI: 12-15% annually
- Best for: High-end residential, commercial
- Outlook: Continued appreciation expected

2. **Uttara**
- Average price: ৳12,000-18,000 per sqft
- ROI: 15-18% annually
- Best for: Mid-range residential
- Outlook: Rapid development with new metro connection

3. **Dhanmondi & Mohammadpur**
- Average price: ৳15,000-22,000 per sqft
- ROI: 10-12% annually
- Best for: Residential, mixed-use
- Outlook: Stable with steady demand

Investment Strategies:

1. **Buy and Hold**
- Purchase in developing areas
- Hold for 3-5 years
- Expected appreciation: 50-80%

2. **Rental Income**
- Properties near commercial areas yield 6-8% annual returns
- Gulshan/Banani: ৳80-120 per sqft monthly
- Uttara/Dhanmondi: ৳50-80 per sqft monthly

3. **Pre-Construction Investment**
- 20-30% below completion price
- Payment plans spread over 3-4 years
- Ideal for investors with regular income

Risks to Consider:

- Regulatory changes affecting foreign ownership
- Interest rate fluctuations
- Market oversupply in certain segments
- Construction delays affecting ROI

2026 Outlook:

The market is expected to remain bullish with:
- 8-10% price appreciation in prime areas
- Strong demand for quality residential units
- Commercial space demand growing with new businesses
- Infrastructure improvements boosting peripheral areas

Recommendation:

Diversification across different areas and property types is key to managing risk while maximizing returns. Consider both residential and commercial properties for a balanced portfolio.

At Concord, we offer investment advisory services to help clients make informed decisions based on their financial goals and risk appetite.`,
    author: 'Investment Research Team',
    date: 'May 3, 2026',
    category: 'Market Analysis',
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&h=500&fit=crop',
    readTime: '10 min read',
    featured: false
  },
  {
    id: 6,
    title: 'Concord Completes Landmark Dhaka Tower Project',
    excerpt: 'The 40-story Concord Tower in Dhaka\'s business district has been completed ahead of schedule, marking a new milestone for the company.',
    content: `Concord Real Estate & Engineering Ltd. is proud to announce the completion of Concord Tower, a 40-story commercial skyscraper in Kawran Bazar, Dhaka's central business district.

Project Highlights:

- Height: 150 meters
- Total Area: 500,000 sqft
- Construction Period: 4 years (completed 6 months ahead of schedule)
- Investment: ৳500 crore
- Capacity: 5,000 professionals

Key Features:

1. **Modern Office Spaces**
- Grade A office spaces ranging from 1,500 to 20,000 sqft
- Flexible floor plates for customization
- 15 high-speed elevators
- Intelligent building management system

2. **World-Class Amenities**
- Rooftop restaurant with panoramic city views
- 500-person capacity conference center
- Underground parking for 400 vehicles
- Fitness center and spa
- Prayer facilities

3. **Technology Integration**
- High-speed fiber optic connectivity
- Smart access control systems
- Energy-efficient central AC
- Power backup generators
- Fire suppression systems

The tower has already attracted major tenants including multinational corporations, financial institutions, and tech companies. 70% of the space has been leased, with full occupancy expected by Q3 2026.

Architectural Significance:

Designed by renowned architects, the tower's modern facade reflects Dhaka's emergence as a global city. The LEED Gold certified building incorporates sustainable features including:
- Solar panels on the rooftop
- Rainwater harvesting
- Energy-efficient glazing
- Smart lighting systems

Impact on Dhaka's Skyline:

Concord Tower joins the ranks of Bangladesh's tallest buildings, symbolizing the country's economic progress and architectural advancement. The project has created over 2,000 jobs during construction and will employ 500+ support staff in ongoing operations.

Project Director Engr. Mohammad Abdul Karim commented: "Completing this complex project ahead of schedule while maintaining the highest quality standards is a testament to Concord's engineering excellence and project management capabilities. This tower sets new benchmarks for commercial real estate in Bangladesh."

The tower is now open for viewing and lease inquiries. Contact our commercial sales team for more information.`,
    author: 'Project Communications',
    date: 'May 1, 2026',
    category: 'Company News',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=500&fit=crop',
    readTime: '5 min read',
    featured: false
  }
];

function Blog() {
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('concord_blog');
    return saved ? JSON.parse(saved) : defaultArticles;
  });
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('concord_blog', JSON.stringify(articles));
  }, [articles]);

  const categories = ['All', ...new Set(articles.map(a => a.category))];

  const filteredArticles = articles.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticles = articles.filter(a => a.featured);

  if (selectedArticle) {
    return (
      <article className="blog-article-full">
        <div className="article-header">
          <button className="back-btn" onClick={() => setSelectedArticle(null)}>
            ← Back to Articles
          </button>
          <span className="article-category-badge">{selectedArticle.category}</span>
        </div>

        <div className="article-hero">
          <img src={selectedArticle.image} alt={selectedArticle.title} className="article-hero-image" />
          <div className="article-hero-overlay">
            <h1 className="article-title-full">{selectedArticle.title}</h1>
            <div className="article-meta-full">
              <span className="article-author">By {selectedArticle.author}</span>
              <span className="article-date">{selectedArticle.date}</span>
              <span className="article-read-time">{selectedArticle.readTime}</span>
            </div>
          </div>
        </div>

        <div className="article-content-full">
          <p className="article-excerpt-full">{selectedArticle.excerpt}</p>

          <div className="article-body">
            {selectedArticle.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={index} className="article-list">
                    {selectedArticle.content.split('\n\n').slice(index).filter(p => p.startsWith('-')).map((item, i) => (
                      <li key={i}>{item.replace(/^- /, '').replace(/^\d+\. /, '')}</li>
                    ))}
                  </ul>
                );
              }
              if (paragraph.match(/^\d+\./)) {
                return (
                  <ol key={index} className="article-list">
                    {selectedArticle.content.split('\n\n').slice(index).filter(p => p.match(/^\d+\./)).map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\. /, '')}</li>
                    ))}
                  </ol>
                );
              }
              if (paragraph.startsWith('**')) {
                return <h3 key={index} className="article-subheading">{paragraph.replace(/\*\*/g, '')}</h3>;
              }
              return <p key={index} className="article-paragraph">{paragraph}</p>;
            })}
          </div>

          <div className="article-footer-full">
            <div className="article-tags">
              <span className="tag">{selectedArticle.category}</span>
              <span className="tag">Real Estate</span>
              <span className="tag">Bangladesh</span>
            </div>

            <div className="article-share">
              <span className="share-label">Share this article:</span>
              <button className="share-btn">📧</button>
              <button className="share-btn">🔗</button>
              <button className="share-btn">📘</button>
            </div>
          </div>
        </div>

        <div className="related-articles">
          <h3>Related Articles</h3>
          <div className="related-grid">
            {articles
              .filter(a => a.category === selectedArticle.category && a.id !== selectedArticle.id)
              .slice(0, 3)
              .map(article => (
                <div
                  key={article.id}
                  className="related-card"
                  onClick={() => setSelectedArticle(article)}
                >
                  <img src={article.image} alt={article.title} className="related-image" />
                  <h4>{article.title}</h4>
                  <p>{article.excerpt.substring(0, 100)}...</p>
                </div>
              ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="blog-section">
      <div className="blog-header">
        <h1>Concord Insights</h1>
        <p>News, guides, and updates from Bangladesh's real estate sector</p>
      </div>

      {featuredArticles.length > 0 && (
        <div className="featured-section">
          <h2>Featured Article</h2>
          <div className="featured-card" onClick={() => setSelectedArticle(featuredArticles[0])}>
            <div className="featured-image-wrapper">
              <img src={featuredArticles[0].image} alt={featuredArticles[0].title} className="featured-image" />
              <span className="featured-badge">⭐ Featured</span>
            </div>
            <div className="featured-content">
              <span className="article-category">{featuredArticles[0].category}</span>
              <h2>{featuredArticles[0].title}</h2>
              <p>{featuredArticles[0].excerpt}</p>
              <div className="article-meta">
                <span>👤 {featuredArticles[0].author}</span>
                <span>📅 {featuredArticles[0].date}</span>
                <span>⏱️ {featuredArticles[0].readTime}</span>
              </div>
              <button className="read-more-btn">Read Full Article →</button>
            </div>
          </div>
        </div>
      )}

      <div className="blog-controls">
        <div className="blog-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="blog-search-input"
          />
        </div>

        <div className="category-tabs">
          {categories.map(category => (
            <button
              key={category}
              className={`category-tab ${selectedCategory === category ? 'category-active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="articles-grid">
        {filteredArticles.map((article, index) => (
          <article
            key={article.id}
            className="blog-card"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedArticle(article)}
          >
            <div className="blog-image-wrapper">
              <img src={article.image} alt={article.title} className="blog-card-image" />
              <span className="article-category-pill">{article.category}</span>
            </div>

            <div className="blog-card-content">
              <h3 className="blog-card-title">{article.title}</h3>
              <p className="blog-card-excerpt">{article.excerpt}</p>

              <div className="blog-card-meta">
                <span className="meta-item">👤 {article.author}</span>
                <span className="meta-item">📅 {article.date}</span>
                <span className="meta-item">⏱️ {article.readTime}</span>
              </div>

              <button className="blog-card-cta">Read More →</button>
            </div>
          </article>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="blog-no-results">
          <span className="no-results-icon">📝</span>
          <h3>No articles found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      )}
    </section>
  );
}

export default Blog;
