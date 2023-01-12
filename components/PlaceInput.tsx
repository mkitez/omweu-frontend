import { FormEventHandler, useState } from 'react';
import useGoogle from 'react-google-autocomplete/lib/usePlacesAutocompleteService';
import { GOOGLE_API_KEY } from '../utils/constants';

interface Props {
  label: string;
  initialValue: string;
  initialPlace: string;
  onSelect(placeId: string): void;
}

const PlaceInput = ({ label, initialValue, initialPlace, onSelect }: Props) => {
  const [selectedPlace, selectPlace] = useState(initialPlace);
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: GOOGLE_API_KEY,
      options: {
        types: ['(cities)'],
      },
    });

  const handleInput: FormEventHandler<HTMLInputElement> = async (e) => {
    const value = e.currentTarget.value;
    getPlacePredictions({ input: value });
  };

  return (
    <>
      <label>
        {label}
        <input type="text" onInput={handleInput} defaultValue={initialValue} />
      </label>
      <select
        value={selectedPlace}
        onChange={(e) => {
          selectPlace(e.target.value);
          onSelect(e.target.value);
        }}
      >
        <option value=""></option>
        {!isPlacePredictionsLoading &&
          placePredictions.map((place) => (
            <option key={place.place_id} value={place.place_id}>
              {place.description}
            </option>
          ))}
      </select>
    </>
  );
};

export default PlaceInput;
