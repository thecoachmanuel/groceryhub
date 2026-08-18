export type PermissionAction = 'can_view' | 'can_add' | 'can_edit' | 'can_delete';

export type PermissionCategory =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'stock'
  | 'categories'
  | 'coupons'
  | 'banners'
  | 'delivery_boys'
  | 'sellers'
  | 'customers'
  | 'feedback'
  | 'reports'
  | 'settings'
  | 'system_users';

export interface RolePermission {
  perm_cat: PermissionCategory;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface SystemRole {
  id: number;
  name: string;
  description: string;
  isSuperAdmin: boolean;
  permissions: RolePermission[];
}

export const DEFAULT_ROLES: SystemRole[] = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Unrestricted full access across all platform operations and settings',
    isSuperAdmin: true,
    permissions: [
      { perm_cat: 'dashboard', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'orders', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'products', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'stock', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'categories', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'coupons', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'banners', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'delivery_boys', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'sellers', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'customers', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'feedback', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'reports', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'settings', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'system_users', can_view: true, can_add: true, can_edit: true, can_delete: true },
    ],
  },
  {
    id: 2,
    name: 'Logistics & Dispatch Manager',
    description: 'Manage order deliveries, driver fleets, cash collection, and timeslots',
    isSuperAdmin: false,
    permissions: [
      { perm_cat: 'dashboard', can_view: true, can_add: false, can_edit: false, can_delete: false },
      { perm_cat: 'orders', can_view: true, can_add: true, can_edit: true, can_delete: false },
      { perm_cat: 'delivery_boys', can_view: true, can_add: true, can_edit: true, can_delete: false },
      { perm_cat: 'reports', can_view: true, can_add: false, can_edit: false, can_delete: false },
      { perm_cat: 'products', can_view: false, can_add: false, can_edit: false, can_delete: false },
      { perm_cat: 'settings', can_view: false, can_add: false, can_edit: false, can_delete: false },
    ],
  },
  {
    id: 3,
    name: 'Catalog & Inventory Specialist',
    description: 'Manage products, stock inventories, categories, brands, and badge tags',
    isSuperAdmin: false,
    permissions: [
      { perm_cat: 'dashboard', can_view: true, can_add: false, can_edit: false, can_delete: false },
      { perm_cat: 'products', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'stock', can_view: true, can_add: true, can_edit: true, can_delete: false },
      { perm_cat: 'categories', can_view: true, can_add: true, can_edit: true, can_delete: true },
      { perm_cat: 'coupons', can_view: true, can_add: true, can_edit: true, can_delete: false },
      { perm_cat: 'banners', can_view: true, can_add: true, can_edit: true, can_delete: false },
    ],
  },
  {
    id: 4,
    name: 'Customer Support Representative',
    description: 'Handle customer return claims, feedback ratings, and user accounts',
    isSuperAdmin: false,
    permissions: [
      { perm_cat: 'dashboard', can_view: true, can_add: false, can_edit: false, can_delete: false },
      { perm_cat: 'orders', can_view: true, can_add: false, can_edit: true, can_delete: false },
      { perm_cat: 'customers', can_view: true, can_add: false, can_edit: true, can_delete: false },
      { perm_cat: 'feedback', can_view: true, can_add: false, can_edit: true, can_delete: true },
    ],
  },
];

/**
 * Checks whether a given role has permission for a specific category and action.
 * Equivalent to CI4 permission_helper (can_view, can_add, can_edit, can_delete).
 */
export function hasPermission(
  role: SystemRole | null | undefined,
  category: PermissionCategory,
  action: PermissionAction = 'can_view'
): boolean {
  if (!role) return false;
  if (role.isSuperAdmin) return true;

  const perm = role.permissions?.find((p) => p.perm_cat === category);
  if (!perm) return false;

  return !!perm[action];
}
