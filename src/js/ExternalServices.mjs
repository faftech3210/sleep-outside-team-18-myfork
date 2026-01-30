const baseURL = "https://wdd330-backend.onrender.com/";

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await response.json();
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await response.json();
    return data.Result;
  }

  //nuevo checkout

  async checkout(payload) {
  const url = `${baseURL}checkout`;

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Checkout failed: ${response.status} ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

}
