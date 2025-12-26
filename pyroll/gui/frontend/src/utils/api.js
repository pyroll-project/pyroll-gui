export const runSimulation = async (inProfile, passDesignData) => {
  try {
    const response = await fetch('http://localhost:8000/api/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inProfile: inProfile,
        passDesignData: passDesignData
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Simulation API Error:', error);
    return { success: false, error: error.message };
  }
};

export const getDefaultParameters = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/parameters');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, error: error.message };
  }
};

// Optional: Health Check
export const checkBackendHealth = async () => {
  try {
    const response = await fetch('http://localhost:8000/health');
    return response.ok;
  } catch (error) {
    return false;
  }
};