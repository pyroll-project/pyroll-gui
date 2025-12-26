export const getInProfileContour = async (profileData) => {
  try {
    const response = await fetch('http://localhost:8000/api/inprofile-contour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('InProfile Contour API Error:', error);
    return { success: false, error: error.message };
  }
};