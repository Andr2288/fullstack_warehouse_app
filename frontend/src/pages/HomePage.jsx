import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
    Plus, Edit, Trash2, Package, FolderOpen,
    Search, AlertTriangle, Users, ArrowUpCircle,
    ArrowDownCircle, History
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
    const { authUser } = useAuthStore();
    const [activeTab, setActiveTab] = useState("products");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [stockMovements, setStockMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [showProductModal, setShowProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [showMovementModal, setShowMovementModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSupplier, setEditingSupplier] = useState(null);

    // Form states
    const [productForm, setProductForm] = useState({ name: "", description: "", category_id: "", supplier_id: "", price: "", stock_quantity: "", min_stock_level: "" });
    const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });
    const [supplierForm, setSupplierForm] = useState({ name: "", contact_person: "", phone: "", email: "", address: "" });
    const [movementForm, setMovementForm] = useState({ product_id: "", type: "in", quantity: "", price: "", note: "" });

    const isManager = authUser?.role === 'manager' || authUser?.role === 'admin';

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [productsRes, categoriesRes, suppliersRes, movementsRes] = await Promise.all([
                axiosInstance.get("/products"),
                axiosInstance.get("/categories"),
                axiosInstance.get("/suppliers"),
                axiosInstance.get("/stock-movements")
            ]);

            setProducts(productsRes.data.data || []);
            setCategories(categoriesRes.data.data || []);
            setSuppliers(suppliersRes.data.data || []);
            setStockMovements(movementsRes.data.data || []);
        } catch (error) {
            toast.error("Помилка завантаження даних");
        } finally {
            setLoading(false);
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await axiosInstance.put(`/products/${editingProduct.id}`, productForm);
                toast.success("Товар оновлено");
            } else {
                await axiosInstance.post("/products", productForm);
                toast.success("Товар додано");
            }
            setShowProductModal(false);
            setEditingProduct(null);
            setProductForm({ name: "", description: "", category_id: "", supplier_id: "", price: "", stock_quantity: "", min_stock_level: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Помилка");
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axiosInstance.put(`/categories/${editingCategory.id}`, categoryForm);
                toast.success("Категорію оновлено");
            } else {
                await axiosInstance.post("/categories", categoryForm);
                toast.success("Категорію додано");
            }
            setShowCategoryModal(false);
            setEditingCategory(null);
            setCategoryForm({ name: "", description: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Помилка");
        }
    };

    const handleSupplierSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await axiosInstance.put(`/suppliers/${editingSupplier.id}`, supplierForm);
                toast.success("Постачальника оновлено");
            } else {
                await axiosInstance.post("/suppliers", supplierForm);
                toast.success("Постачальника додано");
            }
            setShowSupplierModal(false);
            setEditingSupplier(null);
            setSupplierForm({ name: "", contact_person: "", phone: "", email: "", address: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Помилка");
        }
    };

    const handleMovementSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/stock-movements", movementForm);
            toast.success(movementForm.type === 'in' ? 'Товар прийнято' : 'Товар видано');
            setShowMovementModal(false);
            setMovementForm({ product_id: "", type: "in", quantity: "", price: "", note: "" });
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Помилка");
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm("Підтвердіть видалення")) return;
        try {
            await axiosInstance.delete(`/${type}/${id}`);
            toast.success("Видалено");
            loadData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Помилка");
        }
    };

    const filtered = {
        products: products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
        categories: categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
        suppliers: suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    };

    const lowStockProducts = products.filter(p => p.stock_quantity <= p.min_stock_level);

    if (loading) return <div className="flex items-center justify-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-2">Панель управління складом</h1>
            <p className="text-base-content/60 mb-6">Керуйте товарами, категоріями та постачальниками</p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-primary"><Package className="w-8 h-8" /></div>
                    <div className="stat-title">Товарів</div>
                    <div className="stat-value text-primary">{products.length}</div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-secondary"><FolderOpen className="w-8 h-8" /></div>
                    <div className="stat-title">Категорій</div>
                    <div className="stat-value text-secondary">{categories.length}</div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-warning"><AlertTriangle className="w-8 h-8" /></div>
                    <div className="stat-title">Низькі залишки</div>
                    <div className="stat-value text-warning">{lowStockProducts.length}</div>
                </div>
                <div className="stat bg-base-100 rounded-lg shadow">
                    <div className="stat-figure text-accent"><Users className="w-8 h-8" /></div>
                    <div className="stat-title">Постачальників</div>
                    <div className="stat-value text-accent">{suppliers.length}</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs tabs-boxed mb-4">
                {['products', 'categories', 'suppliers', 'movements'].map((tab) => (
                    <a key={tab} className={`tab ${activeTab === tab ? 'tab-active' : ''}`} onClick={() => setActiveTab(tab)}>
                        {tab === 'products' && <><Package className="w-4 h-4 mr-2" />Товари</>}
                        {tab === 'categories' && <><FolderOpen className="w-4 h-4 mr-2" />Категорії</>}
                        {tab === 'suppliers' && <><Users className="w-4 h-4 mr-2" />Постачальники</>}
                        {tab === 'movements' && <><History className="w-4 h-4 mr-2" />Рух товарів</>}
                    </a>
                ))}
            </div>

            {/* Search and Actions */}
            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input type="text" placeholder="Пошук..." className="input input-bordered w-full pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>

                {isManager && (
                    <button className="btn btn-primary" onClick={() => {
                        if (activeTab === 'products') { setEditingProduct(null); setShowProductModal(true); }
                        else if (activeTab === 'categories') { setEditingCategory(null); setShowCategoryModal(true); }
                        else if (activeTab === 'suppliers') { setEditingSupplier(null); setShowSupplierModal(true); }
                        else if (activeTab === 'movements') { setShowMovementModal(true); }
                    }}>
                        <Plus className="w-5 h-5 mr-2" />Додати
                    </button>
                )}
            </div>

            {/* Tables */}
            <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
                {activeTab === 'products' && (
                    <table className="table">
                        <thead><tr><th>Назва</th><th>Категорія</th><th>Постачальник</th><th>Ціна</th><th>Залишок</th><th>Мін</th>{isManager && <th>Дії</th>}</tr></thead>
                        <tbody>
                        {filtered.products.map((p) => (
                            <tr key={p.id} className={p.stock_quantity <= p.min_stock_level ? 'bg-warning/10' : ''}>
                                <td><div className="font-bold">{p.name}</div><div className="text-sm opacity-50">{p.description}</div></td>
                                <td>{p.category_name || '-'}</td>
                                <td>{p.supplier_name || '-'}</td>
                                <td>{p.price} ₴</td>
                                <td><span className={`badge ${p.stock_quantity <= p.min_stock_level ? 'badge-warning' : 'badge-success'}`}>{p.stock_quantity}</span></td>
                                <td>{p.min_stock_level}</td>
                                {isManager && (
                                    <td><div className="flex gap-2">
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingProduct(p); setProductForm({ name: p.name, description: p.description || "", category_id: p.category_id || "", supplier_id: p.supplier_id || "", price: p.price, stock_quantity: p.stock_quantity, min_stock_level: p.min_stock_level }); setShowProductModal(true); }}><Edit className="w-4 h-4" /></button>
                                        <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete('products', p.id)}><Trash2 className="w-4 h-4" /></button>
                                    </div></td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'categories' && (
                    <table className="table">
                        <thead><tr><th>Назва</th><th>Опис</th><th>Дата</th>{isManager && <th>Дії</th>}</tr></thead>
                        <tbody>
                        {filtered.categories.map((c) => (
                            <tr key={c.id}>
                                <td className="font-bold">{c.name}</td>
                                <td>{c.description || '-'}</td>
                                <td>{new Date(c.created_at).toLocaleDateString('uk-UA')}</td>
                                {isManager && (
                                    <td><div className="flex gap-2">
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingCategory(c); setCategoryForm({ name: c.name, description: c.description || "" }); setShowCategoryModal(true); }}><Edit className="w-4 h-4" /></button>
                                        <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete('categories', c.id)}><Trash2 className="w-4 h-4" /></button>
                                    </div></td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'suppliers' && (
                    <table className="table">
                        <thead><tr><th>Назва</th><th>Контакт</th><th>Телефон</th><th>Email</th><th>Адреса</th>{isManager && <th>Дії</th>}</tr></thead>
                        <tbody>
                        {filtered.suppliers.map((s) => (
                            <tr key={s.id}>
                                <td className="font-bold">{s.name}</td>
                                <td>{s.contact_person || '-'}</td>
                                <td>{s.phone || '-'}</td>
                                <td>{s.email || '-'}</td>
                                <td>{s.address || '-'}</td>
                                {isManager && (
                                    <td><div className="flex gap-2">
                                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingSupplier(s); setSupplierForm({ name: s.name, contact_person: s.contact_person || "", phone: s.phone || "", email: s.email || "", address: s.address || "" }); setShowSupplierModal(true); }}><Edit className="w-4 h-4" /></button>
                                        <button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete('suppliers', s.id)}><Trash2 className="w-4 h-4" /></button>
                                    </div></td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'movements' && (
                    <table className="table">
                        <thead><tr><th>Дата</th><th>Товар</th><th>Тип</th><th>Кількість</th><th>Ціна</th><th>Користувач</th><th>Примітка</th>{isManager && <th>Дії</th>}</tr></thead>
                        <tbody>
                        {stockMovements.map((m) => (
                            <tr key={m.id}>
                                <td>{new Date(m.created_at).toLocaleString('uk-UA')}</td>
                                <td className="font-bold">{m.product_name}</td>
                                <td>
                                    {m.type === 'in' ? (
                                        <span className="badge badge-success gap-2"><ArrowUpCircle className="w-4 h-4" />Прийом</span>
                                    ) : (
                                        <span className="badge badge-error gap-2"><ArrowDownCircle className="w-4 h-4" />Видача</span>
                                    )}
                                </td>
                                <td>{m.quantity}</td>
                                <td>{m.price ? `${m.price} ₴` : '-'}</td>
                                <td>{m.user_name}</td>
                                <td>{m.note || '-'}</td>
                                {isManager && (
                                    <td><button className="btn btn-ghost btn-sm text-error" onClick={() => handleDelete('stock-movements', m.id)}><Trash2 className="w-4 h-4" /></button></td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-lg mb-4">{editingProduct ? 'Редагувати товар' : 'Додати товар'}</h3>
                        <form onSubmit={handleProductSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control col-span-2">
                                    <label className="label"><span className="label-text">Назва *</span></label>
                                    <input type="text" className="input input-bordered" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required />
                                </div>
                                <div className="form-control col-span-2">
                                    <label className="label"><span className="label-text">Опис</span></label>
                                    <textarea className="textarea textarea-bordered" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Категорія</span></label>
                                    <select className="select select-bordered" value={productForm.category_id} onChange={(e) => setProductForm({...productForm, category_id: e.target.value})}>
                                        <option value="">Без категорії</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Постачальник</span></label>
                                    <select className="select select-bordered" value={productForm.supplier_id} onChange={(e) => setProductForm({...productForm, supplier_id: e.target.value})}>
                                        <option value="">Без постачальника</option>
                                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Ціна *</span></label>
                                    <input type="number" step="0.01" className="input input-bordered" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text">Кількість *</span></label>
                                    <input type="number" className="input input-bordered" value={productForm.stock_quantity} onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})} required />
                                </div>
                                <div className="form-control col-span-2">
                                    <label className="label"><span className="label-text">Мін. залишок *</span></label>
                                    <input type="number" className="input input-bordered" value={productForm.min_stock_level} onChange={(e) => setProductForm({...productForm, min_stock_level: e.target.value})} required />
                                </div>
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => { setShowProductModal(false); setEditingProduct(null); }}>Скасувати</button>
                                <button type="submit" className="btn btn-primary">{editingProduct ? 'Оновити' : 'Додати'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">{editingCategory ? 'Редагувати категорію' : 'Додати категорію'}</h3>
                        <form onSubmit={handleCategorySubmit}>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Назва *</span></label>
                                <input type="text" className="input input-bordered" value={categoryForm.name} onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})} required />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Опис</span></label>
                                <textarea className="textarea textarea-bordered" value={categoryForm.description} onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})} />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => { setShowCategoryModal(false); setEditingCategory(null); }}>Скасувати</button>
                                <button type="submit" className="btn btn-primary">{editingCategory ? 'Оновити' : 'Додати'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Supplier Modal */}
            {showSupplierModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">{editingSupplier ? 'Редагувати постачальника' : 'Додати постачальника'}</h3>
                        <form onSubmit={handleSupplierSubmit}>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Назва *</span></label>
                                <input type="text" className="input input-bordered" value={supplierForm.name} onChange={(e) => setSupplierForm({...supplierForm, name: e.target.value})} required />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Контактна особа</span></label>
                                <input type="text" className="input input-bordered" value={supplierForm.contact_person} onChange={(e) => setSupplierForm({...supplierForm, contact_person: e.target.value})} />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Телефон</span></label>
                                <input type="tel" className="input input-bordered" value={supplierForm.phone} onChange={(e) => setSupplierForm({...supplierForm, phone: e.target.value})} />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Email</span></label>
                                <input type="email" className="input input-bordered" value={supplierForm.email} onChange={(e) => setSupplierForm({...supplierForm, email: e.target.value})} />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Адреса</span></label>
                                <textarea className="textarea textarea-bordered" value={supplierForm.address} onChange={(e) => setSupplierForm({...supplierForm, address: e.target.value})} />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => { setShowSupplierModal(false); setEditingSupplier(null); }}>Скасувати</button>
                                <button type="submit" className="btn btn-primary">{editingSupplier ? 'Оновити' : 'Додати'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Movement Modal */}
            {showMovementModal && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Рух товару</h3>
                        <form onSubmit={handleMovementSubmit}>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Товар *</span></label>
                                <select className="select select-bordered" value={movementForm.product_id} onChange={(e) => setMovementForm({...movementForm, product_id: e.target.value})} required>
                                    <option value="">Оберіть товар</option>
                                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Тип *</span></label>
                                <select className="select select-bordered" value={movementForm.type} onChange={(e) => setMovementForm({...movementForm, type: e.target.value})} required>
                                    <option value="in">Прийом</option>
                                    <option value="out">Видача</option>
                                </select>
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Кількість *</span></label>
                                <input type="number" min="1" className="input input-bordered" value={movementForm.quantity} onChange={(e) => setMovementForm({...movementForm, quantity: e.target.value})} required />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Ціна</span></label>
                                <input type="number" step="0.01" className="input input-bordered" value={movementForm.price} onChange={(e) => setMovementForm({...movementForm, price: e.target.value})} />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label"><span className="label-text">Примітка</span></label>
                                <textarea className="textarea textarea-bordered" value={movementForm.note} onChange={(e) => setMovementForm({...movementForm, note: e.target.value})} />
                            </div>
                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => setShowMovementModal(false)}>Скасувати</button>
                                <button type="submit" className="btn btn-success">Підтвердити</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;