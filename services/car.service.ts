import BaseService from './baseService';

export enum BodyType {
  'SEDAN',
  'HATCHBACK',
  'ESTATE',
  'SUV',
  'MINIVAN',
  'OTHER',
}

export enum CarColor {
  'black',
  'white',
  'red',
  'blue'
}

export interface Car {
  id: number;
  brand: string;
  model: string;
  body_type: BodyType;
  color: CarColor;
  year: number;
  passenger_seats: number;
  owner: number;
  is_primary: boolean;
}

export interface CarInputData {
  model_id: number;
  body_type: BodyType;
  color: CarColor;
  year: number;
  passenger_seats: number;
  is_primary: boolean;
}

class CarService extends BaseService {
  createCar(data: CarInputData) {
    return this.api.post('/cars/', data)
  }

  updateCar(data: CarInputData & { id: number }) {
    return this.api.put(`/cars/${data.id}/`, data);
  }

  deleteCar(carId: number) {
    return this.api.delete(`/cars/${carId}/`);
  }

  getCarBrands() {
    return this.api.get('/cars/brands/')
  }

  getBrandModels(brandId: number) {
    return this.api.get(`/cars/brandmodels/${brandId}/`)
  }
}

export default CarService;
