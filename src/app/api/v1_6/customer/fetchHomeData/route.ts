import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const cityId = body?.city_id || 1;

    const mockHomeData = {
      status: 200,
      result: 'true',
      message: 'Home data fetched successfully',
      data: {
        banners: [
          {
            id: 1,
            image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
            redirect_type: 'category',
            redirect_id: 1,
          },
          {
            id: 2,
            image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800',
            redirect_type: 'product',
            redirect_id: 101,
          },
        ],
        categories: [
          { id: 1, name: 'Vegetables', slug: 'vegetables', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300' },
          { id: 2, name: 'Fruits', slug: 'fruits', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300' },
          { id: 3, name: 'Dairy & Eggs', slug: 'dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300' },
          { id: 4, name: 'Bakery', slug: 'bakery', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300' },
        ],
        sections: [
          {
            id: 1,
            title: 'Deal of the Day',
            style_type: 'horizontal',
            products: [
              {
                id: 1,
                name: 'Fresh Organic Farm Broccoli',
                slug: 'fresh-organic-broccoli',
                image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500',
                rating: 4.9,
                price: 3500,
                original_price: 4900,
              },
              {
                id: 2,
                name: 'Red Sweet Crisp Apples',
                slug: 'red-sweet-apples',
                image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500',
                rating: 4.8,
                price: 4500,
                original_price: 5900,
              },
            ],
          },
        ],
      },
    };

    return NextResponse.json(mockHomeData);
  } catch (error: any) {
    return NextResponse.json(
      { status: 500, result: 'false', message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}
