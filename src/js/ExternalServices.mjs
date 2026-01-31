const baseURL = "https://wdd330-backend.onrender.com/";

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    // Manejar diferentes formatos de error del servidor
    let errorMessage;

    // Formato 1: {expiration: 'Card expired'}
    if (data.expiration && typeof data.expiration === 'string') {
      errorMessage = data.expiration;
    }
    // Formato 2: {message: 'Error text'}
    else if (data.message && typeof data.message === 'string') {
      errorMessage = data.message;
    }
    // Formato 3: {error: 'Error text'}
    else if (data.error && typeof data.error === 'string') {
      errorMessage = data.error;
    }
    // Formato 4: Cualquier otro objeto con strings
    else if (data && typeof data === 'object') {
      // Buscar cualquier propiedad que sea string
      const stringValues = Object.values(data).filter(val => typeof val === 'string');
      if (stringValues.length > 0) {
        errorMessage = stringValues[0];
      }
    }

    // Si no encontramos mensaje, usar uno por defecto
    errorMessage = errorMessage || "Payment information invalid. Please verify your details.";

    throw new Error(errorMessage);
  }
}

export default class ExternalServices {
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    //const data = await response.json();
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    //const data = await response.json();
    const data = await convertToJson(response);
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

    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);

    /*const response = await fetch(url, options);
    const text = await response.text();
  
    if (!response.ok) {
      throw new Error(`Checkout failed: ${response.status} ${text}`);
    }
  
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }*/
  }

}