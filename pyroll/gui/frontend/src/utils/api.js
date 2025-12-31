import { prepareUnitsForBackend, prepareProfileForBackend } from '../helpers/DataConverter';

export const runSimulation = async (inProfile, passDesignData, solveConfig = null) => {
  try {
    const preparedProfile = prepareProfileForBackend(inProfile);
    const preparedUnits = prepareUnitsForBackend(passDesignData);

    // Build request body
    const requestBody = {
      inProfile: preparedProfile,
      passDesignData: preparedUnits
    };

    // Add solve configuration if provided
    if (solveConfig) {
      requestBody.solve_method = solveConfig.solve_method || 'solve';
      requestBody.solve_params = solveConfig.solve_params || {};
    }

    console.log('Sending to backend:', requestBody);

    const response = await fetch('http://localhost:8000/api/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.pyroll_results
      };
    } else {
      return {
        success: false,
        error: result.errors || 'Unknown simulation error'
      };
    }

  } catch (error) {
    console.error('Simulation API Error:', error);
    return {
      success: false,
      error: error.message || 'Network error - Check if backend is running'
    };
  }
};