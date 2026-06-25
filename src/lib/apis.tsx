const BASE_URL = 'https://cpa-prod-738131651355.asia-south1.run.app';

export const getLeads = async (page = 1, pageSize = 20, filters = {}) => {
  const token = localStorage.getItem("accessToken");
  
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  // Append any filters that have values
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${BASE_URL}/api/careers/careerform_page_list/?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch leads");
  }

  return response.json();
};

export const getPayments = async (page = 1, pageSize = 20, filters = {}) => {
  const token = localStorage.getItem("accessToken");

  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  // Append any filters that have values
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${BASE_URL}/api/careers/payment_page_list/?${params.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
};

// Export excel file
export const exportExcel = async (endpoint: string, filters: Record<string, string | number | boolean | null | undefined> = {}) => {
  const token = localStorage.getItem("accessToken");
  
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(
    `${BASE_URL}${endpoint}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export excel");
  }

  return response.json();
};