import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, X, LogOut, Search,
  Package, UserPlus, Shield, Eye, EyeOff,
  ChevronDown, AlertTriangle, Check, Image, Users, Crown,
} from 'lucide-react';
import { productApi } from '@/entities/product';
import { adminApi } from '@/features/auth';
import type { AdminUser } from '@/features/auth/api/adminApi';
import { useAuth } from '@/shared/hooks/useAuth';
import { useDebounce } from '@/shared/hooks/useDebounce';
import type { Product } from '@/shared/types';
import { SkeletonTableRow } from '@/shared/ui/Skeleton';

const CATEGORIES = ['Все', 'Молоко', 'Кефир', 'Сметана', 'Творог', 'Масло', 'Сыр', 'Йогурт'];

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  fat: string;
  weight: string;
  image: string;
}

const emptyForm: ProductForm = {
  name: '', description: '', price: '', category: '', fat: '', weight: '', image: '',
};

const inputCls = 'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all';

export const AdminPage = () => {
  const { logout, isSuperAdmin, adminId } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('Все');

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPw, setShowAdminPw] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');
  const [adminSaving, setAdminSaving] = useState(false);

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [deleteAdminConfirm, setDeleteAdminConfirm] = useState<number | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productApi.getAll({ limit: 200 });
      setProducts(data.products);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAdminUsers = useCallback(async () => {
    setAdminUsersLoading(true);
    try {
      const data = await adminApi.getUsers();
      setAdminUsers(data);
    } catch {
      setAdminUsers([]);
    } finally {
      setAdminUsersLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); fetchAdminUsers(); }, [fetchProducts, fetchAdminUsers]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    let list = products;
    if (filterCat !== 'Все') list = list.filter((p) => p.category === filterCat);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, filterCat, debouncedSearch]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['Все', ...Array.from(cats).sort()];
  }, [products]);

  const handleLogout = () => { logout(); navigate('/'); };

  const showToast = (msg: string, type: 'ok' | 'err') => setToast({ msg, type });

  const openCreate = () => {
    setForm(emptyForm); setEditingId(null); setFormError(''); setShowProductModal(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      category: product.category,
      fat: product.fat ? String(product.fat) : '',
      weight: product.weight ? String(product.weight) : '',
      image: product.image || '',
    });
    setEditingId(product.id);
    setFormError('');
    setShowProductModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(''); setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        category: form.category,
        fat: form.fat ? parseFloat(form.fat) : undefined,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        image: form.image || undefined,
      };
      if (editingId) {
        await productApi.update(editingId, payload as Partial<Product>);
        showToast('Продукт обновлён', 'ok');
      } else {
        await productApi.create(payload as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
        showToast('Продукт создан', 'ok');
      }
      setShowProductModal(false);
      fetchProducts();
    } catch {
      setFormError('Ошибка сохранения продукта');
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (showDeleteConfirm === null) return;
    setDeleting(true);
    try {
      await productApi.delete(showDeleteConfirm);
      showToast('Продукт удалён', 'ok');
      setShowDeleteConfirm(null);
      fetchProducts();
    } catch {
      showToast('Ошибка удаления', 'err');
    } finally { setDeleting(false); }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(''); setAdminSuccess(''); setAdminSaving(true);
    try {
      await adminApi.createUser(adminLogin, adminPassword);
      setAdminSuccess(`Администратор «${adminLogin}» создан`);
      setAdminLogin(''); setAdminPassword('');
      fetchAdminUsers();
    } catch {
      setAdminError('Ошибка создания администратора');
    } finally { setAdminSaving(false); }
  };

  const handleDeleteAdmin = async () => {
    if (deleteAdminConfirm === null) return;
    setDeletingAdmin(true);
    try {
      await adminApi.deleteUser(deleteAdminConfirm);
      showToast('Администратор удалён', 'ok');
      setDeleteAdminConfirm(null);
      fetchAdminUsers();
    } catch {
      showToast('Ошибка удаления администратора', 'err');
    } finally { setDeletingAdmin(false); }
  };

  const deleteAdminName = deleteAdminConfirm !== null
    ? adminUsers.find((a) => a.id === deleteAdminConfirm)?.login || ''
    : '';

  const updateField = (field: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const deleteName = showDeleteConfirm !== null
    ? products.find((p) => p.id === showDeleteConfirm)?.name || ''
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      {/* ===== Toast ===== */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 animate-slide-right flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
          {toast.type === 'ok' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ===== Header ===== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Панель администратора</h1>
          <p className="text-sm text-gray-500 mt-1">Управление товарами и администраторами</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={openCreate} className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> Новый товар
          </button>
          {isSuperAdmin && (
            <button onClick={() => { setShowAdminModal(true); setAdminError(''); setAdminSuccess(''); setAdminLogin(''); setAdminPassword(''); }}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" /> Новый админ
            </button>
          )}
          <button onClick={handleLogout} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </div>

      {/* ===== Filters ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Быстрый поиск по названию, описанию..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="appearance-none px-4 py-2.5 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer min-w-[160px]"
            >
              {(CATEGORIES.some((c) => !categories.includes(c)) ? categories : CATEGORIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Показано: {filtered.length} из {products.length} товаров
        </div>
      </div>

      {/* ===== Table ===== */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase w-12">ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Фото</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Название</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Категория</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Цена</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Жирн.</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Вес</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase w-28">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonTableRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase w-12">ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Фото</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Название</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Категория</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Цена</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Жирн.</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Вес</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase w-28">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-5 py-3 text-xs text-gray-400 font-mono">#{product.id}</td>
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                        {product.image ? (
                          <img src={product.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Image className="w-4 h-4 text-gray-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</div>
                      {product.description && (
                        <div className="text-xs text-gray-400 line-clamp-1 mt-0.5 max-w-[200px]">{product.description}</div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">{product.category}</span>
                    </td>
                    <td className="px-5 py-3 text-sm font-bold text-gray-900">{Number(product.price).toFixed(0)} ₽</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{product.fat ? `${product.fat}%` : '—'}</td>
                    <td className="px-5 py-3 text-xs text-gray-500">{product.weight ? `${product.weight} г` : '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(product)} title="Редактировать"
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowDeleteConfirm(product.id)} title="Удалить"
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 font-medium">Ничего не найдено</p>
                      {(search || filterCat !== 'Все') && (
                        <button onClick={() => { setSearch(''); setFilterCat('Все'); }}
                          className="mt-3 text-sm text-primary font-semibold hover:underline">
                          Сбросить фильтры
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Administrators Section ===== */}
      <div className="mt-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Администраторы</h2>
            <p className="text-xs text-gray-400">Управление учётными записями</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase w-12">ID</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Логин</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Роль</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase">Создан</th>
                  {isSuperAdmin && (
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase w-24">Действия</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {adminUsersLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={isSuperAdmin ? 5 : 4} className="px-5 py-4">
                        <div className="h-4 bg-gray-100 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : adminUsers.length === 0 ? (
                  <tr>
                    <td colSpan={isSuperAdmin ? 5 : 4} className="px-5 py-12 text-center">
                      <Shield className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 font-medium text-sm">Нет администраторов</p>
                    </td>
                  </tr>
                ) : (
                  adminUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-3 text-xs text-gray-400 font-mono">#{user.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${user.role === 'SUPER_ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>
                            {user.login.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{user.login}</span>
                          {user.id === adminId && (
                            <span className="text-[10px] font-medium bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded">вы</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {user.role === 'SUPER_ADMIN' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg">
                            <Crown className="w-3 h-3" /> Super Admin
                          </span>
                        ) : (
                          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">Admin</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      {isSuperAdmin && (
                        <td className="px-5 py-3">
                          <div className="flex justify-end">
                            {user.role !== 'SUPER_ADMIN' && user.id !== adminId ? (
                              <button
                                onClick={() => setDeleteAdminConfirm(user.id)}
                                title="Удалить"
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-60 group-hover:opacity-100"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="p-2 text-gray-300">
                                <Shield className="w-4 h-4" />
                              </span>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===== Delete Admin Confirmation ===== */}
      {deleteAdminConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteAdminConfirm(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Удалить администратора?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Учётная запись «{deleteAdminName}» будет удалена безвозвратно.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDeleteAdmin} disabled={deletingAdmin}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deletingAdmin ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Trash2 className="w-4 h-4" /> Удалить</>}
              </button>
              <button onClick={() => setDeleteAdminConfirm(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Product Modal ===== */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowProductModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
            <div className="h-1.5 bg-gradient-to-r from-primary to-emerald-400" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? 'Редактировать товар' : 'Новый товар'}
                </h2>
                <button onClick={() => setShowProductModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">{formError}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Название *</label>
                  <input type="text" value={form.name} onChange={(e) => updateField('name', e.target.value)} required placeholder="Молоко цельное 3.2%" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Описание</label>
                  <textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={3} placeholder="Натуральное цельное молоко..." className={`${inputCls} resize-none`} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Цена (₽) *</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)} required placeholder="89.90" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Категория *</label>
                    <input type="text" value={form.category} onChange={(e) => updateField('category', e.target.value)} required placeholder="Молоко" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Жирность (%)</label>
                    <input type="number" step="0.1" min="0" value={form.fat} onChange={(e) => updateField('fat', e.target.value)} placeholder="3.2" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Вес (г)</label>
                    <input type="number" step="1" min="0" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} placeholder="930" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL изображения</label>
                  <input type="url" value={form.image} onChange={(e) => updateField('image', e.target.value)} placeholder="https://..." className={inputCls} />
                  {form.image && (
                    <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={form.image} alt="preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-3">
                  <button type="submit" disabled={saving}
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : editingId ? 'Сохранить' : 'Создать товар'}
                  </button>
                  <button type="button" onClick={() => setShowProductModal(false)}
                    className="flex-1 border border-gray-200 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation ===== */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Удалить товар?</h3>
            <p className="text-sm text-gray-500 mb-6">
              «{deleteName}» будет удалён безвозвратно.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Trash2 className="w-4 h-4" /> Удалить</>}
              </button>
              <button onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-200 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Admin Creation Modal ===== */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAdminModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-500 to-violet-500" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Новый администратор</h2>
                    <p className="text-xs text-gray-400">Создание учётной записи</p>
                  </div>
                </div>
                <button onClick={() => setShowAdminModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {adminError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">{adminError}</div>
              )}
              {adminSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                  <Check className="w-4 h-4" /> {adminSuccess}
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Логин</label>
                  <input type="text" value={adminLogin} onChange={(e) => setAdminLogin(e.target.value)} required placeholder="admin2" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пароль</label>
                  <div className="relative">
                    <input type={showAdminPw ? 'text' : 'password'} value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required minLength={6} placeholder="Минимум 6 символов" className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowAdminPw(!showAdminPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600">
                      {showAdminPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={adminSaving}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {adminSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus className="w-4 h-4" /> Создать администратора</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
