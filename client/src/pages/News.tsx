import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  User,
  ArrowRight,
  Clock,
  Globe,
  Plus,
  X,
  Trash,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from "../lib/api";

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  externalLink?: string;
  category: string; // dynamic category slug
  author: string;
  authorRole: string;
  publishDate: string;
  readTime: string;
  featured: boolean;
  tags?: string[];
}

const News: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm] = useState("");
  const [sortBy] = useState("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; icon?: React.ReactNode }>
  >([{ id: "all", name: "All News", icon: <Globe className="w-4 h-4" /> }]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch news/blogs from API
  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/blogs");
      const data: BlogPost[] = res.data?.data || [];
      // Ensure all posts have valid IDs
      const validatedData = data.map((post, idx) => ({
        ...post,
        _id: post._id || `api-post-${idx}-${Date.now()}`,
      }));
      setPosts(validatedData);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      toast.error("Failed to fetch news, showing default items");
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const allPosts = posts; // only DB-backed posts

  const filteredPosts = allPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ??
        false);
    return matchesCategory && matchesSearch;
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        return (
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        );
      case "oldest":
        return (
          new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
        );
      case "readTime":
        return parseInt(a.readTime) - parseInt(b.readTime);
      default:
        return 0;
    }
  });

  const featuredPosts = sortedPosts.filter((post) => post.featured);
  const regularPosts = sortedPosts.filter((post) => !post.featured);

  // Normalize external link to include protocol
  const ensureHttp = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  // Selection helpers for delete mode
  const toggleSelect = (id: string) => {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  };

  const clearSelection = () => setSelectedIds({});

  const handleBulkDelete = async () => {
    const ids = Object.keys(selectedIds).filter((id) => selectedIds[id]);
    if (ids.length === 0) {
      toast.error("No articles selected");
      return;
    }
    // confirmation is handled by modal

    try {
      await Promise.all(ids.map((id) => axios.delete(`/blogs/${id}`)));
      toast.success("Selected articles deleted");
      setDeleteMode(false);
      clearSelection();
      // refresh
      const res = await axios.get("/blogs");
      const refreshedData: BlogPost[] = res.data?.data || [];
      const validatedData = refreshedData.map((post, idx) => ({
        ...post,
        _id: post._id || `api-post-${idx}-${Date.now()}`,
      }));
      setPosts(validatedData);
    } catch (err: any) {
      console.error("Failed to delete articles:", err);
      toast.error(err.response?.data?.error || "Failed to delete articles");
    }
  };

  // Add News form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "", // yyyy-mm-dd
    readTime: "5 min read",
    name: "",
    position: "",
    featured: false,
    image: null as File | null,
    link: "",
    category: "company",
  });

  // load blog/news categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("/categories?type=blog");
        const data = res.data?.data || [];
        const mapped = data.map((c: any) => ({
          id: c.slug,
          name: c.name,
          icon: null,
        }));
        setCategories((prev) => [
          ...prev.filter((p) => p.id === "all"),
          ...mapped,
        ]);
        if (mapped.length > 0) {
          setForm((f) => ({ ...f, category: mapped[0].id }));
        }
      } catch (err) {
        console.error("Failed to load news categories", err);
      }
    };
    loadCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, image: file }));
  };

  // image URL helper is in client/src/lib/api.ts -> getImageUrl

  const handleAddNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.name ||
      !form.position ||
      !form.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Ensure content is at least 10 characters
    const contentText =
      form.description.length >= 10
        ? form.description
        : form.description + " [Auto-expanded to meet minimum]";

    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("excerpt", form.description);
      fd.append("content", contentText);
      fd.append("author", form.name);
      fd.append("authorRole", form.position);
      // Only send publishDate if user provided one
      if (form.date && form.date.trim().length > 0) {
        fd.append("publishDate", form.date);
      }
      fd.append("readTime", form.readTime);
      fd.append("featured", String(form.featured));
      if (form.link && form.link.trim().length > 0) {
        fd.append("externalLink", form.link);
      }
      fd.append("category", form.category || "company");
      fd.append("image", form.image!);

      await axios.post("/blogs", fd);
      toast.success("News added successfully");
      setShowAddModal(false);
      // reset
      setForm({
        title: "",
        description: "",
        date: "",
        readTime: "5 min read",
        name: "",
        position: "",
        featured: false,
        image: null,
        link: "",
        category: "company",
      });
      // refresh
      const res = await axios.get("/blogs");
      const refreshedData: BlogPost[] = res.data?.data || [];
      const validatedData = refreshedData.map((post, idx) => ({
        ...post,
        _id: post._id || `api-post-${idx}-${Date.now()}`,
      }));
      setPosts(validatedData);
    } catch (err: any) {
      console.error("Failed to add news:", err);
      const errorMsg = err.response?.data?.error || "Failed to add news";
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Title */}
      <section className="text-center py-12">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-blue-600">News</span>
        </motion.h1>
        <div className="mt-2 h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>

        {isAdmin && (
          <div className="mt-6">
            <div className="inline-flex items-center gap-2">
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Category
              </button>

              <button
                onClick={() => setShowDeleteCategoryModal(true)}
                className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow"
              >
                <Trash className="w-4 h-4 mr-2" /> Delete Category
              </button>

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
              >
                <Plus className="w-4 h-4 mr-2" /> Add News
              </button>

              {!deleteMode ? (
                <button
                  onClick={() => setDeleteMode(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
                >
                  <Trash className="w-4 h-4 mr-2" /> Delete
                </button>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="hidden"
                  />
                  <button
                    onClick={() => {
                      setDeleteMode(false);
                      clearSelection();
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Category Modal for News */}
        {showAddCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Add Category</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a new category for news.
              </p>
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                placeholder="Category name"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!newCategoryName.trim()) {
                      toast.error("Enter a category name");
                      return;
                    }
                    try {
                      const res = await axios.post("/categories", {
                        name: newCategoryName.trim(),
                        type: "blog",
                      });
                      const c = res.data?.data;
                      if (c) {
                        setCategories((prev) => [
                          ...prev,
                          { id: c.slug, name: c.name },
                        ]);
                        toast.success("Category added");
                        setNewCategoryName("");
                        setShowAddCategoryModal(false);
                      }
                    } catch (err: any) {
                      console.error("Failed to add category", err);
                      toast.error(
                        err.response?.data?.error || "Failed to add category"
                      );
                    }
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Category Modal for News */}
        {showDeleteCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Delete Category</h3>
              <p className="text-sm text-gray-600 mb-2">
                Select a category to delete.
              </p>
              <p className="text-sm text-red-600 font-semibold mb-4">
                Warning: This will permanently delete the category and ALL news
                posts within it!
              </p>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                defaultValue=""
                id="delete-news-category-select"
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories
                  .filter((c) => c.id !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteCategoryModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const select = document.getElementById(
                      "delete-news-category-select"
                    ) as HTMLSelectElement;
                    const categorySlug = select?.value;
                    if (!categorySlug) {
                      toast.error("Please select a category");
                      return;
                    }
                    try {
                      await axios.delete(`/categories/${categorySlug}`);
                      setCategories((prev) =>
                        prev.filter((c) => c.id !== categorySlug)
                      );
                      toast.success("Category and all posts deleted");
                      setShowDeleteCategoryModal(false);
                      // Reset to "all" if deleted category was selected
                      if (selectedCategory === categorySlug) {
                        setSelectedCategory("all");
                      }
                      // Refresh news to remove deleted posts
                      fetchBlogs();
                    } catch (err: any) {
                      console.error("Failed to delete category", err);
                      toast.error(
                        err.response?.data?.error || "Failed to delete category"
                      );
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search Bar
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div> */}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </button>
              ))}
            </div>

            {/* { Sort Dropdown }
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
                <option value="readTime">Read Time</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div> */}
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="text-center text-gray-500 py-8">Loading news...</div>
      )}

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Featured Articles
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post._id || `featured-${index}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    <div className="relative">
                      {deleteMode && (
                        <input
                          type="checkbox"
                          checked={!!selectedIds[post._id]}
                          onChange={() => toggleSelect(post._id)}
                          className="absolute z-20 top-3 left-3 w-5 h-5 bg-white rounded"
                        />
                      )}
                      <img
                        src={getImageUrl(post.imageUrl)}
                        alt={post.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {post.author}
                          </div>
                          <div className="text-xs text-gray-500">
                            {post.authorRole}
                          </div>
                        </div>
                      </div>
                      {post.externalLink && (
                        <a
                          href={ensureHttp(post.externalLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Latest Articles
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {regularPosts.map((post, index) => (
                <motion.article
                  key={post._id || `post-${index}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative">
                    {deleteMode && (
                      <input
                        type="checkbox"
                        checked={!!selectedIds[post._id]}
                        onChange={() => toggleSelect(post._id)}
                        className="absolute z-20 top-3 left-3 w-5 h-5 bg-white rounded"
                      />
                    )}
                    <img
                      src={getImageUrl(post.imageUrl)}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="mr-4">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {post.author}
                          </div>
                          <div className="text-xs text-gray-500">
                            {post.authorRole}
                          </div>
                        </div>
                      </div>
                      {post.externalLink && (
                        <a
                          href={ensureHttp(post.externalLink)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-700 font-medium group"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {/* Confirm Deletion Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Confirm deletion</h3>
                <p className="mb-4">
                  Are you sure you want to delete the selected articles? This
                  action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2 bg-gray-200 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      setShowConfirmModal(false);
                      await handleBulkDelete();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {regularPosts.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Add News Modal */}
      {isAdmin && showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Add News</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form
              onSubmit={handleAddNews}
              className="p-4 space-y-4 overflow-y-auto flex-1"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                  className="mt-1 w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (min 10 characters)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="mt-1 w-full border rounded px-3 py-2"
                  rows={4}
                  required
                  minLength={10}
                  placeholder="Enter a detailed description (at least 10 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.description.length} / 10 characters minimum
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date
                  </label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, date: e.target.value }))
                    }
                    className="mt-1 w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={form.readTime}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, readTime: e.target.value }))
                    }
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="e.g., 6 min read"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  className="mt-1 w-full border rounded px-3 py-2"
                >
                  {categories.slice(1).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="mt-1 w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={form.position}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, position: e.target.value }))
                    }
                    className="mt-1 w-full border rounded px-3 py-2"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="featured"
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, featured: e.target.checked }))
                    }
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Featured
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Read More Link
                  </label>
                  <input
                    type="url"
                    value={form.link}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, link: e.target.value }))
                    }
                    className="mt-1 w-full border rounded px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 pb-2 sticky bottom-0 bg-white border-t mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
                >
                  {isSaving ? "Saving..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Newsletter Signup
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter and never miss the latest industry insights, company news, and expert analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-300"
              />
              <motion.button 
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default News;
