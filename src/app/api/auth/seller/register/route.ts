import { NextRequest } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { apiSuccess, apiError } from '@/lib/api-response';
import { connectToDatabase } from '@/lib/mongodb';
import Seller from '@/models/Seller';
import { hashPassword } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, store_name, email, mobile, password, address, city, tax_id_ein, bank_name, bank_account_number } = body;

    if (!name || !store_name || !email || !mobile || !password) {
      return apiError('Name, Store Name, Email, Mobile, and Password are required', 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanMobile = mobile.trim();

    await connectToDatabase();

    const existing = await Seller.findOne({
      $or: [{ email: cleanEmail }, { mobile: cleanMobile }],
    });

    if (existing) {
      return apiError('A vendor account with this email or mobile already exists. Please log in.', 409);
    }

    const hashedPassword = await hashPassword(password);
    const sellerId = Date.now();

    const newSeller = await Seller.create({
      seller_id: sellerId,
      name: name.trim(),
      store_name: store_name.trim(),
      email: cleanEmail,
      mobile: cleanMobile,
      password: hashedPassword,
      address: address || '',
      city: city || 'Lagos',
      tax_id_ein: tax_id_ein || '',
      bank_name: bank_name || '',
      bank_account_number: bank_account_number || '',
      commission_rate: 5,
      balance: 0,
      status: 'approved',
    });

    const token = generateToken({
      id: newSeller.seller_id,
      role: 'seller',
      email: newSeller.email,
      mobile: newSeller.mobile,
    });

    return apiSuccess(
      {
        token,
        seller: {
          id: newSeller.seller_id,
          name: newSeller.name,
          store_name: newSeller.store_name,
          email: newSeller.email,
          mobile: newSeller.mobile,
          balance: newSeller.balance,
          commission_rate: newSeller.commission_rate,
          status: newSeller.status,
        },
      },
      'Vendor account registered and approved successfully!'
    );
  } catch (error: any) {
    console.error('Seller registration error:', error);
    return apiError(error?.message || 'Vendor registration failed', 500);
  }
}
