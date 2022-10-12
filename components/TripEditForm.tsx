import { FormEventHandler, useState } from 'react';
import TripService from '../services/trip.service';
import type { Destination } from '../components/DestinationSearch';
import { debounce } from '../utils/commonUtils';

const TripEditForm = ({
  initialOrigin,
  initialDest,
  initialDate,
  submitValue,
  submit,
}: any) => {
  const [originOptions, setOriginOptions] = useState<Destination[]>([]);
  const [destOptions, setDestOptions] = useState<Destination[]>([]);

  const [selectedOrigin, selectOrigin] = useState(initialOrigin?.id || '');
  const [selectedDest, selectDest] = useState(initialDest?.id || '');
  const [date, setDate] = useState(initialDate || '');

  const [error, setError] = useState('');

  const destSearch = async (query: string, callback: Function) => {
    const searchResults = await TripService.searchDestinations(query);
    callback(searchResults);
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
    const data = {
      origin: { name: selectedOrigin },
      dest: { name: selectedDest },
      date,
    };
    try {
      await submit(data);
    } catch (error: any) {
      setError(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          From:
          <input
            type="text"
            onInput={handleOriginInput}
            defaultValue={initialOrigin?.name || ''}
          ></input>
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
          <input
            type="text"
            onInput={handleDestInput}
            defaultValue={initialDest?.name || ''}
          ></input>
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
        <input type="submit" value={submitValue} />
      </form>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default TripEditForm;
