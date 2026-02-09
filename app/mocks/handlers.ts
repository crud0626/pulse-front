import { http, HttpResponse } from 'msw';
import { MOCK_BOOKMARK, MOCK_BOOKMARK_LIST, MOCK_SEARCH_ROUTE_RESULT, MOCK_SEARCH_STATION_RESULT } from './data';

export const handlers = [
  http.get(`${import.meta.env.VITE_API_ENDPOINT}/bookmarks`, () => {
    return HttpResponse.json(MOCK_BOOKMARK_LIST);
  }),
  http.get(`${import.meta.env.VITE_API_ENDPOINT}/bookmark/:id`, () => {
    return HttpResponse.json(MOCK_BOOKMARK);
  }),
  http.get(`${import.meta.env.VITE_API_ENDPOINT}/search/station`, () => {
    return HttpResponse.json(MOCK_SEARCH_STATION_RESULT);
  }),
  http.get(`${import.meta.env.VITE_API_ENDPOINT}/search/route`, () => {
    return HttpResponse.json(MOCK_SEARCH_ROUTE_RESULT);
  }),
];
