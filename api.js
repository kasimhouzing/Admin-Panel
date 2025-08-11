import axios from 'axios';

// Corrected API URL to match the backend server port
const API_URL = "http://localhost:3000";

// Generic API call handler
const handleApiCall = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API call failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};

export const fetchLoginmanagement = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${API_URL}/api/widgets-data`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        const management = response.data;

        console.log("Fetched Login Management:", management);

        if (!Array.isArray(management)) {
            console.warn("Data is not an array:", management);
            return [];
        }

        return management;
    } catch (error) {
        console.error("Error fetching Login Management:", error);
        return [];
    }
};


// add new login management
export const Addloginmanagement = async (management) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/api/addusers`, management, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.management; // Return the actual response data from the server


  } catch (error) {
    throw new Error(error.response?.management?.error || "Failed to add customer");
  }
};


// 3. Update an existing user
export const updateLoginmanagement = async (userId, userData) => {
    return handleApiCall(`${API_URL}/api/updatedusers/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};

// 4. Update a user's status (active/suspended)
export const suspendLoginmanagement = async (userId, newStatus) => {
    return handleApiCall(`${API_URL}/api/users/status/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
    });
};



export const deleteLoginmanagement = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/api/users/${userId}`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        // The server returns a 204 No Content status, so the response.data will be empty.
        // We just need to check if the call was successful.
        return response.status === 204;
    } catch (error) {
        console.error(`Error deactivating user with id ${userId}:`, error);
        // Throw the error to be caught by the handleDelete function
        throw error;
    }
};


export const fetchContractormanagement = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${API_URL}/api/contractorsdata`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        const contractor = response.data;

        console.log("Fetched Login Management:", contractor);

        if (!Array.isArray(contractor)) {
            console.warn("Data is not an array:", contractor);
            return [];
        }

        return contractor;
    } catch (error) {
        console.error("Error fetching Login contractor:", error);
        return [];
    }
};

// POST a new contractor
export const addContractor = async (contractorData) => {
    try {
        const response = await axios.post(`${API_URL}/api/contractorsdata`, contractorData, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding new contractor:", error);
        throw error;
    }
};

// PUT to update a contractor
export const updateContractor = async (id, contractorData) => {
    try {
        const response = await axios.put(`${API_URL}/api/contractorsdata/${id}`, contractorData, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating contractor with id ${id}:`, error);
        throw error;
    }
};

// DELETE a contractor (soft delete)
export const deleteContractor = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/api/contractorsdata/${id}`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Error deleting contractor with id ${id}:`, error);
        throw error;
    }
};

// Cleaner, axios-based version of the suspend user function
export const suspendContractor = async (id, newStatus) => {
    try {
        const response = await axios.put(`${API_URL}/api/contractors/status/${id}`, { status: newStatus }, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Error suspending contractor with id ${id}:`, error);
        throw error;
    }
};

// Assuming you have a way to get the user's token
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Or wherever you store the token
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};


//labo Management fetch the table 
export const fetchlabormanagementdata = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${API_URL}/api/labormanagement`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        const laborers = response.data;

        console.log("Fetched Labor Management:", laborers);

        if (!Array.isArray(laborers)) {
            console.warn("Data is not an array:", laborers);
            return [];
        }

        return laborers;
    } catch (error) {
        console.error("Error fetching Labor Management:", error);
        return [];
    }
};



//add by sagar login

//  Function to handle user login
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/api/login`, credentials);
    // Assuming the backend returns a token upon successful login
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    // It's good practice to throw a specific error for the caller to handle
    throw new Error(error.response?.data?.message || 'Failed to login');
  }
};


//add by sagar login



// POST a new contractor
export const addlabormanagement = async (laborers) => {
    try {
        const response = await axios.post(`${API_URL}/insert-labourer`, laborers, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error adding new contractor:", error);
        throw error;
    }
}



// POST a new labor managenment -> This should be a PUT to update
export const updatelabormanagement = async (labId, labourers) => {
    try {
        // Change from .post to .put
        const response = await axios.put(`${API_URL}/labourer/${labId}`, labourers, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error updating labourer:", error); // Changed log message
        throw error;
    }
}

// Cleaner, axios-based version of the suspend user function
export const suspendLabormanagement = async (userId, newStatus) => {
    try {
        const response = await axios.put(`${API_URL}/api/contractors/status/${userId}`, { status: newStatus }, {
            headers: getAuthHeaders(),
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error(`Error suspending contractor with id ${userId}:`, error);
        throw error;
    }
};


export const getLabourerDetails = async (labId) => {
  console.log("📌 getLabourerDetails called with:", labId); // <--- ADD THIS

  if (!labId) {
    throw new Error("Invalid labId passed to getLabourerDetails");
  }

  try {
    const response = await axios.get(`${API_URL}/api/contractors/${labId}`, {
      headers: getAuthHeaders(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching labourer details for id ${labId}:`, error);
    throw error;
  }
};

export const deleteLabourer = async (labId) => {
  try {
    const response = await fetch(`${API_URL}/api/labourer/${labId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Something went wrong.');
    }

    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error('Error deleting labourer:', error);
    return { success: false, message: error.message };
  }
};