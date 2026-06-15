const BASE_URL = 'https://cpa-prod-738131651355.asia-south1.run.app';

export const getLeads = async (page = 1, pageSize = 10) => {

  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/api/careers/careerform_page_list/?pageSize=${pageSize}&page=${page}`,
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

export const getPayments = async (search = "", pageSize = 10) => {

  const token = localStorage.getItem("accessToken");

  const response = await fetch(
    `${BASE_URL}/api/careers/payment_page_list/?search=${search}&pageSize=${pageSize}`,
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