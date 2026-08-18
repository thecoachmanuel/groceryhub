'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  Users, 
  Lock 
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { DEFAULT_ROLES, SystemRole, PermissionCategory, PermissionAction } from '@/lib/permissions';

interface StaffUser {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  status: 'Active' | 'Inactive';
}

const PERMISSION_CATEGORIES: { key: PermissionCategory; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard & Analytics' },
  { key: 'orders', label: 'Order Dispatch & Tracking' },
  { key: 'products', label: 'Product Catalog & Pricing' },
  { key: 'stock', label: 'Stock & Inventory Control' },
  { key: 'categories', label: 'Categories & Subcategories' },
  { key: 'coupons', label: 'Coupons & Promotions' },
  { key: 'banners', label: 'Banners, Highlights & Layouts' },
  { key: 'delivery_boys', label: 'Courier Fleet & Cash Collection' },
  { key: 'sellers', label: 'Vendors & Store Management' },
  { key: 'customers', label: 'Customer Accounts & Wallets' },
  { key: 'feedback', label: 'Ratings & Customer Reviews' },
  { key: 'reports', label: 'Financial & POS Sales Reports' },
  { key: 'settings', label: 'System Settings & Gateways' },
  { key: 'system_users', label: 'Staff Roles & RBAC Security' },
];

