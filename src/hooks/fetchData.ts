import axios from "axios";
import { useEffect, useState } from "react";

export default function useFetchData(
  url: string,
  limit: number,
  offset: number
) {
  const [apiFetchError, setApiFetchError] = useState<Error | null>(null);
  const [apiData, setApiData] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState<boolean>(false);

  useEffect(() => {
    setApiLoading(true);

    async function fetchData() {
      try {
        const response = await axios.get(
          `${url}launches?limit=${limit}&offset=${offset}`
        );
        const responseData = response.data;
        setApiData(responseData);
      } catch (error: any) {
        setApiFetchError(error);
      } finally {
        setApiLoading(false);
      }
    }

    fetchData();
  }, [url, limit, offset]);

  return { apiData, apiLoading, apiFetchError };
}
