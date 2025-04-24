// src/api/courseApi.js
import axios from "axios";
axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response) {
        // Server responded with a status code outside 2xx
        return Promise.reject({
          message: error.response.data?.message || error.message,
          status: error.response.status,
          data: error.response.data
        });
      } else if (error.request) {
        // Request was made but no response received
        return Promise.reject({
          message: "No response from server",
          status: 0
        });
      }
      // Something happened in setting up the request
      return Promise.reject({
        message: error.message,
        status: -1
      });
    }
  );
  
  // Helper function to handle API responses consistently
  const handleResponse = (response) => {
    return response.data?.data ?? response.data;
  };

const API_BASE = "http://localhost:8081/api";

export async function getMetaTitle(page, decryptedCourseId) {
    try {
        const url = decryptedCourseId
            ? `${API_BASE}/meta-title?page=/course/${decryptedCourseId}`
            : `${API_BASE}/meta-title?page=${page}`;
        const res = await axios.get(url);
        return res.data?.data?.metaTitle || "Default Title | My Website";
    } catch (err) {
        console.error("Error fetching meta title:", err);
        return "Default Title | My Website";
    }
}

export async function getCourses(user) {
    if (!user) return [];
    try {
        const res = await axios.get(`${API_BASE}/courses`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching courses:", err);
        return [];
    }
}
export async function addCourseApi(course) {
    if (!course) return null;
    try {
        const res = await axios.post(`${API_BASE}/courses`, course);
        return res.data?.data || null;
    }
    catch (err) {
        console.error("Error adding course:", err);
        return null;
    }
}

export async function getMenus(encryptedCourseId) {
    try {
        const res = await axios.get(`${API_BASE}/menu/${encryptedCourseId}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching menus:", err);
        return [];
    }
}
export async function addMenuApi(menu, encryptedCourseId) {
    if (!menu) return null;
    try {
        const res = await axios.post(`${API_BASE}/menu/${encryptedCourseId}`, menu);
        return res.data?.data || null;
    }
    catch (err) {
        console.error("Error adding course:", err);
        return null;
    }
}

export async function getContents(menuId) {
    try {
        const res = await axios.get(`${API_BASE}/content/${menuId}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching contents:", err);
        return [];
    }
}
export async function addContentApi(content, encryptedMenuId) {
    if (!content) return null;
    try {
        const res = await axios.post(`${API_BASE}/content/${encryptedMenuId}`, {
            text: content,
        });
        return res.data?.data || null;
    }
    catch (err) {
        console.error("Error adding course:", err);
        return null;
    }
}

export const updateContentApi = async (menuId, contentId, newContent) => {
    const res = await axios.put(
        `${API_BASE}/content/${menuId}/${contentId}`,
        { text: newContent }
    );
    return res.data;
};
export async function getImages(menuId) {
    try {
        const res = await axios.get(`${API_BASE}/images/${menuId}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching images:", err);
        return [];
    }
}
export const uploadImageApi = async (formData) => {
    const res = await axios.post(`${API_BASE}/upload`, formData);
    return res.data;
};


export async function getLivedata() {
    try {
        const res = await axios.get(`${API_BASE}/live-data`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching live data:", err);
        return [];
    }
}



export async function getLocations() {
    try {
        const res = await axios.get(`${API_BASE}/locations`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching locations:", err);
        return [];
    }
}


export const fetchMessages = async (user1, user2) => {
    try {
        const res = await axios.get(`${API_BASE}/chat-history`, {
            params: { user1, user2 }
        });
        return res.data;
    } catch (err) {
        console.error("Error fetching chat history:", err);
        return [];
    }
};

export const uploadFile = async (formData) => {
    try {
        const res = await axios.post(`${API_BASE}/attach`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return res.data.data;
    } catch (err) {
        console.error("Error uploading file:", err);
        return null;
    }
};


export const uploadImage = async (file, menuId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("menuId", menuId);

    try {
        const res = await axios.post(`${API_BASE}/upload`, formData);
        const data = res.data.data;
        if (data?.uploaded) {
            return { default: data.url };
        } else {
            throw new Error(res.data.message || "Failed to upload image");
        }
    } catch (err) {
        console.error("Image upload error:", err);
        throw err;
    }
};

export const loginUser = async (payload) => {
    try {
        const res = await axios.post(`${API_BASE}/auth/login`, payload);
        return res.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};

export const registerUser = async (userData) => {
    try {
        const res = await axios.post(`${API_BASE}/auth/register`, userData);
        return res.data;
    } catch (error) {
        console.error("Registration failed:", error.response?.data || error.message);
        throw error;
    }
};

export const googleLoginUser = async (payload) => {
    try {
        const res = await axios.post(`${API_BASE}/auth/google-login`, payload);
        return res.data;
    } catch (error) {
        console.error("Google login failed:", error.response?.data || error.message);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const res = await axios.post(`${API_BASE}/auth/logout`);
        return res.data;
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
        throw error;
    }
};

export const getUsers=async()=>{
    try {
        const res = await axios.get(`${API_BASE}/auth/user`);
        return res.data;
    } catch (err) {
        console.error("Error fetching users:", err);
        return [];
    }
}


export const getCategories = async () => {
    try {
        const res = await axios.get(`${API_BASE}/categories`);
        // return res.data?.data || [];
        return handleResponse(res) || [];
    } catch (err) {
        console.error("Error fetching categories:", err);
        return [];
    }
}
export const addCategoryApi = async (category) => {
    try {
        const res = await axios.post(`${API_BASE}/categories`, category);
        // return res.data?.data || null;
        return handleResponse(res);
    } catch (err) {
        console.error("Error adding category:", err);
        // return null;
        throw err;
    }
}
export const getItems = async (categoryId) => {
    try {
        const res = await axios.get(`${API_BASE}/items/${categoryId}`);
        // return res.data?.data || [];
        return handleResponse(res) || [];
    } catch (err) {
        console.error("Error fetching items:", err);
        return [];

    }
}

export const addItemApi = async (categoryId, itemData) => {
    try {
        const res = await axios.post(`${API_BASE}/items/${categoryId}`, itemData);
        // return res.data?.data || null;
        return handleResponse(res);
    } catch (err) {
        console.error("Error adding item:", err);
        // return null;
        throw err;
    }
};

export const getphotos=async(itemId)=>{
    try {
        const res = await axios.get(`${API_BASE}/photos/${itemId}`);
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching photos:", err);
        return [];
    }
}
export const addPhotoApi = async ( formData) => {
    try {
        const res = await axios.post(`${API_BASE}/photoUpload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (res.data.data?.uploaded) {
            return res.data.data.photos; 
        }
        throw new Error(res.data.message || "Failed to upload images");
    } catch (err) {
        console.error("Error adding photo:", err);
        throw err;
    }
};




export const addBulkApi = async (formData) => {
    try {
      const res = await axios.post(`${API_BASE}/bulk-upload`, formData, {
        responseType: "blob" // CSV is returned as blob
      });
      return res.data; // blob return karega
    } catch (err) {
      console.error("Error uploading bulk CSV:", err);
      return null;
    }
  };
  
export const addUserLogApi = async (logData) => {
    try {
        const res = await axios.post(`${API_BASE}/add`, logData);
        return res.data?.data || null;
    } catch (err) {
        console.error("Error adding user log:", err);
        return null;
    }
};

export const getUserLogsApi = async (userId) => {
    try {
        const res = await axios.post(`${API_BASE}/get`, { userId });
        return res.data?.data || [];
    } catch (err) {
        console.error("Error fetching user logs:", err);
        return [];
    }
};