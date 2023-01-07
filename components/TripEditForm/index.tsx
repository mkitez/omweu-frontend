import { FormEventHandler, useState } from 'react';
import PlaceInput from './PlaceInput';

const TripEditForm = ({
  initialOrigin,
  initialDest,
  initialDate,
  submitValue,
  submit,
}: any) => {
  const [selectedOrigin, selectOrigin] = useState(initialOrigin?.id || '');
  const [selectedDest, selectDest] = useState(initialDest?.id || '');
  const [date, setDate] = useState(initialDate || '');

  const [error, setError] = useState('');

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    const data = {
      origin_id: selectedOrigin,
      dest_id: selectedDest,
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
        <PlaceInput
          label="From:"
          initialPlace={initialOrigin?.id || ''}
          initialValue=""
          onSelect={selectOrigin}
        />
        <PlaceInput
          label="To:"
          initialPlace={initialDest?.id || ''}
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
        <input type="submit" value={submitValue} />
      </form>
      {error && <div>Error: {error}</div>}
    </div>
  );
};

export default TripEditForm;
