const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const mongoose = require('mongoose');

const uri = 'mongodb+srv://groceryhub:ooydl4ZOrDUakClM@cluster0.8r3acxq.mongodb.net/groceryhub?appName=Cluster0';

async function seedPages() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log('Seeding CMS Pages into MongoDB Atlas...');

  const pages = [
    {
      slug: 'about-us',
      title: 'About GroceryHub Nigeria',
      content: `
        <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #16a34a; font-size: 22px;">Welcome to GroceryHub Nigeria</h2>
          <p>GroceryHub is Nigeria's leading farm-to-table digital grocery marketplace. We bring fresh, organic produce, farm dairy, bakery essentials, and household goods straight from local African farms to your doorstep in 30 minutes.</p>
          <h3 style="color: #0f172a; margin-top: 20px;">Our Promise</h3>
          <ul>
            <li><strong>100% Farm Fresh Guarantee:</strong> Handpicked daily directly from verified organic farms in Lagos, Epe, and Ogun state.</li>
            <li><strong>Cold Chain Delivery:</strong> Temperature-controlled delivery fleet ensuring maximum freshness.</li>
            <li><strong>Fast 30-Minute Dispatch:</strong> Rapid order fulfillment from neighborhood micro-hubs.</li>
          </ul>
        </div>
      `,
      createdAt: new Date(),
    },
    {
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      content: `
        <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #16a34a; font-size: 22px;">GroceryHub Privacy Policy</h2>
          <p>At GroceryHub Nigeria, accessible from groceryhub-ng.vercel.app, one of our main priorities is the privacy of our visitors and customers. This Privacy Policy document contains types of information that is collected and recorded by GroceryHub and how we use it.</p>
          <h3 style="color: #0f172a; margin-top: 20px;">Information We Collect</h3>
          <p>When you register for an Account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number.</p>
          <h3 style="color: #0f172a; margin-top: 20px;">Data Security</h3>
          <p>We use industry-standard SSL encryption and secure cloud database servers to protect your personal information against unauthorized access.</p>
        </div>
      `,
      createdAt: new Date(),
    },
    {
      slug: 'terms-conditions',
      title: 'Terms & Conditions',
      content: `
        <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #16a34a; font-size: 22px;">Terms & Conditions</h2>
          <p>These terms and conditions outline the rules and regulations for the use of GroceryHub Nigeria's Website and Mobile Application.</p>
          <h3 style="color: #0f172a; margin-top: 20px;">License & Usage</h3>
          <p>Unless otherwise stated, GroceryHub Nigeria and/or its licensors own the intellectual property rights for all material on GroceryHub. All intellectual property rights are reserved.</p>
          <h3 style="color: #0f172a; margin-top: 20px;">User Accounts</h3>
          <p>You must maintain the confidentiality of your account credentials and notify us immediately of any unauthorized activity.</p>
        </div>
      `,
      createdAt: new Date(),
    },
    {
      slug: 'refund-policy',
      title: 'Refund & Return Policy',
      content: `
        <div style="font-family: sans-serif; padding: 16px; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #16a34a; font-size: 22px;">Refund & Return Policy</h2>
          <p>We stand behind the freshness and quality of every item delivered by GroceryHub. If you receive damaged, expired, or unsatisfactory produce, we offer instant replacements or full refunds to your GroceryHub wallet.</p>
          <h3 style="color: #0f172a; margin-top: 20px;">How to Request a Refund</h3>
          <p>Navigate to My Orders in the app menu, select the item order, and tap Request Refund within 24 hours of delivery.</p>
        </div>
      `,
      createdAt: new Date(),
    },
    {
      slug: 'contact-us',
      title: 'Contact Us',
      content: 'Contact info',
      meta_data: {
        business_name: 'GroceryHub Nigeria Ltd',
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        phone: '+234 800 476 2379',
        email: 'support@groceryhub.ng',
        social_link: [
          { link: 'https://instagram.com/groceryhub_ng', appIcon: 'logo-instagram' },
          { link: 'https://twitter.com/groceryhub_ng', appIcon: 'logo-twitter' },
          { link: 'https://facebook.com/groceryhubng', appIcon: 'logo-facebook' },
          { link: 'https://wa.me/2348004762379', appIcon: 'logo-whatsapp' },
        ],
      },
      createdAt: new Date(),
    },
  ];

  await db.collection('pages').deleteMany({});
  await db.collection('pages').insertMany(pages);
  console.log('Seeded CMS Pages successfully!');

  await mongoose.disconnect();
}

seedPages().catch(console.error);
