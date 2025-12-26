export const getRollPassContour = async (passData) => {
  try {
    const response = await fetch('http://localhost:8000/api/rollpass-contour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('RollPass Contour API Error:', error);
    return { success: false, error: error.message };
  }
};