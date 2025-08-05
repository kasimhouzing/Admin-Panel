import axios from 'axios';

// Corrected API URL to match the backend server port
const API_URL = "http://localhost:3000";

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
    return handleApiCall(`${BASE_URL}/updatedusers/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};


