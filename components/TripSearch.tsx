import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { API_URL } from '../utils/constants';
import PlaceInput from './PlaceInput';

const TripSearch = () => {
  const [date, setDate] = useState('');
  const [selectedOrigin, selectOrigin] = useState('');
  const [selectedDest, selectDest] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${API_URL}/trips/search/?origin_id=${selectedOrigin}&dest_id=${selectedDest}&date=${date}`
    );
    const responseJson = await response.json();
    console.log(responseJson);
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PlaceInput
          label="From:"
          initialPlace={selectedOrigin}
          initialValue=""
          onSelect={selectOrigin}
        />
        <PlaceInput
          label="To:"
          initialPlace={selectedDest}
          initialValue=""
          onSelect={selectDest}
        />
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

export default TripSearch;
