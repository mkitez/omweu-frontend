import axios from 'axios';
import debounce from 'lodash.debounce';
import { useState } from 'react';
import { HERE_API_KEY } from '../utils/constants';

interface Suggestion {
  title: string;
  id: string;
  address: {
    label: string;
    countryCode: string;
    countryName: string;
  };
}

interface AutocompleteResponse {
  items: Suggestion[];
}

const fetchData = async (q: string, lang: string) => {
  if (q === '') {
    return [];
  }
  const params = {
    q,
    types: 'city',
    lang,
    apiKey: HERE_API_KEY as string,
  };
  let response;
  try {
    response = await axios.get<AutocompleteResponse>(
      'https://autocomplete.search.hereapi.com/v1/autocomplete',
      { params }
    );
  } catch {
    return [];
  }
  return response.data.items;
};

interface HookParams {
  lang: string;
}

export const useHereAutocomplete = (params: HookParams = { lang: 'en' }) => {
  const [data, setData] = useState<Suggestion[]>([]);

  const _getSuggestions = async (query: string) => {
    const data = await fetchData(query, params.lang);
    setData(data);
  };
  const getSuggestions = debounce(_getSuggestions, 300);

  return { suggestions: data, getSuggestions };
};