export default function AdminSystemUsersPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'roles'>('staff');
  const [staff, setStaff] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<SystemRole[]>(DEFAULT_ROLES);

  // Staff Modal State
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffUser | null>(null);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffMobile, setStaffMobile] = useState('');
  const [staffRole, setStaffRole] = useState('Manager');
  const [staffStatus, setStaffStatus] = useState<'Active' | 'Inactive'>('Active');

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<SystemRole | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [rolePermissions, setRolePermissions] = useState<Record<string, { can_view: boolean; can_add: boolean; can_edit: boolean; can_delete: boolean }>>({});

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/system-users');
      const data = await res.json();
      if (data.success) {
        setStaff(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching system users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Open Staff Modal
  const openCreateStaffModal = () => {
    setEditingStaff(null);
    setStaffName('');
    setStaffEmail('');
    setStaffMobile('');
    setStaffRole('Manager');
    setStaffStatus('Active');
    setIsStaffModalOpen(true);
  };

  const openEditStaffModal = (u: StaffUser) => {
    setEditingStaff(u);
    setStaffName(u.name);
    setStaffEmail(u.email);
    setStaffMobile(u.mobile || '');
    setStaffRole(u.role || 'Manager');
    setStaffStatus(u.status || 'Active');
    setIsStaffModalOpen(true);
  };

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await fetch('/api/admin/system-users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingStaff._id, name: staffName, email: staffEmail, mobile: staffMobile, role: staffRole, status: staffStatus }),
        });
      } else {
        await fetch('/api/admin/system-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: staffName, email: staffEmail, mobile: staffMobile, role: staffRole, status: staffStatus }),
        });
      }
      setIsStaffModalOpen(false);
      fetchStaff();
    } catch (err) {
      console.error('Error saving staff:', err);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff user?')) return;
    try {
      await fetch(`/api/admin/system-users?id=${id}`, { method: 'DELETE' });
      fetchStaff();
    } catch (err) {
      console.error('Error deleting staff:', err);
    }
  };

  // Open Role Modal
  const openCreateRoleModal = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDesc('');
    const initialPerms: Record<string, any> = {};
    PERMISSION_CATEGORIES.forEach((c) => {
      initialPerms[c.key] = { can_view: false, can_add: false, can_edit: false, can_delete: false };
    });
    setRolePermissions(initialPerms);
    setIsRoleModalOpen(true);
  };

  const openEditRoleModal = (role: SystemRole) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDesc(role.description);
    const mappedPerms: Record<string, any> = {};
    PERMISSION_CATEGORIES.forEach((c) => {
      const existing = role.permissions.find((p) => p.perm_cat === c.key);
      mappedPerms[c.key] = {
        can_view: existing?.can_view || false,
        can_add: existing?.can_add || false,
        can_edit: existing?.can_edit || false,
        can_delete: existing?.can_delete || false,
      };
    });
    setRolePermissions(mappedPerms);
    setIsRoleModalOpen(true);
  };

  const togglePermissionCheckbox = (catKey: string, action: PermissionAction) => {
    setRolePermissions((prev) => ({
      ...prev,
      [catKey]: {
        ...prev[catKey],
        [action]: !prev[catKey]?.[action],
      },
    }));
  };

  const handleRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleName.trim()) return alert('Role name is required');

    const formattedPerms = PERMISSION_CATEGORIES.map((c) => ({
      perm_cat: c.key,
      can_view: !!rolePermissions[c.key]?.can_view,
      can_add: !!rolePermissions[c.key]?.can_add,
      can_edit: !!rolePermissions[c.key]?.can_edit,
      can_delete: !!rolePermissions[c.key]?.can_delete,
    }));

    if (editingRole) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                name: roleName,
                description: roleDesc,
                permissions: formattedPerms,
              }
            : r
        )
      );
    } else {
      const newRole: SystemRole = {
        id: Date.now(),
        name: roleName,
        description: roleDesc,
        isSuperAdmin: false,
        permissions: formattedPerms,
      };
      setRoles([...roles, newRole]);
    }
    setIsRoleModalOpen(false);
  };

  return (
    <div className="flex bg-[#121820] text-white min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              <Shield size={24} className="text-[#0aad0a]" /> System Users &amp; Role-Based Access Control (RBAC)
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Manage staff sub-admins and configure granular View, Add, Edit, and Delete privileges per module
            </p>
          </div>

          <div className="flex gap-2">
            {activeTab === 'staff' ? (
              <button
                onClick={openCreateStaffModal}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Add Staff User</span>
              </button>
            ) : (
              <button
                onClick={openCreateRoleModal}
                className="bg-[#0aad0a] hover:bg-[#088f08] text-white text-xs font-black px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#0aad0a]/30 transition-all active:scale-95"
              >
                <Plus size={16} />
                <span>Create New Role</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#1e2632] border border-gray-800 p-1.5 rounded-2xl w-fit text-xs font-bold">
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'staff'
                ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={15} />
            <span>Staff Members ({staff.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-[#0aad0a] text-white shadow-md shadow-[#0aad0a]/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Lock size={15} />
            <span>Roles &amp; Permissions Matrix ({roles.length})</span>
          </button>
        </div>

        {/* Tab 1: Staff Members */}
        {activeTab === 'staff' && (
          <div className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 overflow-hidden space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-400 text-xs">Loading staff users...</div>
            ) : staff.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-xs">No staff users found. Click Add Staff User to create one.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="pb-3 px-3">Staff Name</th>
                      <th className="pb-3 px-3">Email Address</th>
                      <th className="pb-3 px-3">Assigned Role</th>
                      <th className="pb-3 px-3">Status</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 font-medium text-gray-300">
                    {staff.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-800/40 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-white text-sm">{u.name}</td>
                        <td className="py-3.5 px-3 text-gray-400 font-mono">{u.email}</td>
                        <td className="py-3.5 px-3">
                          <span className="bg-purple-950/60 text-purple-300 border border-purple-800/40 px-2.5 py-1 rounded-lg font-bold">
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              u.status === 'Active'
                                ? 'bg-emerald-950/40 text-[#0aad0a] border border-[#0aad0a]/30'
                                : 'bg-gray-800 text-gray-400'
                            }`}
                          >
                            ● {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditStaffModal(u)}
                              className="p-1.5 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => u._id && handleDeleteStaff(u._id)}
                              className="p-1.5 hover:bg-red-950/40 rounded-lg text-gray-400 hover:text-red-400"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Roles & Permissions Matrix */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((r) => (
              <div
                key={r.id}
                className="bg-[#1e2632] border border-gray-800 rounded-3xl p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-black text-base text-white flex items-center gap-2">
                      <span>{r.name}</span>
                      {r.isSuperAdmin && (
                        <span className="text-[10px] font-black bg-amber-950/60 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded-md">
                          Full Root
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{r.description}</p>
                  </div>

                  {!r.isSuperAdmin && (
                    <button
                      onClick={() => openEditRoleModal(r)}
                      className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>

                {/* Permissions Summary Badges */}
                <div className="space-y-2 pt-2 border-t border-gray-800/60">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                    Assigned Privileges
                  </span>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {r.isSuperAdmin ? (
                      <div className="col-span-2 text-emerald-400 font-bold bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/40 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Full View / Add / Edit / Delete access on all 14 modules
                      </div>
                    ) : (
                      PERMISSION_CATEGORIES.map((c) => {
                        const perm = r.permissions.find((p) => p.perm_cat === c.key);
                        if (!perm?.can_view) return null;
                        return (
                          <div
                            key={c.key}
                            className="bg-gray-900/70 border border-gray-800 p-2 rounded-xl flex items-center justify-between"
                          >
                            <span className="font-semibold text-gray-300 truncate">{c.label}</span>
                            <div className="flex gap-1 text-[9px] font-mono font-bold">
                              {perm.can_view && <span className="text-emerald-400">V</span>}
                              {perm.can_add && <span className="text-blue-400">A</span>}
                              {perm.can_edit && <span className="text-amber-400">E</span>}
                              {perm.can_delete && <span className="text-red-400">D</span>}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Staff Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-md rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative">
            <button
              onClick={() => setIsStaffModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingStaff ? 'Edit Staff User' : 'Add Staff User'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">Assign name, email, and staff role</p>
            </div>

            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Staff Full Name</label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Liam O’Connor"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="liam@groceryhub.com"
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Assigned Role</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Account Status</label>
                <select
                  value={staffStatus}
                  onChange={(e) => setStaffStatus(e.target.value as any)}
                  className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingStaff ? 'Save Staff Member' : 'Create Staff Member'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role & Granular Permissions Matrix Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e2632] w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setIsRoleModalOpen(false)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-gray-800 text-gray-400"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-black">{editingRole ? 'Edit Role Permissions Matrix' : 'Create New System Role'}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Set granular View, Add, Edit, and Delete permissions across modules
              </p>
            </div>

            <form onSubmit={handleRoleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Role Title</label>
                  <input
                    type="text"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    placeholder="e.g. Produce Inventory Coordinator"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">Role Summary Description</label>
                  <input
                    type="text"
                    value={roleDesc}
                    onChange={(e) => setRoleDesc(e.target.value)}
                    placeholder="e.g. Manages fresh vegetable batches and stocks"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-[#0aad0a]"
                  />
                </div>
              </div>

              {/* Matrix Table */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 block">Granular Access Control Matrix</label>
                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-950/80 text-gray-400 font-bold uppercase text-[10px] border-b border-gray-800">
                      <tr>
                        <th className="py-2.5 px-4">System Module</th>
                        <th className="py-2.5 px-3 text-center">View</th>
                        <th className="py-2.5 px-3 text-center">Add</th>
                        <th className="py-2.5 px-3 text-center">Edit</th>
                        <th className="py-2.5 px-3 text-center">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {PERMISSION_CATEGORIES.map((c) => {
                        const cur = rolePermissions[c.key] || { can_view: false, can_add: false, can_edit: false, can_delete: false };
                        return (
                          <tr key={c.key} className="hover:bg-gray-800/30">
                            <td className="py-2 px-4 font-semibold text-gray-200">{c.label}</td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={cur.can_view}
                                onChange={() => togglePermissionCheckbox(c.key, 'can_view')}
                                className="w-4 h-4 rounded text-[#0aad0a] bg-gray-950 border-gray-700 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={cur.can_add}
                                onChange={() => togglePermissionCheckbox(c.key, 'can_add')}
                                className="w-4 h-4 rounded text-[#0aad0a] bg-gray-950 border-gray-700 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={cur.can_edit}
                                onChange={() => togglePermissionCheckbox(c.key, 'can_edit')}
                                className="w-4 h-4 rounded text-[#0aad0a] bg-gray-950 border-gray-700 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={cur.can_delete}
                                onChange={() => togglePermissionCheckbox(c.key, 'can_delete')}
                                className="w-4 h-4 rounded text-[#0aad0a] bg-gray-950 border-gray-700 focus:ring-0 cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#0aad0a] hover:bg-[#088f08] text-white font-black py-3.5 rounded-xl text-xs shadow-lg shadow-[#0aad0a]/30 transition-all"
                >
                  {editingRole ? 'Update Role Matrix' : 'Create Role'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-6 py-3.5 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
