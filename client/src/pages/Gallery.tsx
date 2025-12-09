import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Globe,
  Plus,
  Upload,
  Trash,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getImageUrl } from "../lib/api";
// import { pageBackgrounds } from '../assets/videos';

interface GalleryImage {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // Dynamic category slug
  uploadedBy: {
    email: string;
  };
  createdAt: string;
}

const Gallery: React.FC = () => {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    category: "",
    image: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);

  const [deleteMode, setDeleteMode] = useState(false);
  // No static fallback images - show only DB-backed images
  const staticImages: GalleryImage[] = [];

  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; icon?: React.ReactNode }>
  >([{ id: "all", name: "All", icon: <Globe className="w-4 h-4" /> }]);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await axios.get("/categories?type=gallery");
        const data = res.data?.data || [];
        const mapped = data.map((c: any) => ({ id: c.slug, name: c.name }));
        setCategories((prev) => [
          ...prev.filter((p) => p.id === "all"),
          ...mapped,
        ]);
        // Don't auto-select category - let user choose explicitly
      } catch (err) {
        console.error("Failed to load gallery categories", err);
      }
    };
    loadCategories();
  }, []);
  const toggleSelect = (id: string) => {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  };

  const clearSelection = () => setSelectedIds({});

  const handleBulkDelete = async () => {
    const ids = Object.keys(selectedIds).filter((id) => selectedIds[id]);
    if (ids.length === 0) {
      toast.error("No images selected");
      return;
    }
    // confirmation is handled by modal
    // caller must set showConfirmModal(true) before invoking this

    try {
      await Promise.all(ids.map((id) => axios.delete(`/gallery/${id}`)));
      toast.success("Selected images deleted");
      setDeleteMode(false);
      clearSelection();
      fetchImages();
    } catch (err: any) {
      console.error("Failed to delete images:", err);
      toast.error(err.response?.data?.error || "Failed to delete images");
    }
  };

  // Fetch images from API
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("/gallery");
      // Only use API images (server now returns absolute URLs)
      setImages(response.data.data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      // If API fails, show only static images
      setImages(staticImages);
      toast.error("Failed to fetch gallery images, showing default images");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.description || !uploadForm.image) {
      toast.error("Please fill in all fields and select an image");
      return;
    }

    if (!uploadForm.category) {
      toast.error("Please select a category");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("description", uploadForm.description);
      formData.append("category", uploadForm.category);
      formData.append("image", uploadForm.image);

      await axios.post("/gallery", formData);

      toast.success("Image uploaded successfully!");
      setShowUploadModal(false);
      setUploadForm({
        title: "",
        description: "",
        category: "",
        image: null,
      });
      fetchImages(); // Refresh the gallery
    } catch (error: any) {
      // Show server-provided error when available
      const serverMsg = error?.response?.data?.error || error?.message;
      console.error("Error uploading image:", error?.response?.data || error);
      toast.error(serverMsg || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, image: e.target.files[0] });
    }
  };

  const filteredImages = images.filter((image) => {
    const matchesCategory =
      selectedCategory === "all" || image.category === selectedCategory;
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const nextImage = () => {
    if (selectedImage !== null && filteredImages.length > 0) {
      const currentIndex = filteredImages.findIndex(
        (img) => img._id === selectedImage
      );
      const nextIndex = (currentIndex + 1) % filteredImages.length;
      const nextImage = filteredImages[nextIndex];
      if (nextImage) {
        setSelectedImage(nextImage._id);
      }
    }
  };

  const prevImage = () => {
    if (selectedImage !== null && filteredImages.length > 0) {
      const currentIndex = filteredImages.findIndex(
        (img) => img._id === selectedImage
      );
      const prevIndex =
        currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
      const prevImage = filteredImages[prevIndex];
      if (prevImage) {
        setSelectedImage(prevImage._id);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="text-blue-300">Our Gallery</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* { Search Bar }
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

            {/* Admin Controls (top of page) */}
            {user?.role === "admin" && (
              <div className="flex flex-wrap gap-2 ml-auto">
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
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Image
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
                      onClick={() => setShowConfirmModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg shadow"
                    >
                      Delete Selected
                    </button>
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
            )}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading gallery...</p>
              </div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
            >
              <AnimatePresence>
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedImage(image._id)}
                  >
                    <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                      {deleteMode && (
                        <input
                          type="checkbox"
                          checked={!!selectedIds[image._id]}
                          onChange={() => toggleSelect(image._id)}
                          className="absolute z-20 top-3 left-3 w-5 h-5 bg-white rounded"
                        />
                      )}
                      <img
                        src={getImageUrl(image.imageUrl)}
                        alt={image.title}
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-semibold text-lg mb-1">
                            {image.title}
                          </h3>
                          <p className="text-sm text-gray-200 line-clamp-2">
                            {image.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Admin controls moved to top */}

          {/* Add Category Modal */}
          {showAddCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Add Category</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a new gallery category.
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
                          type: "gallery",
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

          {/* Delete Category Modal */}
          {showDeleteCategoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Delete Category</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Select a category to delete.
                </p>
                <p className="text-sm text-red-600 font-semibold mb-4">
                  Warning: This will permanently delete the category and ALL
                  images within it!
                </p>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
                  defaultValue=""
                  id="delete-category-select"
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
                        "delete-category-select"
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
                        toast.success("Category and all images deleted");
                        setShowDeleteCategoryModal(false);
                        // Reset to "all" if deleted category was selected
                        if (selectedCategory === categorySlug) {
                          setSelectedCategory("all");
                        }
                        // Refresh gallery to remove deleted images
                        fetchImages();
                      } catch (err: any) {
                        console.error("Failed to delete category", err);
                        toast.error(
                          err.response?.data?.error ||
                            "Failed to delete category"
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

          {filteredImages.length === 0 && (
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
                No images found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}

          {/* Confirm Deletion Modal */}
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                <h3 className="text-lg font-semibold mb-4">Confirm deletion</h3>
                <p className="mb-4">
                  Are you sure you want to delete the selected images? This
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
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const image = images.find((img) => img._id === selectedImage);
                if (!image) return null;

                return (
                  <>
                    <div className="relative">
                      <img
                        src={
                          image.imageUrl.startsWith("/images/")
                            ? image.imageUrl
                            : getImageUrl(image.imageUrl)
                        }
                        alt={image.title}
                        className="w-full h-auto max-h-[70vh] object-contain"
                      />
                      <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                      >
                        <X className="w-6 h-6 text-gray-600" />
                      </button>

                      {/* Navigation buttons */}
                      {filteredImages.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <ChevronLeft className="w-6 h-6 text-gray-600" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                          >
                            <ChevronRight className="w-6 h-6 text-gray-600" />
                          </button>
                        </>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {image.title}
                      </h3>
                      <p className="text-gray-600">{image.description}</p>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              className="relative max-w-md w-full bg-white rounded-xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Upload New Image
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter image title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter image description"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) =>
                        setUploadForm({
                          ...uploadForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.slice(1).map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleImageChange}
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                    {uploadForm.image && (
                      <p className="mt-2 text-sm text-gray-600">
                        Selected: {uploadForm.image.name}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
