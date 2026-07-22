import { Signal } from "../../../packages/signals/index.js";

const status = {
  isPending: false,
  isCompleted: false,
  isError: false,
  isSuccess: false,
  json: null,
  statusCode: null,
};

const endPoints = {
  fetchProducts: { ...status },
  fetchProductOptions: { ...status },
  saveProduct: { ...status },
};

export class ProductsAPI extends Signal {
  constructor() {
    super(endPoints);
  }

  setLoading(endpoint) {
    this.setValue(collection => {
      collection[endpoint] = { ...status, isPending: true };
    });
  }

  setSuccess(endpoint, json) {
    this.setValue(collection => {
      collection[endpoint] = {
        ...status,
        isCompleted: true,
        isSuccess: true,
        json,
      };
    });
  }

  setError(endpoint, statusCode) {
    this.setValue(collection => {
      collection[endpoint] = {
        ...status,
        isCompleted: true,
        isError: true,
        statusCode,
      };
    });
  }

  async fetchEndpoint(name, url) {
    this.setLoading(name);

    try {
      const response = await fetch(url);
      if (response.ok) {
        const json = await response.json();
        this.setSuccess(name, json);
        return json;
      } else {
        this.setError(name, response.status);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async fetchProducts() {
    return this.fetchEndpoint("fetchProducts", "/api/products");
  }

  async fetchProductOptions() {
    return this.fetchEndpoint("fetchProductOptions", "/api/products/options");
  }

  async saveProduct(product) {
    this.setLoading("saveProduct");

    try {
      const response = await fetch("/api/products/selectedProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        const json = await response.json();
        this.setSuccess("saveProduct", json);
        return json;
      } else {
        this.setError("saveProduct", response.status);
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
