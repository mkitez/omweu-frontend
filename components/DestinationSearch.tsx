import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { debounce } from '../utils/commonUtils';
import { API_URL } from '../utils/constants';

export interface Destination {
  id: string;
  name: string;
  country: {
    name: string;
  };
}

const DestinationSearch = () => {
  const [date, setDate] = useState('');
  const [originOptions, setOriginOptions] = useState<Destination[]>([]);
  const [destOptions, setDestOptions] = useState<Destination[]>([]);
  const [selectedOrigin, selectOrigin] = useState('');
  const [selectedDest, selectDest] = useState('');

  const destSearch = async (
    query: string,
    callback: typeof setOriginOptions
  ) => {
    const response = await fetch(
      `${API_URL}/destinations/search?query=${query}`
    );
    const responseJson = await response.json();
    callback(responseJson);
  };
  const debouncedSearch = debounce(destSearch, 500);
  const handleOriginInput: FormEventHandler<HTMLInputElement> = async (e) => {
    const value = e.currentTarget.value;
    debouncedSearch(value, setOriginOptions);
  };
  const handleDestInput: FormEventHandler<HTMLInputElement> = async (e) => {
    const value = e.currentTarget.value;
    debouncedSearch(value, setDestOptions);
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${API_URL}/trips/search/?origin=${selectedOrigin}&dest=${selectedDest}&date=${date}`
    );
    const responseJson = await response.json();
    console.log(responseJson);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <input type="text" onInput={handleOriginInput}></input>
        </label>
        <select
          value={selectedOrigin}
          onChange={(e) => selectOrigin(e.target.value)}
        >
          <option value=""></option>
          {originOptions.map((origin) => (
            <option key={origin.id} value={origin.id}>
              {origin.name}
            </option>
          ))}
        </select>
        <label>
          To:
          <input type="text" onInput={handleDestInput}></input>
        </label>
        <select
          value={selectedDest}
          onChange={(e) => selectDest(e.target.value)}
        >
          <option value=""></option>
          {destOptions.map((dest) => (
            <option key={dest.id} value={dest.id}>
              {dest.name}
            </option>
          ))}
        </select>
        <label>
          Date:
          <input
            value={date}
            type="text"
            onInput={(e) => setDate(e.currentTarget.value)}
          ></input>
        </label>
        <input type="submit" value="Search" />
      </form>
    </div>
  );
};

export default DestinationSearch;
