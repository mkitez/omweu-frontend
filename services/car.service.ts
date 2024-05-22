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
  black = 'black',
  gray = 'gray',
  silver = 'silver',
  white = 'white',
  red = 'red',
  blue = 'blue',
  gold = 'gold',
  brown = 'brown',
  purple = 'purple',
  beige = 'beige',
  green = 'green',
  orange = 'orange',
}

export interface CarBrandOrModel {
  id: number;
  name: string;
}

export interface Car {
  id: number;
  brand: CarBrandOrModel;
  model: CarBrandOrModel;
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
  getCar(carId: string) {
    return this.api.get(`/cars/${carId}/`);
  }

  createCar(data: CarInputData) {
    return this.api.post('/cars/', data);
  }

  updateCar(carId: number, data: CarInputData) {
    return this.api.put(`/cars/${carId}/`, data);
  }

  deleteCar(carId: number) {
    return this.api.delete(`/cars/${carId}/`);
  }

  getCarBrands() {
    return this.api.get('/cars/brands/');
  }

  getBrandModels(brandId: number) {
    return this.api.get(`/cars/brandmodels/${brandId}/`);
  }
}

export default CarService;
